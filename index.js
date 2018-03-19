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

class AssertionError extends Error {
  constructor (message, actual, expected) {
    super(message)
    this.name = 'Assertion'
    this.actual = actual
    this.expected = expected
  }
}

function fire (assertion, message, expected) {
  throw new AssertionError(message, assertion.value, expected)
}

class Assertion {
  constructor (value) {
    this.value = value
  }

  getValue () {
    return this.value
  }

  get andIt () {
    return this
  }

  // ########### EQUALITY #############

  isEqualTo (expected, message = 'actual value id  different than expected value') {
    if (expected !== this.value) fire(this, message, expected)
    return this
  }

  isEqualToAnyOf (expected, message = 'actual value is different than any expected value') {
    if (expected.every(arg => arg !== this.value)) fire(this, message)
    return this
  }

  isNotEqualTo (expected, message = 'actual value is equal to expected value') {
    if (expected === this.value) fire(this, message)
    return this
  }

  isNotEqualToAnyOf (expected, message = 'actual value is equal to some expected value') {
    if (expected.some(arg => arg === this.value)) fire(this, message)
    return this
  }

  isDeeplyEqualTo (expected, message = 'actual is not deeply equal to expected') {
    if (!deepEquals(this.value, expected)) fire(this, message, expected)
    return this
  }

  isNotDeeplyEqualTo (expected, message = 'actual is deeply equal to expected') {
    if (deepEquals(this.value, expected)) fire(this, message, expected)
    return this
  }

  isDeeplyEqualToAnyOf (expected, message = 'actual value is different than any of the expected values') {
    if (expected.every(arg => !deepEquals(this.value, arg))) {
      fire(this, message)
    }
    return this
  }

  isNotDeeplyEqualToAnyOf (expected, message = 'actual value is equal one of non expected values') {
    if (expected.some(arg => deepEquals(this.value, arg))) {
      fire(this, message)
    }
    return this
  }

  // ######### IS & IS NOT ############

  isNull (message = 'actual value is not null') {
    if (this.value !== null) fire(this, message, null)
    return this
  }

  isNotNull (message = 'actual value is null') {
    if (this.value === null) fire(this, message)
    return this
  }

  isUndefined (message = 'actual is not undefined') {
    if (typeof this.value !== 'undefined') fire(this, message, undefined)
    return this
  }

  isNotUndefined (message = 'actual value is undefined') {
    if (typeof this.value === 'undefined') fire(this, message)
    return this
  }

  isNaN (message = 'actual value is not NaN') {
    if (!isNaN(this.value)) fire(this, message, NaN)
    return this
  }

  isNotNaN (message = 'actual value is NaN') {
    if (isNaN(this.value)) fire(this, message)
    return this
  }

  isAPromise (message = 'Value is not a promise') {
    if (!isAPromise(this.value)) fire(this, message)
    return this
  }

  isNotAPromise (message = 'Value is a promise') {
    if (isAPromise(this.value)) fire(this, message)
    return this
  }

  isANumber (message = 'Value is not a number') {
    if (typeof this.value !== 'number') fire(this, message)
    return this
  }

  isNotANumber (message = 'Value is a number') {
    if (typeof this.value === 'number') fire(this, message)
    return this
  }

  isAString (message = 'Value is not a string') {
    if (typeof this.value !== 'string') fire(this, message)
    return this
  }

  isNotAString (message = 'Value is a string') {
    if (typeof this.value === 'string') fire(this, message)
    return this
  }

  isAnArray (message = 'actual value is not an array') {
    if (!Array.isArray(this.value)) fire(this, message, this.value)
    return this
  }

  isNotAnArray (message = 'actual value is an array') {
    if (Array.isArray(this.value)) fire(this, message, this.value)
    return this
  }

  // ######## Arrays ########

  every (cb) {
    if (typeof cb !== 'function') throw new Error('it requires function as first parameter')
    this.value.forEach(it => cb(new Assertion(it)))
    return this
  }

  some (cb) {
    if (typeof cb !== 'function') throw new Error('it requires function as first parameter')
    const result = this.value.some(it => {
      try { cb(new Assertion(it)) } catch (e) { return false }
      return true
    })
    if (!result) fire('None passes')
    return this
  }

  // ############ PROPERTIES ############

  hasProperty (name, cb) {
    if (!(this.value && name in this.value)) fire(this, 'missing property ' + name + ' in value')
    if (typeof cb === 'function') cb(new Assertion(this.value[name]))
    return this
  }

  doesNotHaveProperty (name) {
    if (this.value && name in this.value) fire(this, 'found property ' + name + ' in value')
    return this
  }

  hasOwnProperty (name, cb) {
    if (!(this.value instanceof Object && this.value.hasOwnProperty(name))) {
      fire(this, 'missing own property ' + name + ' in value')
    }
    if (typeof cb === 'function') cb(new Assertion(this.value[name]))
    return this
  }

  doesNotHaveOwnProperty (name) {
    if (this.value instanceof Object && this.value.hasOwnProperty(name)) {
      fire(this, 'found own property ' + name + ' in value')
    }
    return this
  }

  // TODO split?
  hasLengthOf (test) {
    if (!this.value) return fire(this, 'actual value does not have length property')
    const assertion = new Assertion(this.value.length)
    if (Number.isInteger(test)) return assertion.isEqualTo(test)
    if (typeof test === 'function') return test(assertion)
    throw new Error('Requires integer or function')
  }

  isFulfilled (cb) {
    return this.value.then(
      value => typeof cb === 'function' ? cb(new Assertion(value)) : value,
      ex => fire(this, 'No rejection expected', 'Resolved promise', ex)
    )
  }

  isRejected (cb) {
    return this.value.then(
      value => fire(this, 'Rejection expected but resolved with value: ' + value),
      ex => typeof cb === 'function' ? cb(new Assertion(ex)) : ex
    )
  }

  isAbove (number, message = 'Value is not above expected') {
    if (this.value <= number) fire(this, message, number)
    return this
  }

  isAtLeast (number, message = 'Value is not at least as expected') {
    if (this.value < number) fire(this, message, number)
    return this
  }

  isBelow (number, message = 'Value is not below expected') {
    if (this.value >= number) fire(this, message, number)
    return this
  }

  isAtMost (number, message = 'Value is not at most as expected') {
    if (this.value > number) fire(this, message, number)
    return this
  }

  satisfies (cb) {
    if (typeof cb !== 'function') throw new Error('satisfies requires a callback function')
    const result = cb(this.value)
    if (!result) fire(this, 'It does not satisfy')
    return this
  }

  isInstanceOf (expected, message = 'actual value is not instance of class ' + expected.name) {
    if (!(this.value instanceof expected)) fire(this, message, expected)
    return this
  }

  isFrozen (message = 'actual value is not frozen') {
    if (!Object.isFrozen(this.value)) fire(this, message)
    return this
  }

  isNotFrozen (message = 'actual value is frozen') {
    if (Object.isFrozen(this.value)) fire(this, message)
    return this
  }

  throws (test) {
    const cb = this.value
    if (typeof cb !== 'function') throw new Error('actual value mush be a function')
    try { this.value() } catch (error) {
      if (test) {
        if (typeof test !== 'function') throw new Error('first parameters should be a function')
        test(new Assertion(error))
      }
      return this
    }
    fire(this, 'Exception not thrown')
  }

  throwsA (ref) {
    return this.throws(it => it.isInstanceOf(ref))
  }

  throwsAn (ref) {
    return this.throwsA(ref)
  }
}

function assert (object) {
  return new Assertion(object)
}

assert.Error = AssertionError
assert.Assertion = Assertion

module.exports = assert
