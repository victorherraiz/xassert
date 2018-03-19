/* eslint-env mocha */

'use strict'

const assert = require('.')
const AssertionError = assert.Error
const Assertion = assert.Assertion
const identity = v => v

function throws (fn) {
  assert(fn).throwsAn(AssertionError)
}

function shouldNotThrowWhen (when) {
  return 'should not throw an assertion error when ' + when
}

function itShouldNotThrowWhenTheValue (when, cb) {
  it(shouldNotThrowWhen('the actual value ') + when, cb)
}

function shouldThrowWhen (when) {
  return 'should throw an assertion error when ' + when
}

function itShouldThrowWhenTheValue (when, cb) {
  it(shouldThrowWhen('the actual value ') + when, cb)
}

function itShouldBeChainable (fn) {
  it('should be chainable', function () {
    assert(fn()).isInstanceOf(Assertion)
  })
}

describe('xassert', function () {
  describe('getValue()', function () {
    it('should return the actual value', function () {
      const value = 4
      assert(assert(value).getValue()).isEqualTo(value)
    })
  })
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
    it(shouldNotThrowWhen('the actual value is strictly not equal (i.e. !==) to expected'), function () {
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
        throws(() => assert(undefined).isDeeplyEqualTo(null))
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

  describe('andIt property', function () {
    it('should be equal to the current instance to allow chaining', function () {
      assert(1).isNotAString().andIt.isAbove(0)
      throws(() => assert(1).isANumber().andIt.isAtMost(-2))
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

  describe('Promises', function () {
    const resolved = Promise.resolve(true)
    const rejected = Promise.reject(new Error('A terrible error'))

    // Avoid warning
    rejected.catch((error) => assert(error).isInstanceOf(Error))

    function testRejection (promise) {
      return promise.then(() => {
        throw new Error('Rejection expected')
      }, identity)
    }

    describe('isAPromise(): this', function () {
      itShouldBeChainable(() => assert(resolved).isAPromise())
      it(shouldNotThrowWhen('it is a promise'), function () {
        assert(resolved).isAPromise()
        assert(rejected).isAPromise()
      })
      it(shouldThrowWhen('is not a promise'), function () {
        throws(() => assert('BANANA').isAPromise())
      })
    })
    describe('isNotAPromise(): this', function () {
      itShouldBeChainable(() => assert(null).isNotAPromise())
      it(shouldNotThrowWhen('it is not a promise'), function () {
        assert('BANANA').isNotAPromise()
      })
      it(shouldThrowWhen('is a promise'), function () {
        throws(() => assert(resolved).isNotAPromise())
        throws(() => assert(rejected).isNotAPromise())
      })
    })
    describe('isFulfilled()', function () {
      it(shouldNotThrowWhen('the promise is fulfilled'), function () {
        return Promise.all([
          assert(resolved).isFulfilled(),
          assert(resolved).isFulfilled(it => it.isEqualTo(true))
        ])
      })
      it(shouldThrowWhen('the promise is not rejected'), function () {
        return Promise.all([
          testRejection(assert(rejected).isFulfilled()),
          testRejection(assert(resolved).isFulfilled(it => it.isEqualTo(false)))
        ])
      })
    })
    describe('isRejected()', function () {
      it(shouldNotThrowWhen('the promise is rejected'), function () {
        return Promise.all([
          assert(rejected).isRejected(),
          assert(rejected).isRejected((error) => {
            error.hasProperty('message', it => it.isEqualTo('A terrible error'))
          })
        ])
      })
      it(shouldThrowWhen('the promise is not rejected'), function () {
        return Promise.all([
          testRejection(assert(resolved).isRejected()),
          testRejection(assert(rejected).isRejected((error) => {
            error.hasProperty('message', it => it.IsEqualTo('A terrible mistake'))
          }))
        ])
      })
    })
  })

  describe('properties', function () {
    const object = { a: 1, b: 'text', c: null }
    describe('hasProperty()', function () {
      itShouldBeChainable(() => assert(object).hasProperty('a'))
      it(shouldNotThrowWhen('the property exists'), function () {
        assert(object).hasProperty('a')
        assert(object).hasProperty('a', it => it.isEqualTo(1))
      })
      it(shouldThrowWhen('the property does not exist'), function () {
        throws(() => assert(object).hasProperty('x'))
        throws(() => assert(object).hasProperty('a', it => it.isEqualTo(2)))
      })
    })

    describe('doesNotHaveProperty()', function () {
      itShouldBeChainable(() => assert(object).doesNotHaveProperty('z'))
      it(shouldNotThrowWhen('the property does not exists'), function () {
        assert(object).doesNotHaveProperty('z')
      })
      it(shouldThrowWhen('the property exists'), function () {
        throws(() => assert(object).doesNotHaveProperty('a'))
      })
    })

    describe('hasOwnProperty()', function () {
      itShouldBeChainable(() => assert(object).hasOwnProperty('a'))
      it(shouldNotThrowWhen('the own property exists'), function () {
        assert(object).hasOwnProperty('a')
        assert(object).hasOwnProperty('a', value => value.isEqualTo(1))
      })
      it(shouldThrowWhen('the own property does not exists'), function () {
        throws(() => assert(object).hasOwnProperty('x'))
        throws(() => assert(object).hasOwnProperty('a', value => value.isEqualTo(2)))
      })
    })

    describe('doesNotHaveOwnProperty()', function () {
      itShouldBeChainable(() => assert(object).doesNotHaveOwnProperty('z'))
      it(shouldNotThrowWhen('the own property does not exists'), function () {
        assert(object).doesNotHaveOwnProperty('z')
      })
      it(shouldThrowWhen('the own property exists'), function () {
        throws(() => assert(object).doesNotHaveOwnProperty('a'))
      })
    })
  })

  describe('Numbers', function () {
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

  describe('hasLengthOf()', function () {
    const string1 = 'banana'
    itShouldBeChainable(() => assert(string1).hasLengthOf(string1.length))
    itShouldNotThrowWhenTheValue('length matches the restriction', function () {
      assert(string1).hasLengthOf(string1.length)
      assert(string1).hasLengthOf(it => it.isAbove(string1.length - 1))
    })
    itShouldThrowWhenTheValue('length does not match the restriction', function () {
      throws(() => assert(string1).hasLengthOf(string1.length + 1))
      throws(() => assert(string1).hasLengthOf(it => it.isAbove(string1.length + 1)))
    })
  })

  describe('Arrays', function () {
    const array1 = [2, 1, 3, 1]
    describe('isAnArray()', function () {
      itShouldBeChainable(() => assert(array1).isAnArray())
      itShouldNotThrowWhenTheValue('is an array', function () {
        assert(array1).isAnArray()
      })
      it(shouldThrowWhen('it is not an array'), function () {
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
      it(shouldThrowWhen('it is an array'), function () {
        throws(() => assert(array1).isNotAnArray())
      })
    })
    describe('every()', function () {
      itShouldBeChainable(() => assert(array1).every(it => it.isANumber()))
      it(shouldNotThrowWhen('every item pass the following assertions'), function () {
        assert(array1).every(it => it.isANumber())
      })
      it(shouldThrowWhen('not every item pass the following assertions'), function () {
        throws(() => assert(array1).every(it => it.isBelow(3)))
      })
    })
    describe('some()', function () {
      itShouldBeChainable(() => assert(array1).every(it => it.isANumber()))
      it(shouldNotThrowWhen('some item pass the following assertions'), function () {
        assert(array1).some(it => it.isEqualTo(3))
      })
      it(shouldThrowWhen('not any item pass the following assertions'), function () {
        throws(() => assert(array1).some(it => it.isEqualTo(8)))
      })
    })
    describe('hasLengthOf()', function () {
      itShouldBeChainable(() => assert(array1).every(it => it.isANumber()))
      it(shouldNotThrowWhen('the length property match the assertion'), function () {
        assert(array1).hasLengthOf(array1.length)
        assert(array1).hasLengthOf(it => it.isAbove(array1.length - 1))
      })
      it(shouldThrowWhen('the length property does not match the assertion'), function () {
        throws(() => assert(array1).hasLengthOf(array1.length + 1))
        throws(() => assert(array1).hasLengthOf(it => it.isAbove(array1.length + 1)))
      })
    })
  })

  describe('throws()', function () {
    function testException (fn) {
      try { fn() } catch (e) {
        if (!(e instanceof AssertionError)) throw new Error(fn + ' should throw an AssertionError')
        return
      }
      throw new Error(fn + ' should throw an exception')
    }
    class SomeError extends Error {}
    class AnotherError extends Error {}

    itShouldBeChainable(() => assert(() => { throw new Error() }).throws())
    it(shouldNotThrowWhen('the actual function throws an exception'), function () {
      assert(() => { throw new Error() }).throws()
      assert(() => { throw new SomeError() }).throwsA(SomeError)
      assert(() => { throw new AnotherError() }).throwsAn(AnotherError)
      assert(() => { throw new Error('ok') })
        .throws(it => it.hasProperty('message', it => it.isEqualTo('ok')))
    })
    it(shouldThrowWhen('the actual function does not throw any exceptions'), function () {
      testException(() => assert(() => {}).throws())
      testException(() => assert(() => { throw new Error() }).throwsA(SomeError))
      testException(() => assert(() => { throw new Error() }).throwsAn(AnotherError))
      testException(() => assert(() => { throw new Error('ok') })
        .throws(it => it.hasProperty('message', it => it.isEqualTo('ko'))))
    })
  })

  describe('satisfies()', function () {
    const value = 'banana'
    itShouldBeChainable(() => assert(value).satisfies(value => value === 'banana'))
    itShouldNotThrowWhenTheValue('satisfies the following function (i.e. it returns true)', function () {
      assert(value).satisfies(value => value === 'banana')
    })
    itShouldThrowWhenTheValue('does not satisfy the following function (i.e. it returns false)', function () {
      throws(() => assert(value).satisfies(value => value === 'lemon'))
    })
  })

  describe('Object Freeze', function () {
    const frozen = Object.freeze({})
    const notFrozen = {}
    describe('isFrozen()', function () {
      itShouldBeChainable(() => assert(frozen).isFrozen())
      itShouldNotThrowWhenTheValue('is frozen', function () {
        assert(frozen).isFrozen()
      })
      itShouldThrowWhenTheValue('is not frozen', function () {
        throws(() => assert(notFrozen).isFrozen())
      })
    })
    describe('isNotFrozen()', function () {
      itShouldBeChainable(() => assert(notFrozen).isNotFrozen())
      itShouldNotThrowWhenTheValue('is not frozen', function () {
        assert(notFrozen).isNotFrozen()
      })
      itShouldThrowWhenTheValue('is frozen', function () {
        throws(() => assert(frozen).isNotFrozen())
      })
    })
  })

  describe('isInstanceOf()', function () {
    const object = {}
    itShouldBeChainable(() => assert(object).isInstanceOf(Object))
    it(shouldNotThrowWhen('it is instance of a given class'), function () {
      assert(object).isInstanceOf(Object)
    })
    it(shouldNotThrowWhen('it is not instance of a given class'), function () {
      throws(() => assert(object).isInstanceOf(Array))
    })
  })

  describe('Extensions', function () {
    it('should be able to accept extensions', function () {
      const banana = 'I am a banana!'
      const apple = 'I am an apple'
      const { Assertion } = assert
      Assertion.prototype.isABanana = function isABanana () {
        if (this.value !== banana) throw new AssertionError('It not a banana')
        return this
      }
      assert(banana).isABanana()
      throws(() => assert(apple).isABanana())
    })
  })
})
