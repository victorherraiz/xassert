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

function shouldThrowWhen (when) {
  return 'should throw an assertion error when ' + when
}

function chainable (fn) {
  it('should be chainable', function () {
    assert(fn()).isInstanceOf(Assertion)
  })
}

describe('xassert', function () {
  describe('isEqualTo(expected: any): this', function () {
    chainable(() => assert(true).isEqualTo(true))
    it(shouldNotThrowWhen('the actual value is strictly equal (i.e. ===) to expected'), function () {
      assert(4).isEqualTo(4)
    })
    it(shouldThrowWhen('the actual value is not strictly equal (i.e. ===) to expected'), function () {
      throws(() => assert(4).isEqualTo(5))
      throws(() => assert(4).isEqualTo('4'))
      throws(() => assert({ a: 1 }).isEqualTo({ a: 1 }))
      throws(() => assert([1]).isEqualTo([1]))
    })
  })
  describe('isNotEqualTo(expected: any): this', function () {
    chainable(() => assert(true).isNotEqualTo(false))
    it(shouldNotThrowWhen('the actual value is strictly not equal (i.e. !==) to expected'), function () {
      assert(4).isNotEqualTo(3)
      assert(4).isNotEqualTo('4')
    })
    it(shouldThrowWhen('the actual value is not strictly not equal (i.e. !==) to expected'), function () {
      const obj = { a: 1 }
      throws(() => assert(true).isNotEqualTo(true))
      throws(() => assert(obj).isNotEqualTo(obj))
    })
  })
  describe('isEqualToAnyOf(any[]): this', function () {
    chainable(() => assert(true).isEqualToAnyOf([true]))
    it(shouldNotThrowWhen('the actual value is strictly equal (i.e. ===) to any of expected'), function () {
      assert(4).isEqualToAnyOf([3, 4])
    })
    it(shouldThrowWhen('the actual value is not strictly equal (i.e. ===) to any of expected'), function () {
      throws(() => assert(4).isEqualToAnyOf([5, 6]))
      throws(() => assert(4).isEqualToAnyOf(['4']))
      throws(() => assert({ a: 1 }).isEqualToAnyOf([{ a: 1 }]))
      throws(() => assert([1]).isEqualToAnyOf([1]))
    })
  })
  describe('isNotEqualToAnyOf(any[]): this', function () {
    chainable(() => assert(true).isNotEqualToAnyOf([false]))
    it(shouldNotThrowWhen('the actual value is strictly not equal (i.e. !==) to any of expected'), function () {
      assert(4).isNotEqualToAnyOf([3, 6])
      assert(4).isNotEqualToAnyOf(['4'])
    })
    it(shouldThrowWhen('the actual value is not strictly not equal (i.e. !==) to any of expected'), function () {
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
      chainable(() => assert(object).isDeeplyEqualTo(deepEqualToObject))
      it(shouldNotThrowWhen('the actual value is deep equal to expected'), function () {
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
      it(shouldThrowWhen('the actual value is not deep equal to expected'), function () {
        throws(() => assert(object).isDeeplyEqualTo(differentObject))
        throws(() => assert(object).isDeeplyEqualTo(anotherDifferentObject))
        throws(() => assert(object).isDeeplyEqualTo(null))
        throws(() => assert(null).isDeeplyEqualTo(object))
        throws(() => assert(4).isDeeplyEqualTo(3))
        throws(() => assert(undefined).isDeeplyEqualTo(null))
        throws(() => assert([]).isDeeplyEqualTo({}))
        throws(() => assert([[1, object]]).isDeeplyEqualTo([[1, differentObject]]))
        throws(() => assert([]).isDeeplyEqualTo({ length: 0 }))
        throws(() => assert(['banana']).isDeeplyEqualTo([2]))
        throws(() => assert([1, 3]).isDeeplyEqualTo([3, 1]))
        throws(() => assert(['4']).isDeeplyEqualTo([4]))
      })
    })
  })

  describe('andIt property', function () {
    it('should be equal to the current instance to allow chaining', function () {
      assert(1).isNotAString().andIt.isAbove(0)
      throws(() => assert(1).isANumber().andIt.isAtMost(-2))
    })
  })
})

describe('isNull()', function () {
  chainable(() => assert(null).isNull())
  it(shouldNotThrowWhen('the actual value is null'), function () {
    assert(null).isNull()
  })
  it(shouldThrowWhen('the actual value is not null'), function () {
    throws(() => assert('apple').isNull())
  })
})
describe('isNotNull()', function () {
  chainable(() => assert(1).isNotNull())
  it(shouldNotThrowWhen('the actual value is not null'), function () {
    assert('banana').isNotNull()
  })
  it(shouldThrowWhen('the actual value is null'), function () {
    throws(() => assert(null).isNotNull())
  })
})


describe('isUndefined()', function () {
  chainable(() => assert(undefined).isUndefined())
  it(shouldNotThrowWhen('the actual value is undefined'), function () {
    assert(undefined).isUndefined()
  })
  it(shouldThrowWhen('the actual value is not undefined'), function () {
    throws(() => assert('apple').isUndefined())
  })
})
describe('isNotUndefined', function () {
  chainable(() => assert(1).isNotUndefined())
  it(shouldNotThrowWhen('the actual value is not undefined'), function () {
    assert('banana').isNotUndefined()
  })
  it(shouldThrowWhen('the actual value is undefined'), function () {
    throws(() => assert(undefined).isNotUndefined())
  })
})


describe('isNaN()', function () {
  chainable(() => assert(NaN).isNaN())
  it(shouldNotThrowWhen('the actual value is NaN'), function () {
    assert(NaN).isNaN()
  })
  it(shouldThrowWhen('the actual value is not NaN'), function () {
    throws(() => assert(1).isNaN())
  })
})
describe('isNotNaN', function () {
  chainable(() => assert(1).isNotNaN())
  it(shouldNotThrowWhen('the actual value is not NaN'), function () {
    assert(1).isNotNaN()
  })
  it(shouldThrowWhen('the actual value is NaN'), function () {
    throws(() => assert(NaN).isNotNaN())
  })
})


describe('Promises', function () {
  const resolved = Promise.resolve(true)
  const rejected = Promise.reject(new Error('A terrible error'))

  //Avoid warning
  rejected.catch((error) => assert(error).isInstanceOf(Error))

  function testRejection (promise) {
    return promise.then(() => {
      throw new Error('Rejection expected')
    }, identity)
  }

  describe('isAPromise(): this', function () {
    chainable(() => assert(resolved).isAPromise())
    it(shouldNotThrowWhen('it is a promise'), function () {
      assert(resolved).isAPromise()
      assert(rejected).isAPromise()
    })
    it(shouldThrowWhen('is not a promise'), function () {
      throws(() => assert('BANANA').isAPromise())
    })
  })
  describe('isNotAPromise(): this', function () {
    chainable(() => assert(null).isNotAPromise())
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
    chainable(() => assert(object).hasProperty('a'))
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
    chainable(() => assert(object).doesNotHaveProperty('z'))
    it(shouldNotThrowWhen('the property does not exists'), function () {
      assert(object).doesNotHaveProperty('z')
    })
    it(shouldThrowWhen('the property exists'), function () {
      throws(() => assert(object).doesNotHaveProperty('a'))
    })
  })

})


function ownProperties () {
  const object = { a: 1, b: 'text', c: null }
  assert(object).hasOwnProperty('a')
  assert(object).hasOwnProperty('a', value => value.isEqualTo(1))
  throws(() => assert(object).hasOwnProperty('x'))
  throws(() => assert(object).hasOwnProperty('a', value => value.isEqualTo(2)))

  assert(object).doesNotHaveOwnProperty('z')
  throws(() => assert(object).doesNotHaveOwnProperty('a'))
}



function numbers () {
  assert(4.3).isANumber()
  assert('5').isNotANumber()

  throws(() => assert('3').isANumber())
  throws(() => assert(3).isNotANumber())

  assert(3).isAbove(2)
  assert(3).isAtLeast(2)
  assert(3).isAtLeast(3)
  assert(2).isBelow(3)
  assert(2).isAtMost(2)
  assert(2).isAtMost(3)

  throws(() => assert(3).isAbove(3))
  throws(() => assert(3).isAbove(4))
  throws(() => assert(3).isAtLeast(4))
  throws(() => assert(3).isBelow(3))
  throws(() => assert(3).isBelow(2))
  throws(() => assert(3).isAtMost(2))
}

function strings () {
  const string1 = 'banana'

  assert('a').isAString()
  assert(1).isNotAString()
  // eslint-disable-next-line no-new-wrappers
  assert(new String('a')).isNotAString()

  throws(() => assert(2).isAString())
  throws(() => assert('d').isNotAString())

  assert(string1).hasLengthOf(string1.length)
  assert(string1).hasLengthOf(it => it.isAbove(string1.length - 1))

  throws(() => assert(string1).hasLengthOf(string1.length + 1))
  throws(() => assert(string1).hasLengthOf(it => it.isAbove(string1.length + 1)))
}

describe('Arrays', function () {
  const array1 = [2, 1, 3, 1]
  describe('isAnArray()', function () {
    chainable(() => assert(array1).isAnArray())
    it(shouldNotThrowWhen('it is an array'), function () {
      assert(array1).isAnArray()
    })
    it(shouldThrowWhen('it is not an array'), function () {
      throws(() => assert('banana').isAnArray())
      throws(() => assert(null).isAnArray())
    })
  })
  describe('isNotAnArray()', function () {
    chainable(() => assert('banana').isNotAnArray())
    it(shouldNotThrowWhen('it is not an array'), function () {
      assert('banana').isNotAnArray()
      assert(null).isNotAnArray()
      
    })
    it(shouldThrowWhen('it is an array'), function () {
      throws(() => assert(array1).isNotAnArray())
    })
  })
  describe('every()', function () {
    chainable(() => assert(array1).every(it => it.isANumber()))
    it(shouldNotThrowWhen('every item pass the following assertions'), function () {
      assert(array1).every(it => it.isANumber()) 
    })
    it(shouldThrowWhen('not every item pass the following assertions'), function () {
      throws(() => assert(array1).every(it => it.isBelow(3)))
    })
  })
  describe('some()', function () {
    chainable(() => assert(array1).every(it => it.isANumber()))
    it(shouldNotThrowWhen('some item pass the following assertions'), function () {
      assert(array1).some(it => it.isEqualTo(3)) 
    })
    it(shouldThrowWhen('not any item pass the following assertions'), function () {
      throws(() => assert(array1).some(it => it.isEqualTo(8)))
    })
  })
  describe('hasLengthOf()', function () {
    chainable(() => assert(array1).every(it => it.isANumber()))
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

function throwsTest () {
  function testException (fn) {
    try { fn() }
    catch (e) {
      if (!(e instanceof AssertionError)) throw new Error(fn + ' should throw an AssertionError')
      return
    }
    throw new Error(fn + ' should throw an exception')
  }

  class SomeError extends Error {}
  class AnotherError extends Error {}

  assert(() => { throw new Error() }).throws()
  assert(() => { throw new SomeError() }).throwsA(SomeError)
  assert(() => { throw new AnotherError() }).throwsAn(AnotherError)
  assert(() => { throw new Error('ok') })
    .throws(it => it.hasProperty('message', it => it.isEqualTo('ok')))

  testException(() => assert(() => {}).throws())
  testException(() => assert(() => { throw new Error() }).throwsA(SomeError))
  testException(() => assert(() => { throw new Error() }).throwsAn(AnotherError))
  testException(() => assert(() => { throw new Error('ok') })
    .throws(it => it.hasProperty('message', it => it.isEqualTo('ko'))))
}

function satisfies () {
  const value = 'banana'
  assert(value).satisfies(value => value === 'banana')
  throws(() => assert(value).satisfies(value => value === 'lemon'))
}

function frozenTest () {
  const frozen = Object.freeze({})
  const notFrozen = {}

  assert(frozen).isFrozen()
  assert(notFrozen).isNotFrozen()

  throws(() => assert(notFrozen).isFrozen())
  throws(() => assert(frozen).isNotFrozen())
}

function plugins () {
  const banana = 'I am a banana!'
  const apple = 'I am an apple'

  assert.Assertion.prototype.isABanana = function isABanana () {
    if (this.value !== banana) {
      throw new AssertionError('It not a banana')
    }
    return this
  }

  assert(banana).isABanana()
  throws(() => assert(apple).isABanana())
}

describe('isInstanceOf()', function () {
  const object = {}
  chainable(() => assert(object).isInstanceOf(Object))
  it(shouldNotThrowWhen('it is instance of a given class'), function () {
    assert(object).isInstanceOf(Object)
  })
  it(shouldNotThrowWhen('it is not instance of a given class'), function () {
    throws(() => assert(object).isInstanceOf(Array))
  })
})

function deeplyEquals () {
  const obj1 = { a: 1, b: 'str', c: null, d: { a: 'deep' } }
  const obj2 = { a: 1, b: 'str', c: null, d: { a: 'deep' } }
  const obj3 = { a: 1, b: 'str', c: null, d: { b: 'deep' } }
  const obj4 = { a: 1, b: 'str', c: 5 }

  assert(obj1).isDeeplyEqualToAnyOf([obj2, obj3])
  assert(obj1).isNotDeeplyEqualToAnyOf([obj3, obj4])

  throws(() => assert(obj1).isDeeplyEqualToAnyOf([obj3, obj4]))
  throws(() => assert(obj1).isNotDeeplyEqualToAnyOf([obj3, obj1]))
}

it('migration', function () {
  return Promise.resolve()
    .then(deeplyEquals)
    .then(numbers)
    .then(strings)
    .then(ownProperties)
    .then(throwsTest)
    .then(satisfies)
    .then(frozenTest)
    .then(plugins)
})
