/* eslint-env mocha */
'use strict'

const assert = require('.')
const assertThat = assert
const { AssertionError, Assertion } = assert

function throws (fn, message) {
  assert(fn).throws(it => {
    it.isInstanceOf(AssertionError)
    if (message !== undefined) it.includesProperty('message', it => it.isEqualTo(message))
  })
}

function itShouldNotThrowWhen (when, cb) {
  it('should not throw an assertion error when ' + when, cb)
}

function itShouldThrowWhen (when, cb) {
  it('should throw an assertion error when ' + when, cb)
}

function itShouldNotThrowWhenTheValue (when, cb) {
  itShouldNotThrowWhen('the actual value ' + when, cb)
}

function itShouldThrowWhenTheValue (when, cb) {
  itShouldThrowWhen('the actual value ' + when, cb)
}

const resolved = Promise.resolve(true)
const rejected = Promise.reject(new Error('A terrible error'))

// Avoid warning
rejected.catch((error) => assert(error).isInstanceOf(Error))

function itShouldBeChainable (fn) {
  it('should be chainable', function () {
    assert(fn()).isInstanceOf(Assertion)
  })
}

describe('xassert module', function () {
  describe('getActual()', function () {
    it('should return the ref', function () {
      const value = 4
      assert(assert(value).getActual()).isEqualTo(value)
    })
  })

  describe('@deprecated', function () {
    it('should return the ref', function () {
      const value = 4
      const assertion = assert(value)
      assert(assertion.getRef()).isEqualTo(value)
      assert(assertion).includesProperty('ref', it => it.isEqualTo(value))
    })
  })

  describe('named()', function () {
    it('should return a new Assertion with the new name', function () {
      const originalAssertion = assert(1)
      const newAssertion = originalAssertion.named('one')
      assert(originalAssertion.getName()).isEqualTo('actual value')
      assert(newAssertion.getName()).isEqualTo('one')
      assert(originalAssertion).isNotEqualTo(newAssertion)
    })
  })

  describe('andIt property', function () {
    it('should be equal to the current instance to allow chaining', function () {
      assert(1).isNotAString().andIt.isAbove(0)
      throws(() => assert(1).isANumber().andIt.isAtMost(-2))
    })
  })

  context('Equality', function () {
    describe('isEqualTo(expected: any): this', function () {
      itShouldBeChainable(() => assert(true).isEqualTo(true))
      itShouldNotThrowWhenTheValue('is strictly equal (i.e. ===) to expected', function () {
        assert(4).isEqualTo(4)
      })
      itShouldThrowWhenTheValue('is not strictly equal (i.e. ===) to expected', function () {
        throws(() => assert(4).isEqualTo(5))
        throws(() => assert(4).isEqualTo('4'))
        throws(() => assert({ a: 1 }).isEqualTo({ a: 1 }))
        throws(() => assert([1]).isEqualTo([1]))
      })
    })
    describe('isNotEqualTo(expected: any): this', function () {
      itShouldBeChainable(() => assert(true).isNotEqualTo(false))
      itShouldNotThrowWhenTheValue('is strictly not equal (i.e. !==) to expected', function () {
        assert(4).isNotEqualTo(3)
        assert(4).isNotEqualTo('4')
      })
      itShouldThrowWhenTheValue('is not strictly not equal (i.e. !==) to expected', function () {
        const obj = { a: 1 }
        throws(() => assert(true).isNotEqualTo(true))
        throws(() => assert(obj).isNotEqualTo(obj))
      })
    })
    describe('isEqualToAnyOf(any[]): this', function () {
      itShouldBeChainable(() => assert(true).isEqualToAnyOf([true]))
      itShouldNotThrowWhenTheValue('is strictly equal (i.e. ===) to any of expected', function () {
        assert(4).isEqualToAnyOf([3, 4])
      })
      itShouldThrowWhenTheValue('is not strictly equal (i.e. ===) to any of expected', function () {
        throws(() => assert(4).isEqualToAnyOf([5, 6]))
        throws(() => assert(4).isEqualToAnyOf(['4']))
        throws(() => assert({ a: 1 }).isEqualToAnyOf([{ a: 1 }]))
        throws(() => assert([1]).isEqualToAnyOf([1]))
      })
    })
    describe('isNotEqualToAnyOf(any[]): this', function () {
      itShouldBeChainable(() => assert(true).isNotEqualToAnyOf([false]))
      itShouldNotThrowWhenTheValue('is strictly not equal (i.e. !==) to any of expected', function () {
        assert(4).isNotEqualToAnyOf([3, 6])
        assert(4).isNotEqualToAnyOf(['4'])
      })
      itShouldThrowWhenTheValue('is not strictly not equal (i.e. !==) to any of expected', function () {
        const obj = { a: 1 }
        throws(() => assert(true).isNotEqualToAnyOf([true]))
        throws(() => assert(obj).isNotEqualToAnyOf([null, obj]))
      })
    })

    describe('isNull()', function () {
      itShouldBeChainable(() => assert(null).isNull())
      itShouldNotThrowWhenTheValue('is null', function () {
        assert(null).isNull()
      })
      itShouldThrowWhenTheValue('is not null', function () {
        throws(() => assert('apple').isNull())
      })
    })
    describe('isNotNull()', function () {
      itShouldBeChainable(() => assert(1).isNotNull())
      itShouldNotThrowWhenTheValue('is not null', function () {
        assert('banana').isNotNull()
      })
      itShouldThrowWhenTheValue('is null', function () {
        throws(() => assert(null).isNotNull())
      })
    })

    describe('isUndefined()', function () {
      itShouldBeChainable(() => assert(undefined).isUndefined())
      itShouldNotThrowWhenTheValue('is undefined', function () {
        assert(undefined).isUndefined()
      })
      itShouldThrowWhenTheValue('is not undefined', function () {
        throws(() => assert('apple').isUndefined())
      })
    })
    describe('isNotUndefined', function () {
      itShouldBeChainable(() => assert(1).isNotUndefined())
      itShouldNotThrowWhenTheValue('is not undefined', function () {
        assert('banana').isNotUndefined()
      })
      itShouldThrowWhenTheValue('is undefined', function () {
        throws(() => assert(undefined).isNotUndefined())
      })
    })

    describe('isNaN()', function () {
      itShouldBeChainable(() => assert(NaN).isNaN())
      itShouldNotThrowWhenTheValue('is NaN', function () {
        assert(NaN).isNaN()
      })
      itShouldThrowWhenTheValue('is not NaN', function () {
        throws(() => assert(1).isNaN())
      })
    })
    describe('isNotNaN', function () {
      itShouldBeChainable(() => assert(1).isNotNaN())
      itShouldNotThrowWhenTheValue('is not NaN', function () {
        assert(1).isNotNaN()
      })
      itShouldThrowWhenTheValue('is NaN', function () {
        throws(() => assert(NaN).isNotNaN())
      })
    })
    describe('isTrue()', function () {
      itShouldBeChainable(() => assert(true).isTrue())
      itShouldNotThrowWhenTheValue('is strictly true', function () {
        assert(true).isTrue()
      })
      itShouldThrowWhenTheValue('is not strictly true', function () {
        throws(() => assert(1).isTrue())
      })
    })
    describe('isFalse()', function () {
      itShouldBeChainable(() => assert(false).isFalse())
      itShouldNotThrowWhenTheValue('is strictly false', function () {
        assert(false).isFalse()
      })
      itShouldThrowWhenTheValue('is strictly false', function () {
        throws(() => assert('').isFalse())
      })
    })
    describe('isTruthy()', function () {
      itShouldBeChainable(() => assert(true).isTruthy())
      itShouldNotThrowWhenTheValue('is truthy', function () {
        assert(true).isTruthy()
        assert(1).isTruthy()
        assert('banana').isTruthy()
      })
      itShouldThrowWhenTheValue('is not truthy', function () {
        throws(() => assert('').isTruthy())
        throws(() => assert(false).isTruthy())
        throws(() => assert(0).isTruthy())
        throws(() => assert(null).isTruthy())
        throws(() => assert(undefined).isTruthy())
      })
    })
    describe('isFalsy()', function () {
      itShouldBeChainable(() => assert(false).isFalsy())
      itShouldNotThrowWhenTheValue('is falsy', function () {
        assert('').isFalsy()
        assert(false).isFalsy()
        assert(0).isFalsy()
        assert(null).isFalsy()
        assert(undefined).isFalsy()
      })
      itShouldThrowWhenTheValue('is falsy', function () {
        throws(() => assert(true).isFalsy())
        throws(() => assert(1).isFalsy())
        throws(() => assert('banana').isFalsy())
      })
    })

    context('Promises', function () {
      describe('isAPromise(): this', function () {
        itShouldBeChainable(() => assert(resolved).isAPromise())
        itShouldNotThrowWhen('it is a promise', function () {
          assert(resolved).isAPromise()
          assert(rejected).isAPromise()
        })
        itShouldThrowWhen('is not a promise', function () {
          throws(() => assert('BANANA').isAPromise())
        })
      })
      describe('isNotAPromise(): this', function () {
        itShouldBeChainable(() => assert(null).isNotAPromise())
        itShouldNotThrowWhen('it is not a promise', function () {
          assert('BANANA').isNotAPromise()
        })
        itShouldThrowWhen('is a promise', function () {
          throws(() => assert(resolved).isNotAPromise())
          throws(() => assert(rejected).isNotAPromise())
        })
      })
    })
  })

  describe('Deep Equality', function () {
    const object = { a: 1, b: 'str', c: null, d: { a: 'deep' } }
    const deepEqualToObject = { a: 1, b: 'str', c: null, d: { a: 'deep' } }
    const differentObject = { a: 1, b: 'str', c: null, d: { b: 'deep' } }
    const anotherDifferentObject = { a: 1, b: 'str', c: 5 }

    describe('isDeeplyEqualTo(any): this', function () {
      itShouldBeChainable(() => assert(object).isDeeplyEqualTo(deepEqualToObject))
      itShouldNotThrowWhenTheValue('is deep equal to expected', function () {
        assert(object).isDeeplyEqualTo(deepEqualToObject)
        assert(null).isDeeplyEqualTo(null)
        assert(undefined).isDeeplyEqualTo(undefined)
        assert(3).isDeeplyEqualTo(3)
        assert({}).isDeeplyEqualTo({})
        assert([]).isDeeplyEqualTo([])
        assert([1]).isDeeplyEqualTo([1])
        assert([1, 3]).isDeeplyEqualTo([1, 3])
        assert([1, object]).isDeeplyEqualTo([1, deepEqualToObject])
        assert([1, [1, object]]).isDeeplyEqualTo([1, [1, deepEqualToObject]])
      })
      itShouldThrowWhenTheValue('is not deep equal to expected', function () {
        throws(() => assert(object).isDeeplyEqualTo(differentObject))
        throws(() => assert(object).isDeeplyEqualTo(anotherDifferentObject))
        throws(() => assert(object).isDeeplyEqualTo(null))
        throws(() => assert(null).isDeeplyEqualTo(object))
        throws(() => assert(4).isDeeplyEqualTo(3))
        throws(() => assert(undefined).isDeeplyEqualTo(null), 'actual value is not deeply equal to expected value')
        throws(() => assert(undefined).isDeeplyEqualTo(0))
        throws(() => assert([]).isDeeplyEqualTo({}))
        throws(() => assert([]).isDeeplyEqualTo(undefined))
        throws(() => assert([]).isDeeplyEqualTo([2]))
        throws(() => assert([[1, object]]).isDeeplyEqualTo([[1, differentObject]]))
        throws(() => assert([]).isDeeplyEqualTo({ length: 0 }))
        throws(() => assert(['banana']).isDeeplyEqualTo([2]))
        throws(() => assert([1, 3]).isDeeplyEqualTo([3, 1]))
        throws(() => assert(['4']).isDeeplyEqualTo([4]))
      })
    })

    describe('is(any): this', function () {
      itShouldBeChainable(() => assert(object).is(deepEqualToObject))
      itShouldNotThrowWhenTheValue('is deep equal to expected', function () {
        assert(object).is(deepEqualToObject)
      })
      itShouldThrowWhenTheValue('is not deep equal to expected', function () {
        throws(() => assert(object).is(differentObject))
      })
    })

    describe('isNotDeeplyEqualTo(any): this', function () {
      itShouldBeChainable(() => assert(object).isNotDeeplyEqualTo(differentObject))
      itShouldNotThrowWhenTheValue('is not deep equal to expected', function () {
        assert(object).isNotDeeplyEqualTo(differentObject)
      })
      itShouldThrowWhenTheValue('is deep equal to expected', function () {
        throws(() => assert(object).isNotDeeplyEqualTo(object))
        throws(() => assert(object).isNotDeeplyEqualTo(deepEqualToObject))
      })
    })

    describe('isDeeplyEqualToAnyOf(any): this', function () {
      itShouldBeChainable(() => assert(object).isDeeplyEqualToAnyOf([deepEqualToObject, differentObject]))
      itShouldNotThrowWhenTheValue('is deep equal to any of expected', function () {
        assert(object).isDeeplyEqualToAnyOf([differentObject, deepEqualToObject])
      })
      itShouldThrowWhenTheValue('is not deep equal to any of expected', function () {
        throws(() => assert(object).isDeeplyEqualToAnyOf([differentObject, anotherDifferentObject]))
      })
    })
    describe('isNotDeeplyEqualToAnyOf(any): this', function () {
      itShouldBeChainable(() => assert(object).isNotDeeplyEqualToAnyOf([differentObject, anotherDifferentObject]))
      itShouldNotThrowWhenTheValue('is not deep equal to any of expected', function () {
        assert(object).isNotDeeplyEqualToAnyOf([differentObject, null])
      })
      itShouldThrowWhenTheValue('is deep equal to any of expected', function () {
        throws(() => assert(object).isNotDeeplyEqualToAnyOf([differentObject, object]))
      })
    })
  })

  context('properties', function () {
    const object = { a: 1, b: 'text', c: null }
    describe('includesProperty()', function () {
      itShouldBeChainable(() => assert(object).includesProperty('a'))
      itShouldNotThrowWhen('the property exists', function () {
        assert(object).includesProperty('a')
        assert(object).includesProperty('a', it => it.isEqualTo(1))
      })
      itShouldThrowWhen('the property does not exist', function () {
        throws(() => assert(object).includesProperty('x'))
        throws(() => assert(object).includesProperty('a', it => it.isEqualTo(2)))
      })
    })

    describe('doesNotIncludeProperty()', function () {
      itShouldBeChainable(() => assert(object).doesNotIncludeProperty('z'))
      itShouldNotThrowWhen('the property does not exists', function () {
        assert(object).doesNotIncludeProperty('z')
      })
      itShouldThrowWhen('the property exists', function () {
        throws(() => assert(object).doesNotIncludeProperty('a'))
      })
    })

    describe('includesOwnProperty()', function () {
      itShouldBeChainable(() => assert(object).includesOwnProperty('a'))
      itShouldNotThrowWhen('the own property exists', function () {
        assert(object).includesOwnProperty('a')
        assert(object).includesOwnProperty('a', value => value.isEqualTo(1))
      })
      itShouldThrowWhen('the own property does not exists', function () {
        throws(() => assert(object).includesOwnProperty('x'))
        throws(() => assert(object).includesOwnProperty('a', value => value.isEqualTo(2)))
      })
    })

    describe('doesNotIncludeOwnProperty()', function () {
      itShouldBeChainable(() => assert(object).doesNotIncludeOwnProperty('z'))
      itShouldNotThrowWhen('the own property does not exists', function () {
        assert(object).doesNotIncludeOwnProperty('z')
      })
      itShouldThrowWhen('the own property exists', function () {
        throws(() => assert(object).doesNotIncludeOwnProperty('a'))
      })
    })
  })

  context('Numbers', function () {
    describe('isANumber()', function () {
      itShouldBeChainable(() => assert(4.3).isANumber())
      itShouldNotThrowWhenTheValue('is a Number', function () {
        assert(4.3).isANumber()
      })
      itShouldThrowWhenTheValue('is not a Number', function () {
        throws(() => assert('3').isANumber())
      })
    })
    describe('isNotANumber()', function () {
      itShouldBeChainable(() => assert('5').isNotANumber())
      itShouldNotThrowWhenTheValue('is not a Number', function () {
        assert('5').isNotANumber()
      })
      itShouldThrowWhenTheValue('is a Number', function () {
        throws(() => assert(3).isNotANumber())
      })
    })
    describe('isAbove(number), isAtLeast(number), isBelow(number) and isisAtMost(number)', function () {
      itShouldBeChainable(() => assert(3).isAbove(2).isAtLeast(2).isAtLeast(3).isBelow(4).isAtMost(3).isAtMost(4))
      itShouldNotThrowWhenTheValue('follows the restriction', function () {
        assert(3).isAbove(2).isAtLeast(2).isAtLeast(3).isBelow(4).isAtMost(3).isAtMost(4)
      })
      itShouldThrowWhenTheValue('does not follow the restriction', function () {
        throws(() => assert(3).isAbove(3))
        throws(() => assert(3).isAbove(4))
        throws(() => assert(3).isAtLeast(4))
        throws(() => assert(3).isBelow(3))
        throws(() => assert(3).isBelow(2))
        throws(() => assert(3).isAtMost(2))
      })
    })
  })

  context('Strings', function () {
    describe('isAString()', function () {
      const string1 = 'banana'
      itShouldBeChainable(() => assert(string1).isAString())
      itShouldNotThrowWhenTheValue('is a String', function () {
        assert(string1).isAString()
      })
      itShouldThrowWhenTheValue('is not a String', function () {
        throws(() => assert(2).isAString())
      })
    })

    describe('isNotAString()', function () {
      itShouldBeChainable(() => assert(1).isNotAString())
      itShouldNotThrowWhenTheValue('is a String', function () {
        assert(1).isNotAString()
        // eslint-disable-next-line no-new-wrappers
        assert(new String('a')).isNotAString()
      })
      itShouldThrowWhenTheValue('is not a String', function () {
        throws(() => assert('d').isNotAString())
      })
    })

    describe('hasLength()', function () {
      const string1 = 'banana'
      itShouldBeChainable(() => assert(string1).hasLength(string1.length))
      itShouldNotThrowWhenTheValue('length matches the restriction', function () {
        assert(string1).hasLength()
        assert(string1).hasLength(it => it.isAbove(string1.length - 1))
      })
      itShouldThrowWhenTheValue('length does not match the restriction', function () {
        throws(() => assert(1).hasLength())
        throws(() => assert(string1).hasLength(it => it.isAbove(string1.length + 1)))
      })
    })

    describe('hasLengthOf()', function () {
      const string1 = 'banana'
      itShouldBeChainable(() => assert(string1).hasLengthOf(string1.length))
      itShouldNotThrowWhenTheValue('length matches the restriction', function () {
        assert('').hasLengthOf(0)
        assert(string1).hasLengthOf(string1.length)
      })
      itShouldThrowWhenTheValue('length does not match the restriction', function () {
        throws(() => assert(string1).hasLengthOf(string1.length + 1))
      })
    })
    describe('matches()', function () {
      itShouldBeChainable(() => assert('abc').matches(/^abc$/))
      itShouldNotThrowWhenTheValue('matches the given regular expression', function () {
        assert('abc').matches(/^abc$/)
        assert(1).matches(/^1$/)
      })
      itShouldThrowWhenTheValue('does not match the given regular expression', function () {
        throws(() => assert('abce').matches(/^abc$/),
          'actual value does not match the given regular expression: /^abc$/')
        throws(() => assert(null).matches(/^abc$/),
          'actual value does not match the given regular expression: /^abc$/'
        )
      })
    })
    describe('contains()', function () {
      itShouldBeChainable(() => assert('abc').contains('bc'))
      itShouldNotThrowWhenTheValue('contains the given string', function () {
        assert('abc').contains('bc')
      })
      itShouldThrowWhenTheValue('does not contain the given string', function () {
        throws(() => assert('abc').contains('bca'),
          'actual value does not contain the given string')
      })
    })
    describe('startsWith()', function () {
      itShouldBeChainable(() => assert('abc').startsWith('ab'))
      itShouldNotThrowWhenTheValue('starts with the given string', function () {
        assert('abc').startsWith('ab')
      })
      itShouldThrowWhenTheValue('does not start with the given string', function () {
        throws(() => assert('abc').startsWith('bc'),
          'actual value does not start with the given string')
      })
    })
    describe('endsWith()', function () {
      itShouldBeChainable(() => assert('abc').endsWith('bc'))
      itShouldNotThrowWhenTheValue('ends with the given string', function () {
        assert('abc').endsWith('bc')
      })
      itShouldThrowWhenTheValue('does not end with the given string', function () {
        throws(() => assert('abc').endsWith('ab'),
          'actual value does not end with the given string')
      })
    })
  })

  context('Arrays', function () {
    const numberArray = [2, 1, 3, 1]
    const objectArray = [{ a: 3 }, { b: 'a' }, { a: 8 }]
    describe('isAnArray()', function () {
      itShouldBeChainable(() => assert(numberArray).isAnArray())
      itShouldNotThrowWhenTheValue('is an array', function () {
        assert(numberArray).isAnArray()
      })
      itShouldThrowWhen('it is not an array', function () {
        throws(() => assert('banana').isAnArray())
        throws(() => assert(null).isAnArray())
      })
    })
    describe('isNotAnArray()', function () {
      itShouldBeChainable(() => assert('banana').isNotAnArray())
      itShouldNotThrowWhenTheValue('is not an array', function () {
        assert('banana').isNotAnArray()
        assert(null).isNotAnArray()
      })
      itShouldThrowWhen('it is an array', function () {
        throws(() => assert(numberArray).isNotAnArray())
      })
    })
    describe('every()', function () {
      itShouldBeChainable(() => assert(numberArray).every(it => it.isANumber()))
      itShouldNotThrowWhen('every item pass the following assertions', function () {
        assert(numberArray).every(it => it.isANumber())
      })
      itShouldThrowWhen('not every item pass the following assertions', function () {
        throws(() => assert(numberArray).every(it => it.isBelow(3)))
      })
    })
    describe('some()', function () {
      itShouldBeChainable(() => assert(numberArray).every(it => it.isANumber()))
      itShouldNotThrowWhen('some item pass the following assertions', function () {
        assert(numberArray).some(it => it.isEqualTo(3))
      })
      itShouldThrowWhen('not any item pass the following assertions', function () {
        throws(() => assert(numberArray).some(it => it.isEqualTo(8)))
        throws(() => assert(numberArray).some(it => it.isEqualTo(8)))
        assert(() => assert(numberArray).some(it => it.isAnApple(8))).throwsAn(Error)
      })
    })
    describe('hasLength()', function () {
      itShouldBeChainable(() => assert(numberArray).hasLength(it => it.isANumber()))
      itShouldNotThrowWhen('the length property match the assertion', function () {
        assert(numberArray).hasLength()
        assert(numberArray).hasLength(it => it.isAbove(numberArray.length - 1))
      })
      itShouldThrowWhen('the length property does not match the assertion', function () {
        throws(() => assert(3).hasLength())
        throws(() => assert(numberArray).hasLength(it => it.isAbove(numberArray.length + 1)))
      })
    })
    describe('hasLengthOf()', function () {
      itShouldBeChainable(() => assert(numberArray).hasLengthOf(numberArray.length))
      itShouldNotThrowWhen('the length property match the assertion', function () {
        assert(numberArray).hasLengthOf(numberArray.length)
      })
      itShouldThrowWhen('the length property does not match the assertion', function () {
        throws(() => assert(numberArray).hasLengthOf(numberArray.length + 1))
      })
    })
    describe('includes()', function () {
      itShouldBeChainable(() => assert(objectArray).includes({ a: 8 }))
      itShouldNotThrowWhen('the array includes the given item', function () {
        assert(objectArray).includes({ a: 8 })
      })
      itShouldThrowWhen('the array does not include the given item', function () {
        throws(() => assert(objectArray).includes({ b: 8 }))
      })
    })
    describe('includesOnly()', function () {
      itShouldBeChainable(() => assert(objectArray).includesOnly(objectArray))
      itShouldNotThrowWhen('the array includes only the given items', function () {
        assert(objectArray.concat(objectArray)).includesOnly(objectArray)
      })
      itShouldThrowWhen('the array does not include only the given items', function () {
        throws(() => assert(objectArray).includesOnly([2, 9]))
      })
    })
    describe('item()', function () {
      itShouldBeChainable(() => assert(numberArray).item(1, it => it.is(numberArray[1])))
      itShouldNotThrowWhen('the test on the item passes', function () {
        assert(numberArray).item(1, it => it.is(numberArray[1]))
      })
      itShouldThrowWhen('the array does not include only the given items', function () {
        throws(() => assert(numberArray).item(1, it => it.is('-2')))
      })
    })
  })

  describe('satisfies()', function () {
    const value = 'banana'
    itShouldBeChainable(() => assert(value).satisfies(value => value === 'banana'))
    itShouldNotThrowWhenTheValue('satisfies the following function (i.e. it returns true)', function () {
      assert(value).satisfies(value => value === 'banana')
    })
    itShouldThrowWhenTheValue('does not satisfy the following function (i.e. it returns false)', function () {
      throws(() => assert(value).satisfies(value => value === 'lemon'), 'actual value does not satisfy the given test')
      assert(() => assert(value).satisfies()).throwsAn(Error)
    })
  })

  context('Object Freeze', function () {
    const frozen = Object.freeze({})
    const notFrozen = {}
    describe('isFrozen()', function () {
      itShouldBeChainable(() => assert(frozen).isFrozen())
      itShouldNotThrowWhenTheValue('is frozen', function () {
        assert(frozen).isFrozen()
      })
      itShouldThrowWhenTheValue('is not frozen', function () {
        throws(() => assert(notFrozen).isFrozen(), 'actual value is not frozen')
      })
    })
    describe('isNotFrozen()', function () {
      itShouldBeChainable(() => assert(notFrozen).isNotFrozen())
      itShouldNotThrowWhenTheValue('is not frozen', function () {
        assert(notFrozen).isNotFrozen()
      })
      itShouldThrowWhenTheValue('is frozen', function () {
        throws(() => assert(frozen).isNotFrozen(), 'actual value is frozen')
      })
    })
  })

  describe('isInstanceOf()', function () {
    const object = {}
    itShouldBeChainable(() => assert(object).isInstanceOf(Object))
    itShouldNotThrowWhen('it is instance of a given class', function () {
      assert(object).isInstanceOf(Object)
    })
    itShouldNotThrowWhen('it is not instance of a given class', function () {
      throws(() => assert(object).isInstanceOf(Array), 'actual value is not instance of class Array')
    })
  })

  describe('Extensions', function () {
    it('should be able to accept extensions', function () {
      const banana = 'I am a banana!'
      const apple = 'I am an apple'
      // Add a new method
      Assertion.prototype.isABanana = function isABanana () {
        if (this.actual !== banana) throw this.fire('{name} is not a banana', banana)
        return this
      }
      assert(banana).isABanana()
      throws(() => assert(apple).isABanana(), 'actual value is not a banana')
    })
  })
  context('Functions', function () {
    describe('throws(), throwsA(), throwsAn()', function () {
      function testException (fn, message) {
        try { fn() } catch (error) {
          if (!(error instanceof AssertionError) || message !== error.message) {
            throw new Error('Exception is wrong: ' + error.message)
          }
          return
        }
        throw new Error(fn + ' should throw an exception')
      }
      describe('meta - testException()', function () {
        itShouldThrowWhen('no exceptions has been thrown', function () {
          assert(() => testException(() => {})).throwsAn(Error)
        })
        itShouldThrowWhen('is not an AssertionError', function () {
          assert(() => testException(() => { throw new Error('something') })).throwsAn(Error)
        })
      })

      class SomeError extends Error { }
      class AnotherError extends Error { }

      itShouldBeChainable(() => assert(() => { throw new Error() }).throws())
      itShouldNotThrowWhen('the actual function throws an exception', function () {
        assert(() => { throw new Error() }).throws()
        assert(() => { throw new SomeError() }).throwsA(SomeError)
        assert(() => { throw new AnotherError() }).throwsAn(AnotherError)
        assert(() => { throw new Error('ok') })
          .throws(it => it.includesProperty('message', it => it.isEqualTo('ok')))
      })
      itShouldThrowWhen('the actual function does not throw any exceptions', function () {
        testException(() => assert(() => { }).throws(), 'function did not throw')
        testException(() => assert(() => { throw new Error() }).throwsA(SomeError), 'function error is not a SomeError')
        testException(() => assert(() => { throw new Error() }).throwsAn(AnotherError), 'function error in not an AnotherError')
        testException(
          () => assert(() => { throw new Error('ok') }).throws(it => it.includesProperty('message', it => it.isEqualTo('ko'))),
          'function error message property is different than expected value')
      })
    })
  })

  context('Promises', function () {
    function testRejection (promise, message) {
      return promise.then(
        () => { throw new Error('Rejection expected') },
        (error) => {
          assert(error).isInstanceOf(AssertionError)
            .includesProperty('message', it => it.isEqualTo(message))
        }
      )
    }

    describe('meta - testRejection()', function () {
      itShouldThrowWhen('no rejection happens', function () {
        return assert(testRejection(Promise.resolve())).isRejected()
      })
    })

    describe('isFulfilled()', function () {
      itShouldNotThrowWhen('the promise is fulfilled', function () {
        return Promise.all([
          assert(resolved).isFulfilled(),
          assert(resolved).isFulfilled(it => it.isEqualTo(true))
        ])
      })
      itShouldThrowWhen('the promise is rejected or the test fails', function () {
        return Promise.all([
          testRejection(assert(rejected).isFulfilled(), 'promise has been rejected'),
          testRejection(assert(resolved).isFulfilled(it => it.isEqualTo(false)),
            'promise resolved actual value is different than expected value')
        ])
      })
    })
    describe('isRejected()', function () {
      itShouldNotThrowWhen('the promise is rejected', function () {
        return Promise.all([
          assert(rejected).isRejected(),
          assert(rejected).isRejected((error) => {
            error.includesProperty('message', it => it.isEqualTo('A terrible error'))
          })
        ])
      })
      itShouldThrowWhen('the promise is fulfilled or the test fail', function () {
        return Promise.all([
          testRejection(assert(resolved).isRejected(), 'promise has been fulfilled'),
          testRejection(assert(rejected).isRejected(
            error => error.includesProperty('message', it => it.isEqualTo('A terrible mistake'))
          ), 'error message property is different than expected value')
        ])
      })
    })
  })
  context('Message Composition', function () {
    it('should provide composed messages', function () {
      const things = { colors: [{ name: 'red', value: '#FF0000' }, { name: 'red', value: '#0000FF' }, { name: 'green', value: '00FF00' }] }
      throws(
        () => assert(things).includesOwnProperty('colors', it => it.every(it => it.includesProperty('value', it => it.matches(/^#[0-9a-f]{6}$/i)))),
        'actual value colors own property at index 2 value property does not match the given regular expression: /^#[0-9a-f]{6}$/i'
      )
    })
  })
  describe('assert.fail()', function () {
    itShouldThrowWhen('it is call', function () {
      throws(() => assert.fail('You shall not pass!'), 'You shall not pass!')
    })
  })
  describe('assert.fn()', function () {
    it('should provide editor help', function () {
      const isABanana = assert.fn(it => it.isEqualTo('BANANA', '{name} is not a banana'))
      // same as "const isABanana = it => it.isEqualTo('BANANA', '{name} is not a banana')"
      const object = { a: 'BANANA', b: 'APPLE' }
      isABanana(assert('BANANA'))
      assert(object).includesProperty('a', isABanana)
      throws(
        () => assert(object).includesProperty('b', isABanana),
        'actual value b property is not a banana'
      )
    })
  })
  describe('PoC', function () {
    context('is high-order func', function () {
      const is = (expected, message) => it => it.is(expected, message)
      it('should assert deep equality for properties', function () {
        assertThat({ a: 23, b: 55 })
          .includesProperty('a', is(23))
          .includesProperty('b', it => it.isBelow(100))
      })
    })
  })
})
