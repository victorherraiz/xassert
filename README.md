# xassert - Extensible Assertions

[Homepage](https://victorherraiz.github.io/xassert/)

Just another assertion library with interesting features

* Extensible
* No complex property chains (e.g `is.not.equal`)
* No property terminators (e.g. `is.true`) that could deliver false positives on a typographic error.
* Promises support
* Property assertion chaining

## Simple example

```js
const assert = require('xassert')
const result = 'banana'
assert(result).isEqualTo('banana')
```

## Chaining

```js
const assert = require('xassert')

assert(obj)
  .hasOwnProperty('a').andIt
  .hasOwnProperty('b', it => it.isEqualTo('john'))
```

## Extensible

```js
// CommonJS
const assert = require('xassert')
const { Assertion, AssertionError } = assert
// Or
import assert, { Assertion, AssertionError } from xassert

// Add a new method
Assertion.prototype.isABanana = function isABanana () {
  if (this.ref !== banana) throw new AssertionError('It not a banana')
  return this
}
const banana = 'I am a banana!'
const apple = 'I am an apple'
assert(banana).isABanana()
assert(() => assert(apple).isABanana()).throwsAn(AssertionError)
```
