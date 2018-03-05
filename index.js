'use strict'

function isAPromise (promise) {
  return promise !== null &&
        (typeof promise === 'object' || typeof promise === 'function') &&
        typeof promise.then === 'function'
}

function isDeeplyEqualTo (a, b) {
  if (a === b) {
    return true
  }

  if (a === null || b === null) {
    return false
  }

  const type = typeof a
  const otherType = typeof b

  // TODO SUPPORT SYMBOLS
  if (type !== otherType ||
        type !== 'object' ||
        a.constructor !== b.constructor) {
    return false
  }

  if (Array.isArray(a)) {
    return a.length === b.length ? a.every(
      (elem, i) => isDeeplyEqualTo(elem, b[i])
    ) : false
  }

  const names = Object.getOwnPropertyNames(a)

  if (names.length !== Object.getOwnPropertyNames(b).length) {
    return false
  }

  return names.every(
    (name) => b.hasOwnProperty(name) && isDeeplyEqualTo(a[name], b[name])
  )
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

  get andIt () {
    return this
  }

  // ########### EQUALITY #############

  isEqualTo (expected) {
    if (expected !== this.value) fire(this, 'actual value id  different than expected value', expected)
    return this
  }

  isEqualToAnyOf () {
    const expected = Array.from(arguments)
    if (expected.every(arg => arg !== this.value)) fire(this, 'actual value is different than any expected value')
    return this
  }

  isNotEqualTo (expected) {
    if (expected === this.value) fire(this, 'actual value it equal to expected value')
    return this
  }

  isNotEqualToAnyOf () {
    const expected = Array.from(arguments)
    if (expected.some(arg => arg === this.value)) fire(this, 'actual value is equal to some expected value')
    return this
  }

  isDeeplyEqualTo (expected) {
    if (!isDeeplyEqualTo(this.value, expected)) fire(this, 'actual is not deeply equal to expected', expected)
    return this
  }

  isDeeplyEqualToAnyOf () {
    const expected = Array.from(arguments)
    if (expected.every(arg => !isDeeplyEqualTo(this.value, arg))) {
      fire(this, 'actual value is different than any of expected')
    }
    return this
  }

  isNotDeeplyEqualToAnyOf () {
    const expected = Array.from(arguments)
    if (expected.some(arg => isDeeplyEqualTo(this.value, arg))) {
      fire(this, 'actual value is equal one of non expected values')
    }
    return this
  }

  // ######### IS & IS NOT ############

  isNull () {
    if (this.value !== null) fire(this, 'actual value is not null', null)
    return this
  }

  isNotNull () {
    if (this.value === null) fire(this, 'actual value is null')
    return this
  }

  isUndefined () {
    if (typeof this.value !== 'undefined') fire(this, 'actual is not undefined', undefined)
    return this
  }

  isNotUndefined () {
    if (typeof this.value === 'undefined') fire(this, 'actual value is undefined')
    return this
  }

  isNaN () {
    if (!isNaN(this.value)) fire(this, 'actual value is not NaN', NaN)
    return this
  }

  isNotNaN () {
    if (isNaN(this.value)) fire(this, 'actual value is NaN')
    return this
  }

  isAPromise () {
    if (!isAPromise(this.value)) fire(this, 'Value is not a promise')
    return this
  }

  isNotAPromise () {
    if (isAPromise(this.value)) fire(this, 'Value is a promise')
    return this
  }

  isANumber () {
    if (typeof this.value !== 'number') fire(this, 'Value is not a number')
    return this
  }

  isNotANumber () {
    if (typeof this.value === 'number') fire(this, 'Value is a number')
    return this
  }

  isAString () {
    if (typeof this.value !== 'string') fire(this, 'Value is not a string')
    return this
  }

  isNotAString () {
    if (typeof this.value === 'string') fire(this, 'Value is a string')
    return this
  }

  isAnArray () {
    if (!Array.isArray(this.value)) fire(this, 'actual value is not an array', this.value)
    return this
  }

  isNotAnArray () {
    if (Array.isArray(this.value)) fire(this, 'actual value is an array', this.value)
    return this
  }

  // ############ PROPERTIES ##############

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
    if (!(this.value instanceof Object &&
            this.value.hasOwnProperty(name))) {
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
      value => typeof cb === 'function'
        ? cb(new Assertion(value))
        : value,
      ex => {
        fire(this, 'No rejection expected', 'Resolved promise', ex)
      }
    )
  }

  isRejected (cb) {
    return this.value.then(
      value => {
        fire(this, 'Rejection expected but resolved with value: ' + value)
      },
      ex => typeof cb === 'function' ? cb(new Assertion(ex)) : ex
    )
  }

  isAbove (number) {
    if (this.value <= number) fire(this, 'Value is not above expected', number)
    return this
  }

  isAtLeast (number) {
    if (this.value < number) fire(this, 'Value is not at least as expected', number)
    return this
  }

  isBelow (number) {
    if (this.value >= number) fire(this, 'Value is not below expected', number)
    return this
  }

  isAtMost (number) {
    if (this.value > number) fire(this, 'Value is not at most as expected', number)
    return this
  }

  satisfies (cb) {
    if (typeof cb !== 'function') {
      throw new Error('satisfies requires a callback function')
    }
    const result = cb(this.value)
    if (!result) fire(this, 'It does not satisfy')
    return this
  }

  isInstanceOf (expected) {
    if (!(this.value instanceof expected)) fire(this, 'actual value is not instance of class', expected)
    return this
  }

  isFrozen () {
    if (!Object.isFrozen(this.value)) fire(this, 'actual value is not frozen')
    return this
  }

  isNotFrozen () {
    if (Object.isFrozen(this.value)) fire(this, 'actual value is frozen')
    return this
  }

  throws (test) {
    const cb = this.value
    if (typeof cb !== 'function') {
      throw new Error('actual value mush be a function')
    }
    try {
      this.value()
    } catch (error) {
      if (test) {
        if (typeof test !== 'function') {
          throw new Error('first parameters should be a function')
        }
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
assert.isEqualTo = (expected) => (it) => it.isEqualTo(expected)
assert.isInstanceOf = (expected) => (it) => it.isInstanceOf(expected)

module.exports = assert
