'use strict'

const messageField = /{([\s\S]+?)}/g

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

class AssertionError extends Error {
  constructor (message, actual, expected) {
    super(message)
    this.name = 'Assertion Error'
    this.actual = actual
    this.expected = expected
  }
}

/**
 * Contains assertions related to values
 */
class ValueAssertion {
  /**
   * @param {any} value - value to be asserted
   * @param {string} [name] - name of the field that could be used in the error messages
   * @param {ValueAssertion} [parent] - parent assertion
   */
  constructor (value, name = 'actual value', parent) {
    this.value = value
    this.name = name
    this.parent = parent
  }

  /**
   * @example
   * console.log(assert('orange').isAString().getValue()) // prints 'orange'
   * @returns {any} current value
   */
  getValue () {
    return this.value
  }

  /**
   * @example
   * console.log(assert('orange').isAString().getName()) // prints 'actual value'
   * console.log(assert('orange', 'fruit').isAString().getName()) // prints 'fruit'
   * @returns {string} current name
   */
  getName () {
    return this.name
  }

  /**
   * @returns {string} full name including parent names
   */
  getFullName () {
    return this.parent ? this.parent.getFullName() + ' ' + this.name : this.name
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
   * @param {spring} name - name of the field
   * @returns {ValueAssertion} new ValueAssertion with the same value and a new name
   */
  named (name) {
    return new ValueAssertion(this.value, name)
  }

  /**
   * @private
   */

  /**
   * It fires an AssertionError
   * @private
   * @param {string} message
   * @param {any} [expected]
   */
  fire (message, expected) {
    const processed = message.replace(messageField, (match, key) => {
      if (key === 'name') return this.getFullName()
      return match
    })
    throw new AssertionError(processed, this.value, expected)
  }

  /**
   * Test if the actual value is strictly equal to expected value
   *
   * @example
   * assert(value).isEqualTo('Banana')
   * @param {any} expected
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not strictly equal to expected value
   * @return {this}
   */
  isEqualTo (expected, message = '{name} is different than expected value') {
    if (expected !== this.value) this.fire(message, expected)
    return this
  }

  /**
   * Test if the actual value is strictly equal to any of expected values
   *
   * @example
   * assert(value).isEqualToAnyOf(['Banana', 'Apple'])
   * @param {any} expected
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not strictly equal to any of expected values
   * @return {this}
   */
  isEqualToAnyOf (expected, message = '{name} is different than any expected value') {
    if (expected.every(arg => arg !== this.value)) this.fire(message)
    return this
  }

  /**
   * Test if the actual value is not strictly equal to expected value
   *
   * @example
   * assert(value).isNotEqualTo('Banana')
   * @param {any} expected
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is strictly equal to expected value
   * @return {this}
   */
  isNotEqualTo (expected, message = '{name} is equal to expected value') {
    if (expected === this.value) this.fire(message)
    return this
  }

  /**
   * Test if the actual value is not strictly equal to any of expected values
   *
   * @example
   * assert(value).isNotEqualToAnyOf(['Banana', 'Apple'])
   * @param {any} expected
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is strictly equal to any of expected values
   * @return {this}
   */
  isNotEqualToAnyOf (expected, message = '{name} is equal to some expected value') {
    if (expected.some(arg => arg === this.value)) this.fire(message)
    return this
  }

  /**
   * Test if the actual value is deeply equal to expected value
   *
   * @example
   * assert({ c: 3 }).isDeeplyEqualTo({ c: 3 }) // Success
   * assert({ c: 3 }).isDeeplyEqualTo('3') // Fail
   * @param {any} expected
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not deeply equal to expected value
   * @return {this}
   */
  isDeeplyEqualTo (expected, message = 'actual is not deeply equal to expected') {
    if (!deepEquals(this.value, expected)) this.fire(message, expected)
    return this
  }

  /**
   * Test if the actual value is not deeply equal to expected value
   *
   * @example
   * assert({ c: 3 }).isNotDeeplyEqualTo({ c: 3 }) // Fail
   * assert({ c: 3 }).isNotDeeplyEqualTo('3') // Success
   * @param {any} expected
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is deeply equal to expected values
   * @return {this}
   */
  isNotDeeplyEqualTo (expected, message = 'actual is deeply equal to expected') {
    if (deepEquals(this.value, expected)) this.fire(message, expected)
    return this
  }

  /**
   * Test if the actual value is deeply equal to any of expected values
   *
   * @example
   * assert({ c: 3 }).isDeeplyEqualToAnyOf([{ a: 3 } ,{ c: 3 }]) // Success
   * assert({ c: 3 }).isDeeplyEqualToAnyOf([{ a: 3 } ,{ c: 4 }])') // Fail
   * @param {any} expected
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not deeply equal to any of expected values
   * @return {this}
   */
  isDeeplyEqualToAnyOf (expected, message = '{name} is different than any of the expected values') {
    if (expected.every(arg => !deepEquals(this.value, arg))) {
      this.fire(message)
    }
    return this
  }

  /**
   * Test if the actual value is not deeply equal to any of expected values
   *
   * @example
   * assert({ c: 3 }).isNotDeeplyEqualToAnyOf([{ a: 3 } ,{ c: 3 }]) // Fail
   * assert({ c: 3 }).isNotDeeplyEqualToAnyOf([{ a: 3 } ,{ c: 4 }])') // Success
   * @param {any} expected
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is deeply equal to any of expected values
   * @return {this}
   */
  isNotDeeplyEqualToAnyOf (expected, message = '{name} is equal one of non expected values') {
    if (expected.some(arg => deepEquals(this.value, arg))) {
      this.fire(message)
    }
    return this
  }

  // ######### IS & IS NOT ############

  /**
   * Test if the actual value is null
   *
   * @example
   * assert(null).isNull() // Success
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not null
   * @return {this}
   */
  isNull (message = '{name} is not null') {
    if (this.value !== null) this.fire(message, null)
    return this
  }

  /**
   * Test if the actual value is not null
   *
   * @example
   * assert('a').isNotNull() // Success
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not null
   * @return {this}
   */
  isNotNull (message = '{name} is null') {
    if (this.value === null) this.fire(message)
    return this
  }

  /**
   * Test if the actual value is undefined
   *
   * @example
   * assert(undefined).isUndefined() // Success
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not null
   * @return {this}
   */
  isUndefined (message = '{name} is not undefined') {
    if (typeof this.value !== 'undefined') this.fire(message, undefined)
    return this
  }

  /**
   * Test if the actual value is not undefined
   *
   * @example
   * assert(undefined).isNotUndefined() // Fail
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is undefined
   * @return {this}
   */
  isNotUndefined (message = '{name} is undefined') {
    if (typeof this.value === 'undefined') this.fire(message)
    return this
  }

  /**
   * Test if the actual value is NaN
   *
   * @example
   * assert('j').isNaN() // Success
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not NaN
   * @return {this}
   */
  isNaN (message = '{name} is not NaN') {
    if (!isNaN(this.value)) this.fire(message, NaN)
    return this
  }

  /**
   * Test if the actual value is not NaN
   *
   * @example
   * assert('j').isNotNaN() // Fail
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is  NaN
   * @return {this}
   */
  isNotNaN (message = '{name} is NaN') {
    if (isNaN(this.value)) this.fire(message)
    return this
  }

  /**
   * Test if the actual value is a promise
   *
   * @example
   * assert(Promise.resolve(3)).isAPromise() // Success
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not a promise
   * @return {this}
   */
  isAPromise (message = '{name} is not a promise') {
    if (!isAPromise(this.value)) this.fire(message)
    return this
  }

  /**
   * Test if the actual value is not promise
   *
   * @example
   * assert(Promise.resolve(3)).isNotAPromise() // Fail
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is a promise
   * @return {this}
   */
  isNotAPromise (message = '{name} is a promise') {
    if (isAPromise(this.value)) this.fire(message)
    return this
  }

  /**
   * Test if the actual value is a number
   *
   * @example
   * assert(4.3).isANumber() // Success
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not a number
   * @return {this}
   */
  isANumber (message = '{name} is not a number') {
    if (typeof this.value !== 'number') this.fire(message)
    return this
  }

  /**
   * Test if the actual value is not a number
   *
   * @example
   * assert(4.3).isNotANumber() // Fail
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is a number
   * @return {this}
   */
  isNotANumber (message = '{name} is a number') {
    if (typeof this.value === 'number') this.fire(message)
    return this
  }

  /**
   * Test if the actual value is a string
   *
   * @example
   * assert('banana').isAString() // Success
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not a string
   * @return {this}
   */
  isAString (message = '{name} is not a string') {
    if (typeof this.value !== 'string') this.fire(message)
    return this
  }

  /**
   * Test if the actual value is not a string
   *
   * @example
   * assert('banana').isNotAString() // Fail
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is a string
   * @return {this}
   */
  isNotAString (message = '{name} is a string') {
    if (typeof this.value === 'string') this.fire(message)
    return this
  }

  /**
   * Test if the actual value is an array
   *
   * @example
   * assert([2, 3]).isAnArray() // Success
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is not an array
   * @return {this}
   */
  isAnArray (message = '{name} is not an array') {
    if (!Array.isArray(this.value)) this.fire(message, this.value)
    return this
  }

  /**
   * Test if the actual value is not an array
   *
   * @example
   * assert(33).isNotAnArray() // Success
   * @param {spring} [message]
   * @throws {AssertionError} when the actual value is an array
   * @return {this}
   */
  isNotAnArray (message = '{name} is an array') {
    if (Array.isArray(this.value)) this.fire(message, this.value)
    return this
  }

  every (cb) {
    if (typeof cb !== 'function') throw new Error('it requires function as first parameter')
    this.value.forEach((it, i) => cb(new ValueAssertion(it, 'at index ' + i, this)))
    return this
  }

  some (cb, message = '{name} does not contain any item that passes any test') {
    if (typeof cb !== 'function') throw new Error('it requires function as first parameter')
    const result = this.value.some(it => {
      try { cb(new ValueAssertion(it)) } catch (e) { return false }
      return true
    })
    if (!result) this.fire(message)
    return this
  }

  // ############ PROPERTIES ############

  hasProperty (name, cb) {
    if (!(this.value && name in this.value)) this.fire('missing property ' + name + ' in actual value')
    if (typeof cb === 'function') cb(new ValueAssertion(this.value[name], 'property ' + name, this))
    return this
  }

  doesNotHaveProperty (name) {
    if (this.value && name in this.value) this.fire('found property ' + name + ' in value')
    return this
  }

  hasOwnProperty (name, cb) {
    if (!(this.value instanceof Object && this.value.hasOwnProperty(name))) {
      this.fire('missing own property ' + name + ' in value')
    }
    if (typeof cb === 'function') cb(new ValueAssertion(this.value[name], 'own property ' + name, this))
    return this
  }

  doesNotHaveOwnProperty (name) {
    if (this.value instanceof Object && this.value.hasOwnProperty(name)) {
      this.fire('found own property ' + name + ' in value')
    }
    return this
  }

  // TODO split?
  hasLengthOf (test) {
    if (!this.value) return this.fire('{name} does not have length property')
    const assertion = new ValueAssertion(this.value.length)
    if (Number.isInteger(test)) return assertion.isEqualTo(test)
    if (typeof test === 'function') return test(assertion)
    throw new Error('Requires integer or function')
  }

  isAbove (number, message = '{name} is not above expected value') {
    if (this.value <= number) this.fire(message, number)
    return this
  }

  isAtLeast (number, message = '{name} is not at least as expected value') {
    if (this.value < number) this.fire(message, number)
    return this
  }

  isBelow (number, message = '{name} is not below expected value') {
    if (this.value >= number) this.fire(message, number)
    return this
  }

  isAtMost (number, message = '{name} is not at most as expected') {
    if (this.value > number) this.fire(message, number)
    return this
  }

  satisfies (cb) {
    if (typeof cb !== 'function') throw new Error('satisfies requires a callback function')
    const result = cb(this.value)
    if (!result) this.fire('It does not satisfy')
    return this
  }

  isInstanceOf (expected, message = '{name} is not instance of class ' + expected.name) {
    if (!(this.value instanceof expected)) this.fire(message, expected)
    return this
  }

  isFrozen (message = '{name} is not frozen') {
    if (!Object.isFrozen(this.value)) this.fire(message)
    return this
  }

  isNotFrozen (message = '{name} is frozen') {
    if (Object.isFrozen(this.value)) this.fire(message)
    return this
  }
}

class PromiseAssertion {
  constructor (promise, name = 'promise') {
    if (!isAPromise(promise)) throw new Error('Promise assertion requires a function')
    this.promise = promise
    this.name = name
  }
  fire (message) {
    const processed = message.replace(messageField, (match, key) => {
      if (key === 'name') return this.name
      return match
    })
    throw new AssertionError(processed)
  }
  isFulfilled (test, message = '{name} has been rejected') {
    return this.promise.then(
      value => typeof test === 'function' ? test(new ValueAssertion(value)) : value,
      ex => this.fire(message)
    )
  }
  isRejected (cb, message = '{name} has been fulfilled') {
    return this.promise.then(
      value => this.fire(message),
      ex => typeof cb === 'function' ? cb(new ValueAssertion(ex)) : ex
    )
  }
}

class FunctionAssertion {
  constructor (fn, name = 'function') {
    if (typeof fn !== 'function') throw new Error('Function assertion requires a function')
    this.fn = fn
  }
  throws (test, message = '{name} did not throw') {
    try {
      this.fn()
    } catch (error) {
      if (test) {
        if (typeof test !== 'function') throw new Error('first parameters should be a function')
        test(new ValueAssertion(error))
      }
      return this
    }
    throw new AssertionError(message)
  }

  throwsA (ref) {
    return this.throws(it => it.isInstanceOf(ref))
  }

  throwsAn (ref) {
    return this.throwsA(ref)
  }
}

function assertValue (any, name) {
  return new ValueAssertion(any, name)
}

function assertFunction (fn, name) {
  return new FunctionAssertion(fn, name)
}

function assertPromise (promise, name) {
  return new PromiseAssertion(promise, name)
}

module.exports = Object.assign(assertValue, {
  assert: assertValue,
  assertValue,
  fn: assertFunction,
  assertFunction,
  promise: assertPromise,
  assertPromise,
  ValueAssertion,
  FunctionAssertion,
  PromiseAssertion,
  AssertionError
})
