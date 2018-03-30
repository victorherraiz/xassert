/* eslint valid-jsdoc: 2 */
'use strict'

function isAPromise (promise) {
  return promise !== null &&
    (typeof promise === 'object' || typeof promise === 'function') &&
    typeof promise.then === 'function'
}

function deepEquals (a, b) {
  if (a === b) return true
  if (a === null || b === null) return false

  const type = typeof a
  const otherType = typeof b

  // TODO SUPPORT SYMBOLS
  if (type !== otherType || type !== 'object' || a.constructor !== b.constructor) {
    return false
  }

  if (Array.isArray(a)) {
    if (a.length === b.length) return a.every((el, i) => deepEquals(el, b[i]))
    return false
  }

  const names = Object.getOwnPropertyNames(a)
  if (names.length !== Object.getOwnPropertyNames(b).length) return false
  return names.every((n) => b.hasOwnProperty(n) && deepEquals(a[n], b[n]))
}

const messageField = /{([\s\S]+?)}/g
function processMessage (message, values) {
  return message.replace(messageField, (match, field) => {
    if (field in values) return values[field]
    return match
  })
}

function requireTestFunction (fn, message = 'Test function required') {
  if (typeof fn !== 'function') throw new Error(message)
}

/**
 * Assertions will throw this error when a test fails
 */
class AssertionError extends Error {
  /**
   * @param {string} message - Error message
   * @param {*} [actual] - Actual value
   * @param {*} [expected] - Expected value
   */
  constructor (message, actual, expected) {
    super(message)
    this.name = 'Assertion Error'
    this.actual = actual
    this.expected = expected
  }
}

/**
 * @typedef {function(Assertion)} assertionCallback
 */

/**
 * It contains all the assertion methods.
 */
class Assertion {
  /**
   * Do no use it directly. Use the [module function]{@link module:xassert}
   * @param {*} actual - actual value, promise or function
   * @param {string} [name] - name of the field that could be used in the error messages
   * @param {Assertion} [parent] - parent assertion
   */
  constructor (actual, name, parent) {
    this.actual = actual
    this.name = name
    this.parent = parent
  }

  /**
   * @example
   * console.log(assert('orange').isAString().getActual()) // prints 'orange'
   * @returns {*} current value
   */
  getActual () {
    return this.actual
  }

  /**
   * @example
   * console.log(assert('orange').isAString().getName()) // prints 'actual value'
   * console.log(assert('orange', 'fruit').isAString().getName()) // prints 'fruit'
   * @returns {string} current name
   */
  getName () {
    if (this.name) return this.name
    if (isAPromise(this.actual)) return 'promise'
    if (typeof this.actual === 'function') return 'function'
    return 'actual value'
  }

  /**
   * @returns {string} full name including parent names
   */
  getFullName () {
    return this.parent ? this.parent.getFullName() + ' ' + this.getName() : this.getName()
  }

  /**
   * It could be use for meaningful chains
   * @example
   * assert('a').isAString().andIt.hasLengthOf(1)
   * @member {this}
   */
  get andIt () {
    return this
  }

  /**
   * @param {string} name - name of the field
   * @returns {Assertion} new ValueAssertion with the same value and a new name
   */
  named (name) {
    return new Assertion(this.actual, name)
  }

  /**
   * @private
   */

  /**
   * It fires an AssertionError
   * @private
   * @param {string} message - error message
   * @param {*} [expected] - expected value
   * @returns {void}
   */
  fire (message, expected) {
    throw new AssertionError(
      processMessage(message, { name: this.getFullName() }),
      this.actual, expected)
  }

  /**
   * Asserts that the actual value is strictly equal to expected value
   *
   * @example
   * assert(value).isEqualTo('Banana')
   * @param {*} expected - expected value
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not strictly equal to expected value
   * @return {this} chainable method
   */
  isEqualTo (expected, message = '{name} is different than expected value') {
    if (expected !== this.actual) this.fire(message, expected)
    return this
  }

  /**
   * Asserts that the actual value is strictly equal to any of expected values
   *
   * @example
   * assert(value).isEqualToAnyOf(['Banana', 'Apple'])
   * @param {*} expected - expected value
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not strictly equal to any of expected values
   * @return {this} chainable method
   */
  isEqualToAnyOf (expected, message = '{name} is different than any expected value') {
    if (expected.every(arg => arg !== this.actual)) this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is not strictly equal to expected value
   *
   * @example
   * assert(value).isNotEqualTo('Banana')
   * @param {*} expected - expected value
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is strictly equal to expected value
   * @return {this} chainable method
   */
  isNotEqualTo (expected, message = '{name} is equal to expected value') {
    if (expected === this.actual) this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is not strictly equal to any of expected values
   *
   * @example
   * assert(value).isNotEqualToAnyOf(['Banana', 'Apple'])
   * @param {*} expected - expected value
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is strictly equal to any of expected values
   * @return {this} chainable method
   */
  isNotEqualToAnyOf (expected, message = '{name} is equal to some expected value') {
    if (expected.some(arg => arg === this.actual)) this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is deeply equal to expected value
   *
   * @example
   * assert({ c: 3 }).isDeeplyEqualTo({ c: 3 }) // Success
   * assert({ c: 3 }).isDeeplyEqualTo('3') // Fail
   * @param {*} expected - expected value
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not deeply equal to expected value
   * @return {this} chainable method
   */
  isDeeplyEqualTo (expected, message = '{name} is not deeply equal to expected value') {
    if (!deepEquals(this.actual, expected)) this.fire(message, expected)
    return this
  }

  /**
   * Alias of {@link module:xassert.Assertion#isDeeplyEqualTo}
   * @example
   * assert({ c: 3 }).is({ c: 3 }) // Success
   * @param {*} expected - expected value
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not deeply equal to expected value
   * @return {this} chainable method
   */
  is (expected, message = '{name} is not expected value') {
    return this.isDeeplyEqualTo(expected, message)
  }
  /**
   * Asserts that the actual value is not deeply equal to expected value
   *
   * @example
   * assert({ c: 3 }).isNotDeeplyEqualTo({ c: 3 }) // Fail
   * assert({ c: 3 }).isNotDeeplyEqualTo('3') // Success
   * @param {*} expected - expected value
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is deeply equal to expected values
   * @return {this} chainable method
   */
  isNotDeeplyEqualTo (expected, message = 'actual is deeply equal to expected') {
    if (deepEquals(this.actual, expected)) this.fire(message, expected)
    return this
  }

  /**
   * Asserts that the actual value is deeply equal to any of expected values
   *
   * @example
   * assert({ c: 3 }).isDeeplyEqualToAnyOf([{ a: 3 } ,{ c: 3 }]) // Success
   * assert({ c: 3 }).isDeeplyEqualToAnyOf([{ a: 3 } ,{ c: 4 }])') // Fail
   * @param {*} expected - expected value
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not deeply equal to any of expected values
   * @return {this} chainable method
   */
  isDeeplyEqualToAnyOf (expected, message = '{name} is different than any of the expected values') {
    if (expected.every(arg => !deepEquals(this.actual, arg))) {
      this.fire(message)
    }
    return this
  }

  /**
   * Asserts that the actual value is not deeply equal to any of expected values
   *
   * @example
   * assert({ c: 3 }).isNotDeeplyEqualToAnyOf([{ a: 3 } ,{ c: 3 }]) // Fail
   * assert({ c: 3 }).isNotDeeplyEqualToAnyOf([{ a: 3 } ,{ c: 4 }])') // Success
   * @param {*} expected - expected value
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is deeply equal to any of expected values
   * @return {this} chainable method
   */
  isNotDeeplyEqualToAnyOf (expected, message = '{name} is equal one of non expected values') {
    if (expected.some(arg => deepEquals(this.actual, arg))) {
      this.fire(message)
    }
    return this
  }

  // ######### IS & IS NOT ############

  /**
   * Asserts that the actual value is null
   *
   * @example
   * assert(null).isNull() // Success
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not null
   * @return {this} chainable method
   */
  isNull (message = '{name} is not null') {
    if (this.actual !== null) this.fire(message, null)
    return this
  }

  /**
   * Asserts that the actual value is strictly true
   *
   * @example
   * assert(true).isTrue() // Success
   * assert('apple').isTrue() // Fail
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not strictly true
   * @return {this} chainable method
   */
  isTrue (message = '{name} is not strictly true') {
    if (this.actual !== true) this.fire(message, true)
    return this
  }

  /**
   * Asserts that the actual value is strictly false
   *
   * @example
   * assert(false).isFalse() // Success
   * assert('apple').isFalse() // Fail
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not strictly false
   * @return {this} chainable method
   */
  isFalse (message = '{name} is not strictly false') {
    if (this.actual !== false) this.fire(message, false)
    return this
  }

  /**
   * Asserts that the actual value is truthy
   *
   * @example
   * assert(true).isTruthy() // Success
   * assert('apple').isTruthy() // Success
   * assert(null).isTruthy() // Fail
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not truthy
   * @return {this} chainable method
   */
  isTruthy (message = '{name} is not truthy') {
    if (!this.actual) this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is falsy
   *
   * @example
   * assert(false).isFalsy() // Success
   * assert(undefined).isFalsy() // Success
   * assert('').isFalsy() // Success
   * assert('apple').isFalsy() // Success
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not falsy
   * @return {this} chainable method
   */
  isFalsy (message = '{name} is not falsy') {
    if (this.actual) this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is not null
   *
   * @example
   * assert('a').isNotNull() // Success
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not null
   * @return {this} chainable method
   */
  isNotNull (message = '{name} is null') {
    if (this.actual === null) this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is undefined
   *
   * @example
   * assert(undefined).isUndefined() // Success
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not null
   * @return {this} chainable method
   */
  isUndefined (message = '{name} is not undefined') {
    if (typeof this.actual !== 'undefined') this.fire(message, undefined)
    return this
  }

  /**
   * Asserts that the actual value is not undefined
   *
   * @example
   * assert(undefined).isNotUndefined() // Fail
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is undefined
   * @return {this} chainable method
   */
  isNotUndefined (message = '{name} is undefined') {
    if (typeof this.actual === 'undefined') this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is NaN
   *
   * @example
   * assert('j').isNaN() // Success
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not NaN
   * @return {this} chainable method
   */
  isNaN (message = '{name} is not NaN') {
    if (!isNaN(this.actual)) this.fire(message, NaN)
    return this
  }

  /**
   * Asserts that the actual value is not NaN
   *
   * @example
   * assert('j').isNotNaN() // Fail
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is  NaN
   * @return {this} chainable method
   */
  isNotNaN (message = '{name} is NaN') {
    if (isNaN(this.actual)) this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is a promise
   *
   * @example
   * assert(Promise.resolve(3)).isAPromise() // Success
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not a promise
   * @return {this} chainable method
   */
  isAPromise (message = '{name} is not a promise') {
    if (!isAPromise(this.actual)) this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is not promise
   *
   * @example
   * assert(Promise.resolve(3)).isNotAPromise() // Fail
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is a promise
   * @return {this} chainable method
   */
  isNotAPromise (message = '{name} is a promise') {
    if (isAPromise(this.actual)) this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is a number
   *
   * @example
   * assert(4.3).isANumber() // Success
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not a number
   * @return {this} chainable method
   */
  isANumber (message = '{name} is not a number') {
    if (typeof this.actual !== 'number') this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is not a number
   *
   * @example
   * assert(4.3).isNotANumber() // Fail
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is a number
   * @return {this} chainable method
   */
  isNotANumber (message = '{name} is a number') {
    if (typeof this.actual === 'number') this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is a string
   *
   * @example
   * assert('banana').isAString() // Success
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not a string
   * @return {this} chainable method
   */
  isAString (message = '{name} is not a string') {
    if (typeof this.actual !== 'string') this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is not a string
   *
   * @example
   * assert('banana').isNotAString() // Fail
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is a string
   * @return {this} chainable method
   */
  isNotAString (message = '{name} is a string') {
    if (typeof this.actual === 'string') this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is an array
   *
   * @example
   * assert([2, 3]).isAnArray() // Success
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not an array
   * @return {this} chainable method
   */
  isAnArray (message = '{name} is not an array') {
    if (!Array.isArray(this.actual)) this.fire(message, this.actual)
    return this
  }

  /**
   * Asserts that the actual value is not an array
   *
   * @example
   * assert(33).isNotAnArray() // Success
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is an array
   * @return {this} chainable method
   */
  isNotAnArray (message = '{name} is an array') {
    if (Array.isArray(this.actual)) this.fire(message, this.actual)
    return this
  }

  /**
   * Asserts that every value of the array pass the test
   * @example
   * assert([3, 6]).every(it => it.isAbove(2)) // Success
   * @param {assertionCallback} test - test for each element
   * @throws {AssertionError}
   * when any value fails the test
   * @return {this} chainable method
   */
  every (test) {
    requireTestFunction(test)
    this.actual.forEach((it, i) => test(new Assertion(it, 'at index ' + i, this)))
    return this
  }

  /**
   * Asserts that some value of the array pass the test
   * @example
   * assert([3, 6]).some(it => it.isAbove(5)) // Success
   * @param {assertionCallback} test - test for each element
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when no value passes the test
   * @return {this} chainable method
   */
  some (test, message = '{name} does not contain any item that passes any test') {
    requireTestFunction(test)
    const result = this.actual.some(it => {
      try { test(new Assertion(it)) } catch (error) {
        if (error instanceof AssertionError) return false
        throw error
      }
      return true
    })
    if (!result) this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value has the given property and run some test on it
   * @example
   * assert({ a: 3 }).hasProperty('a', it => it.isAbove(2)) // Success
   * @param {string} name - name of the property
   * @param {assertionCallback} test - test for the property
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value does not have
   * the given property or the tests fails
   * @return {this} chainable method
   */
  hasProperty (name, test, message = '{name} does not contain the property {property}') {
    if (!(this.actual && name in this.actual)) this.fire(processMessage(message, { property: name }))
    if (typeof test === 'function') test(new Assertion(this.actual[name], name + ' property', this))
    return this
  }

  /**
   * Asserts that the actual value does not have the given property
   * @example
   * assert({ a: 3 }).doesNotHaveProperty('b') // Success
   * @param {string} name - name of the property
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value has the given property
   * @return {this} chainable method
   */
  doesNotHaveProperty (name, message = '{name} contains the property {property}') {
    if (this.actual && name in this.actual) this.fire(processMessage(message, { property: name }))
    return this
  }

  /**
   * Asserts that the actual value has the own given property and run some test on it
   * @example
   * assert({ a: 3 }).hasOwnProperty('a', it => it.isAbove(2)) // Success
   * @param {string} name - name of the property
   * @param {assertionCallback} test - test for the property
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value does not have
   * the own given property or the tests fails
   * @return {this} chainable method
   */
  hasOwnProperty (name, test, message = '{name} does not contain the own property {property}') {
    if (!(this.actual instanceof Object && this.actual.hasOwnProperty(name))) {
      this.fire(processMessage(message, { property: name }))
    }
    if (typeof test === 'function') test(new Assertion(this.actual[name], name + ' own property', this))
    return this
  }

  /**
   * Asserts that the actual value does not have the own given property
   * @example
   * assert({ a: 3 }).doesNotHaveOwnProperty('b') // Success
   * @param {string} name - name of the property
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value has the own given property
   * @return {this} chainable method
   */
  doesNotHaveOwnProperty (name, message = '{name} contains the own property {property}') {
    if (this.actual instanceof Object && this.actual.hasOwnProperty(name)) {
      this.fire(processMessage(message, { property: name }))
    }
    return this
  }

  /**
   * Asserts that the property length exists and optionally pass some test against it
   * @example
   * assert('').hasLength() // Success
   * assert(1).hasLength() // Fails
   * assert([2]).hasLength() // Success
   * assert([2, 5]).hasLength(it => it.isAbove(1)) // Success
   * @param {assertionCallback} [test] - test for the property
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the property does not exists or the test fails
   * @return {this} chainable method
   */
  hasLength (test, message = '{name} does not have length property') {
    const ref = this.actual
    // Empty strings are falsy
    if (ref === null || ref === undefined || typeof ref.length !== 'number') this.fire(message)
    // 'length' in 'a string' throws an error
    if (typeof test === 'function') test(new Assertion(ref.length, 'length property', this))
    return this
  }

  /**
   * Asserts that the property length exists and it is equal to the giving number
   * @example
   * assert('').hasLengthOf(0) // Success
   * assert(1).hasLengthOf(1) // Fails
   * assert([2, 3]).hasLengthOf(2) // Success
   * @param {number} expected - expected length
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the property does not exists or the test fails
   * @return {this} chainable method
   */
  hasLengthOf (expected, message) {
    this.hasLength(it => it.isEqualTo(expected, message))
    return this
  }

  /**
   * Asserts that the actual value is above the given number
   * @example
   * assert(4).isAbove(3) // Success
   * assert(4).isAbove(4) // Fails
   * @param {number} number - given number
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not above the given number
   * @return {this} chainable method
   */
  isAbove (number, message = '{name} is not above expected value') {
    if (this.actual <= number) this.fire(message, number)
    return this
  }

  /**
   * Asserts that the actual value is at least the given number
   * @example
   * assert(4).isAtLeast(4) // Success
   * assert(4).isAtLeast(5) // Fails
   * @param {number} number - given number
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not at least the given number
   * @return {this} chainable method
   */
  isAtLeast (number, message = '{name} is not at least as expected value') {
    if (this.actual < number) this.fire(message, number)
    return this
  }

  /**
   * Asserts that the actual value is below the given number
   * @example
   * assert(4).isBelow(5) // Success
   * assert(4).isBelow(4) // Fails
   * @param {number} number - given number
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not bellow the given number
   * @return {this} chainable method
   */
  isBelow (number, message = '{name} is not below expected value') {
    if (this.actual >= number) this.fire(message, number)
    return this
  }

  /**
   * Asserts that the actual value is at most the given number
   * @example
   * assert(4).isAtMost(4) // Success
   * assert(4).isAtMost(3) // Fails
   * @param {number} number - given number
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not at most the given number
   * @return {this} chainable method
   */
  isAtMost (number, message = '{name} is not at most as expected value') {
    if (this.actual > number) this.fire(message, number)
    return this
  }

  /**
   * Asserts that the actual value is a instance of a given class
   * @example
   * assert(new Cat()).isInstanceOf(Animal) // Success
   * assert(null).isInstanceOf(Object) // Success
   * assert(aCar).isInstanceOf(Plane) // Fail
   * @param {number} expected - expected class
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not a instance of a given class
   * @return {this} chainable method
   */
  isInstanceOf (expected, message = '{name} is not instance of class ' + expected.name) {
    if (!(this.actual instanceof expected)) this.fire(message, expected)
    return this
  }

  /**
   * Asserts that the actual value is frozen
   * @example
   * assert(Object.freeze({ a: 1 })).isFrozen() // Success
   * assert({ a: 1 }).isFrozen() // Fail
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is not frozen
   * @return {this} chainable method
   */
  isFrozen (message = '{name} is not frozen') {
    if (!Object.isFrozen(this.actual)) this.fire(message)
    return this
  }

  /**
   * Asserts that the actual value is not frozen
   * @example
   * assert(Object.freeze({ a: 1 })).isNotFrozen() // Fail
   * assert({ a: 1 }).isNotFrozen() // Success
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value is frozen
   * @return {this} chainable method
   */
  isNotFrozen (message = '{name} is frozen') {
    if (Object.isFrozen(this.actual)) this.fire(message)
    return this
  }

  /**
   * Asserts that the promise is fulfilled and the test passes
   * @example
   * assert(Promise.resolve(3)).isFulfilled() // Success
   * assert(Promise.resolve(3)).isFulfilled(it => it.isEqualTo(3)) // Success
   * assert(Promise.resolve(3)).isFulfilled(it => it.isEqualTo(5)) // Fail
   * assert(Promise.reject(new Error())).isFulfilled() // Fail
   * @param {assertionCallback} [test] - test for the resolved value
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the promise is rejected and the test fails
   * @return {Promise<*>} resolved promise with the value
   */
  isFulfilled (test, message = '{name} has been rejected') {
    return this.actual.then(
      value => {
        if (typeof test === 'function') test(new Assertion(value))
        return value
      },
      ex => this.fire(message)
    )
  }

  /**
   * Asserts that the promise is rejected and the test passes
   * @example
   * assert(Promise.resolve(3)).isRejected() // Fail
   * assert(Promise.reject(new Error)).isRejected(it => it.isInstanceOf(Error)) // Success
   * @param {assertionCallback} [test] - test for the resolved value
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the promise is fulfilled and the test fails
   * @return {Promise<*>} resolved promise with the error
   */
  isRejected (test, message = '{name} has been fulfilled') {
    return this.actual.then(
      value => this.fire(message),
      error => {
        if (typeof test === 'function') test(new Assertion(error, 'error'))
        return error
      }
    )
  }

  /**
   * Asserts that the provided function throws an exception and optionally tests the error
   * @example
   * assert(() => throw new Error()).throws() // Success
   * assert(() => throw new Error()).throws(it => it.isInstanceOf(Error)) // Success
   * assert(() => 3).throws() // Fails
   * @param {assertionCallback} [test] - test error
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the provided function does not throw an exception or the test fails
   * @return {this} chainable method
   */
  throws (test, message = '{name} did not throw') {
    try {
      this.actual()
    } catch (error) {
      if (test) {
        requireTestFunction(test)
        test(new Assertion(error, 'error', this))
      }
      return this
    }
    this.fire(message)
  }

  /**
   * Asserts that the provided function throws the given exception
   * @example
   * assert(() => throw new NotFoundError()).throwsA(NotFoundError) // Success
   * assert(() => throw new ServerError()).throwsA(NotFoundError) // Fails
   * @param {function} [classRef] - class reference
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the provided function does not throw the given exception
   * @return {this} chainable method
   */
  throwsA (classRef, message = '{name} did not throw a {class}') {
    return this.throws(it => it.isInstanceOf(
      classRef,
      processMessage(message, { class: classRef.name })
    ))
  }

  /**
   * Asserts that the provided function throws the given exception.
   * Alias of {@link module:xassert.Assertion#throwsA}
   * @example
   * assert(() => throw new Error()).throwsAn(Error) // Success
   * assert(() => throw new Error()).throwsAn(InvalidFormat) // Fails
   * @param {function} [classRef] - class reference
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the provided function does not throw the given exception
   * @return {this} chainable method
   */
  throwsAn (classRef, message = '{name} did not throw an {class}') {
    return this.throwsA(classRef, message)
  }

  /**
   * Asserts that the actual value matches the given regular expression.
   * Alias of {@link module:xassert.Assertion#throwsA}
   * @example
   * assert(() => throw new Error()).throwsAn(Error) // Success
   * assert(() => throw new Error()).throwsAn(InvalidFormat) // Fails
   * @param {RegExp} [re] - regular expression
   * @param {string} [message] - error message
   * @throws {AssertionError}
   * when the actual value does not match the given regular expression
   * @return {this} chainable method
   */
  matches (re, message = '{name} did not match the given regular expression: {regexp}') {
    if (!re.test(this.actual)) this.fire(processMessage(message, { regexp: re }))
    return this
  }

  satisfies (test) {
    requireTestFunction(test, 'satisfies requires a test function')
    const result = test(this.actual)
    if (!result) this.fire('It does not satisfy')
    return this
  }
}

/**
 * Extensible assertions.
 * @module xassert
 */

/**
 * Creates and returns a value assertion
 * @alias module:xassert
 * @param {*} ref - actual value, promise or function
 * @param {string} [name] - alias for the actual value
 * @returns {Assertion} new assertion instance
 * @example
 * const assert = require('xassert')
 * assert(4).isANumber()
 */
function assert (ref, name) {
  return new Assertion(ref, name)
}

/**
 * @param {string} message - message for the {@link AssertionError} constructor
 * @returns {void}
 * @example
 * const assert = require('xassert')
 * assert.fail('Ops!') // This line will throw an AssertionError
 */
assert.fail = function fail (message) {
  throw new AssertionError(message)
}

/**
 * Support function to easily create tests. If the editor supports
 * JSDOC comments it will assist you.
 * @param {assertionCallback} test - test
 * @returns {Assertion} return the same test
 * @example
 * const isABanana = assert.fn(it => it.isEqualTo('BANANA'))
 * // same as "const isABanana = it => it.isEqualTo('BANANA')"
 * const object = { a:'BANANA', b:'APPLE' }
 * isABanana(assert('BANANA'))
 * assert(object)
 *   .hasProperty('a', isABanana) // Passes
 *   .hasProperty('b', isABanana) // Fails
 */
assert.fn = function callback (test) {
  requireTestFunction(test)
  return test
}

assert.Assertion = Assertion
assert.AssertionError = AssertionError

module.exports = assert
