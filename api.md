# TOC
   - [xassert](#xassert)
     - [getValue()](#xassert-getvalue)
     - [isEqualTo(expected: any): this](#xassert-isequaltoexpected-any-this)
     - [isNotEqualTo(expected: any): this](#xassert-isnotequaltoexpected-any-this)
     - [isEqualToAnyOf(any[]): this](#xassert-isequaltoanyofany-this)
     - [isNotEqualToAnyOf(any[]): this](#xassert-isnotequaltoanyofany-this)
     - [Deep Equality](#xassert-deep-equality)
       - [isDeeplyEqualTo(any): this](#xassert-deep-equality-isdeeplyequaltoany-this)
       - [isNotDeeplyEqualTo(any): this](#xassert-deep-equality-isnotdeeplyequaltoany-this)
       - [isDeeplyEqualToAnyOf(any): this](#xassert-deep-equality-isdeeplyequaltoanyofany-this)
       - [isNotDeeplyEqualToAnyOf(any): this](#xassert-deep-equality-isnotdeeplyequaltoanyofany-this)
     - [andIt property](#xassert-andit-property)
     - [isNull()](#xassert-isnull)
     - [isNotNull()](#xassert-isnotnull)
     - [isUndefined()](#xassert-isundefined)
     - [isNotUndefined](#xassert-isnotundefined)
     - [isNaN()](#xassert-isnan)
     - [isNotNaN](#xassert-isnotnan)
     - [Promises](#xassert-promises)
       - [isAPromise(): this](#xassert-promises-isapromise-this)
       - [isNotAPromise(): this](#xassert-promises-isnotapromise-this)
       - [isFulfilled()](#xassert-promises-isfulfilled)
       - [isRejected()](#xassert-promises-isrejected)
     - [properties](#xassert-properties)
       - [hasProperty()](#xassert-properties-hasproperty)
       - [doesNotHaveProperty()](#xassert-properties-doesnothaveproperty)
       - [hasOwnProperty()](#xassert-properties-hasownproperty)
       - [doesNotHaveOwnProperty()](#xassert-properties-doesnothaveownproperty)
     - [Numbers](#xassert-numbers)
       - [isANumber()](#xassert-numbers-isanumber)
       - [isNotANumber()](#xassert-numbers-isnotanumber)
       - [isAbove(number), isAtLeast(number), isBelow(number) and isisAtMost(number)](#xassert-numbers-isabovenumber-isatleastnumber-isbelownumber-and-isisatmostnumber)
     - [isAString()](#xassert-isastring)
     - [isNotAString()](#xassert-isnotastring)
     - [hasLengthOf()](#xassert-haslengthof)
     - [Arrays](#xassert-arrays)
       - [isAnArray()](#xassert-arrays-isanarray)
       - [isNotAnArray()](#xassert-arrays-isnotanarray)
       - [every()](#xassert-arrays-every)
       - [some()](#xassert-arrays-some)
       - [hasLengthOf()](#xassert-arrays-haslengthof)
     - [throws()](#xassert-throws)
     - [satisfies()](#xassert-satisfies)
     - [Object Freeze](#xassert-object-freeze)
       - [isFrozen()](#xassert-object-freeze-isfrozen)
       - [isNotFrozen()](#xassert-object-freeze-isnotfrozen)
     - [isInstanceOf()](#xassert-isinstanceof)
     - [Extensions](#xassert-extensions)
<a name=""></a>
 
<a name="xassert"></a>
# xassert
<a name="xassert-getvalue"></a>
## getValue()
should return the actual value.

```js
const value = 4
assert(assert(value).getValue()).isEqualTo(value)
```

<a name="xassert-isequaltoexpected-any-this"></a>
## isEqualTo(expected: any): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is strictly equal (i.e. ===) to expected.

```js
assert(4).isEqualTo(4)
```

should throw an assertion error when the actual value is not strictly equal (i.e. ===) to expected.

```js
throws(() => assert(4).isEqualTo(5))
throws(() => assert(4).isEqualTo('4'))
throws(() => assert({ a: 1 }).isEqualTo({ a: 1 }))
throws(() => assert([1]).isEqualTo([1]))
```

<a name="xassert-isnotequaltoexpected-any-this"></a>
## isNotEqualTo(expected: any): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is strictly not equal (i.e. !==) to expected.

```js
assert(4).isNotEqualTo(3)
assert(4).isNotEqualTo('4')
```

should throw an assertion error when the actual value is not strictly not equal (i.e. !==) to expected.

```js
const obj = { a: 1 }
throws(() => assert(true).isNotEqualTo(true))
throws(() => assert(obj).isNotEqualTo(obj))
```

<a name="xassert-isequaltoanyofany-this"></a>
## isEqualToAnyOf(any[]): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is strictly equal (i.e. ===) to any of expected.

```js
assert(4).isEqualToAnyOf([3, 4])
```

should throw an assertion error when the actual value is not strictly equal (i.e. ===) to any of expected.

```js
throws(() => assert(4).isEqualToAnyOf([5, 6]))
throws(() => assert(4).isEqualToAnyOf(['4']))
throws(() => assert({ a: 1 }).isEqualToAnyOf([{ a: 1 }]))
throws(() => assert([1]).isEqualToAnyOf([1]))
```

<a name="xassert-isnotequaltoanyofany-this"></a>
## isNotEqualToAnyOf(any[]): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is strictly not equal (i.e. !==) to any of expected.

```js
assert(4).isNotEqualToAnyOf([3, 6])
assert(4).isNotEqualToAnyOf(['4'])
```

should throw an assertion error when the actual value is not strictly not equal (i.e. !==) to any of expected.

```js
const obj = { a: 1 }
throws(() => assert(true).isNotEqualToAnyOf([true]))
throws(() => assert(obj).isNotEqualToAnyOf([null, obj]))
```

<a name="xassert-deep-equality"></a>
## Deep Equality
<a name="xassert-deep-equality-isdeeplyequaltoany-this"></a>
### isDeeplyEqualTo(any): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is deep equal to expected.

```js
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
```

should throw an assertion error when the actual value is not deep equal to expected.

```js
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
```

<a name="xassert-deep-equality-isnotdeeplyequaltoany-this"></a>
### isNotDeeplyEqualTo(any): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is not deep equal to expected.

```js
assert(object).isNotDeeplyEqualTo(differentObject)
```

should throw an assertion error when the actual value is deep equal to expected.

```js
throws(() => assert(object).isNotDeeplyEqualTo(object))
throws(() => assert(object).isNotDeeplyEqualTo(deepEqualToObject))
```

<a name="xassert-deep-equality-isdeeplyequaltoanyofany-this"></a>
### isDeeplyEqualToAnyOf(any): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is deep equal to any of expected.

```js
assert(object).isDeeplyEqualToAnyOf([differentObject, deepEqualToObject])
```

should throw an assertion error when the actual value is not deep equal to any of expected.

```js
throws(() => assert(object).isDeeplyEqualToAnyOf([differentObject, anotherDifferentObject]))
```

<a name="xassert-deep-equality-isnotdeeplyequaltoanyofany-this"></a>
### isNotDeeplyEqualToAnyOf(any): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is not deep equal to any of expected.

```js
assert(object).isNotDeeplyEqualToAnyOf([differentObject, null])
```

should throw an assertion error when the actual value is deep equal to any of expected.

```js
throws(() => assert(object).isNotDeeplyEqualToAnyOf([differentObject, object]))
```

<a name="xassert-andit-property"></a>
## andIt property
should be equal to the current instance to allow chaining.

```js
assert(1).isNotAString().andIt.isAbove(0)
throws(() => assert(1).isANumber().andIt.isAtMost(-2))
```

<a name="xassert-isnull"></a>
## isNull()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is null.

```js
assert(null).isNull()
```

should throw an assertion error when the actual value is not null.

```js
throws(() => assert('apple').isNull())
```

<a name="xassert-isnotnull"></a>
## isNotNull()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is not null.

```js
assert('banana').isNotNull()
```

should throw an assertion error when the actual value is null.

```js
throws(() => assert(null).isNotNull())
```

<a name="xassert-isundefined"></a>
## isUndefined()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is undefined.

```js
assert(undefined).isUndefined()
```

should throw an assertion error when the actual value is not undefined.

```js
throws(() => assert('apple').isUndefined())
```

<a name="xassert-isnotundefined"></a>
## isNotUndefined
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is not undefined.

```js
assert('banana').isNotUndefined()
```

should throw an assertion error when the actual value is undefined.

```js
throws(() => assert(undefined).isNotUndefined())
```

<a name="xassert-isnan"></a>
## isNaN()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is NaN.

```js
assert(NaN).isNaN()
```

should throw an assertion error when the actual value is not NaN.

```js
throws(() => assert(1).isNaN())
```

<a name="xassert-isnotnan"></a>
## isNotNaN
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is not NaN.

```js
assert(1).isNotNaN()
```

should throw an assertion error when the actual value is NaN.

```js
throws(() => assert(NaN).isNotNaN())
```

<a name="xassert-promises"></a>
## Promises
<a name="xassert-promises-isapromise-this"></a>
### isAPromise(): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when it is a promise.

```js
assert(resolved).isAPromise()
assert(rejected).isAPromise()
```

should throw an assertion error when is not a promise.

```js
throws(() => assert('BANANA').isAPromise())
```

<a name="xassert-promises-isnotapromise-this"></a>
### isNotAPromise(): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when it is not a promise.

```js
assert('BANANA').isNotAPromise()
```

should throw an assertion error when is a promise.

```js
throws(() => assert(resolved).isNotAPromise())
throws(() => assert(rejected).isNotAPromise())
```

<a name="xassert-promises-isfulfilled"></a>
### isFulfilled()
should not throw an assertion error when the promise is fulfilled.

```js
return Promise.all([
  assert(resolved).isFulfilled(),
  assert(resolved).isFulfilled(it => it.isEqualTo(true))
])
```

should throw an assertion error when the promise is not rejected.

```js
return Promise.all([
  testRejection(assert(rejected).isFulfilled()),
  testRejection(assert(resolved).isFulfilled(it => it.isEqualTo(false)))
])
```

<a name="xassert-promises-isrejected"></a>
### isRejected()
should not throw an assertion error when the promise is rejected.

```js
return Promise.all([
  assert(rejected).isRejected(),
  assert(rejected).isRejected((error) => {
    error.hasProperty('message', it => it.isEqualTo('A terrible error'))
  })
])
```

should throw an assertion error when the promise is not rejected.

```js
return Promise.all([
  testRejection(assert(resolved).isRejected()),
  testRejection(assert(rejected).isRejected((error) => {
    error.hasProperty('message', it => it.IsEqualTo('A terrible mistake'))
  }))
])
```

<a name="xassert-properties"></a>
## properties
<a name="xassert-properties-hasproperty"></a>
### hasProperty()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the property exists.

```js
assert(object).hasProperty('a')
assert(object).hasProperty('a', it => it.isEqualTo(1))
```

should throw an assertion error when the property does not exist.

```js
throws(() => assert(object).hasProperty('x'))
throws(() => assert(object).hasProperty('a', it => it.isEqualTo(2)))
```

<a name="xassert-properties-doesnothaveproperty"></a>
### doesNotHaveProperty()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the property does not exists.

```js
assert(object).doesNotHaveProperty('z')
```

should throw an assertion error when the property exists.

```js
throws(() => assert(object).doesNotHaveProperty('a'))
```

<a name="xassert-properties-hasownproperty"></a>
### hasOwnProperty()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the own property exists.

```js
assert(object).hasOwnProperty('a')
assert(object).hasOwnProperty('a', value => value.isEqualTo(1))
```

should throw an assertion error when the own property does not exists.

```js
throws(() => assert(object).hasOwnProperty('x'))
throws(() => assert(object).hasOwnProperty('a', value => value.isEqualTo(2)))
```

<a name="xassert-properties-doesnothaveownproperty"></a>
### doesNotHaveOwnProperty()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the own property does not exists.

```js
assert(object).doesNotHaveOwnProperty('z')
```

should throw an assertion error when the own property exists.

```js
throws(() => assert(object).doesNotHaveOwnProperty('a'))
```

<a name="xassert-numbers"></a>
## Numbers
<a name="xassert-numbers-isanumber"></a>
### isANumber()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is a Number.

```js
assert(4.3).isANumber()
```

should throw an assertion error when the actual value is not a Number.

```js
throws(() => assert('3').isANumber())
```

<a name="xassert-numbers-isnotanumber"></a>
### isNotANumber()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is not a Number.

```js
assert('5').isNotANumber()
```

should throw an assertion error when the actual value is a Number.

```js
throws(() => assert(3).isNotANumber())
```

<a name="xassert-numbers-isabovenumber-isatleastnumber-isbelownumber-and-isisatmostnumber"></a>
### isAbove(number), isAtLeast(number), isBelow(number) and isisAtMost(number)
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value follows the restriction.

```js
assert(3).isAbove(2).isAtLeast(2).isAtLeast(3).isBelow(4).isAtMost(3).isAtMost(4)
```

should throw an assertion error when the actual value does not follow the restriction.

```js
throws(() => assert(3).isAbove(3))
throws(() => assert(3).isAbove(4))
throws(() => assert(3).isAtLeast(4))
throws(() => assert(3).isBelow(3))
throws(() => assert(3).isBelow(2))
throws(() => assert(3).isAtMost(2))
```

<a name="xassert-isastring"></a>
## isAString()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is a String.

```js
assert(string1).isAString()
```

should throw an assertion error when the actual value is not a String.

```js
throws(() => assert(2).isAString())
```

<a name="xassert-isnotastring"></a>
## isNotAString()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is a String.

```js
assert(1).isNotAString()
// eslint-disable-next-line no-new-wrappers
assert(new String('a')).isNotAString()
```

should throw an assertion error when the actual value is not a String.

```js
throws(() => assert('d').isNotAString())
```

<a name="xassert-haslengthof"></a>
## hasLengthOf()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value length matches the restriction.

```js
assert(string1).hasLengthOf(string1.length)
assert(string1).hasLengthOf(it => it.isAbove(string1.length - 1))
```

should throw an assertion error when the actual value length does not match the restriction.

```js
throws(() => assert(string1).hasLengthOf(string1.length + 1))
throws(() => assert(string1).hasLengthOf(it => it.isAbove(string1.length + 1)))
```

<a name="xassert-arrays"></a>
## Arrays
<a name="xassert-arrays-isanarray"></a>
### isAnArray()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is an array.

```js
assert(array1).isAnArray()
```

should throw an assertion error when it is not an array.

```js
throws(() => assert('banana').isAnArray())
throws(() => assert(null).isAnArray())
```

<a name="xassert-arrays-isnotanarray"></a>
### isNotAnArray()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is not an array.

```js
assert('banana').isNotAnArray()
assert(null).isNotAnArray()
```

should throw an assertion error when it is an array.

```js
throws(() => assert(array1).isNotAnArray())
```

<a name="xassert-arrays-every"></a>
### every()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when every item pass the following assertions.

```js
assert(array1).every(it => it.isANumber())
```

should throw an assertion error when not every item pass the following assertions.

```js
throws(() => assert(array1).every(it => it.isBelow(3)))
```

<a name="xassert-arrays-some"></a>
### some()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when some item pass the following assertions.

```js
assert(array1).some(it => it.isEqualTo(3))
```

should throw an assertion error when not any item pass the following assertions.

```js
throws(() => assert(array1).some(it => it.isEqualTo(8)))
```

<a name="xassert-arrays-haslengthof"></a>
### hasLengthOf()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the length property match the assertion.

```js
assert(array1).hasLengthOf(array1.length)
assert(array1).hasLengthOf(it => it.isAbove(array1.length - 1))
```

should throw an assertion error when the length property does not match the assertion.

```js
throws(() => assert(array1).hasLengthOf(array1.length + 1))
throws(() => assert(array1).hasLengthOf(it => it.isAbove(array1.length + 1)))
```

<a name="xassert-throws"></a>
## throws()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual function throws an exception.

```js
assert(() => { throw new Error() }).throws()
assert(() => { throw new SomeError() }).throwsA(SomeError)
assert(() => { throw new AnotherError() }).throwsAn(AnotherError)
assert(() => { throw new Error('ok') })
  .throws(it => it.hasProperty('message', it => it.isEqualTo('ok')))
```

should throw an assertion error when the actual function does not throw any exceptions.

```js
testException(() => assert(() => {}).throws())
testException(() => assert(() => { throw new Error() }).throwsA(SomeError))
testException(() => assert(() => { throw new Error() }).throwsAn(AnotherError))
testException(() => assert(() => { throw new Error('ok') })
  .throws(it => it.hasProperty('message', it => it.isEqualTo('ko'))))
```

<a name="xassert-satisfies"></a>
## satisfies()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value satisfies the following function (i.e. it returns true).

```js
assert(value).satisfies(value => value === 'banana')
```

should throw an assertion error when the actual value does not satisfy the following function (i.e. it returns false).

```js
throws(() => assert(value).satisfies(value => value === 'lemon'))
```

<a name="xassert-object-freeze"></a>
## Object Freeze
<a name="xassert-object-freeze-isfrozen"></a>
### isFrozen()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is frozen.

```js
assert(frozen).isFrozen()
```

should throw an assertion error when the actual value is not frozen.

```js
throws(() => assert(notFrozen).isFrozen())
```

<a name="xassert-object-freeze-isnotfrozen"></a>
### isNotFrozen()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is not frozen.

```js
assert(notFrozen).isNotFrozen()
```

should throw an assertion error when the actual value is frozen.

```js
throws(() => assert(frozen).isNotFrozen())
```

<a name="xassert-isinstanceof"></a>
## isInstanceOf()
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when it is instance of a given class.

```js
assert(object).isInstanceOf(Object)
```

should not throw an assertion error when it is not instance of a given class.

```js
throws(() => assert(object).isInstanceOf(Array))
```

<a name="xassert-extensions"></a>
## Extensions
should be able to accept extensions.

```js
const banana = 'I am a banana!'
const apple = 'I am an apple'
const { Assertion } = assert
Assertion.prototype.isABanana = function isABanana () {
  if (this.value !== banana) throw new AssertionError('It not a banana')
  return this
}
assert(banana).isABanana()
throws(() => assert(apple).isABanana())
```

