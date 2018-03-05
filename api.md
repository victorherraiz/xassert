
> xassert@0.1.0 test /Users/viktor/Development/xassert
> mocha index.spec.js "--reporter=markdown"

# TOC
   - [xassert](#xassert)
     - [isEqualTo(expected: any): this](#xassert-isequaltoexpected-any-this)
     - [isNotEqualTo(expected: any): this](#xassert-isnotequaltoexpected-any-this)
     - [isEqualToAnyOf(...any): this](#xassert-isequaltoanyofany-this)
     - [isNotEqualToAnyOf(...any): this](#xassert-isnotequaltoanyofany-this)
<a name=""></a>
 
<a name="xassert"></a>
# xassert
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
## isEqualToAnyOf(...any): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is strictly equal (i.e. ===) to any of expected.

```js
assert(4).isEqualToAnyOf(3, 4)
```

should throw an assertion error when the actual value is not strictly equal (i.e. ===) to any of expected.

```js
throws(() => assert(4).isEqualToAnyOf(5, 6))
throws(() => assert(4).isEqualToAnyOf('4'))
throws(() => assert({ a: 1 }).isEqualToAnyOf({ a: 1 }))
throws(() => assert([1]).isEqualToAnyOf([1]))
```

<a name="xassert-isnotequaltoanyofany-this"></a>
## isNotEqualToAnyOf(...any): this
should be chainable.

```js
assert(fn()).isInstanceOf(Assertion)
```

should not throw an assertion error when the actual value is strictly not equal (i.e. !==) to any of expected.

```js
assert(4).isNotEqualToAnyOf(3, 6)
assert(4).isNotEqualToAnyOf('4')
```

should throw an assertion error when the actual value is not strictly not equal (i.e. !==) to any of expected.

```js
const obj = { a: 1 }
throws(() => assert(true).isNotEqualToAnyOf(true))
throws(() => assert(obj).isNotEqualToAnyOf(null, obj))
```

