# xassert - Extensible Assertions

[Homepage](https://victorherraiz.github.io/xassert/)

Just another assertion library inspired by [Chai Assertion Library](http://www.chaijs.com/) and
[Java Hamcrest](http://hamcrest.org/) with interesting features:

* Extensible
* No complex property chains (e.g `is.not.equal`)
* No property terminators (e.g. `is.true`) that could deliver false positives on a typographic error.
* Promises support
* Property assertion chaining

## Install

```sh
npm install xassert --save-dev
# or
npm install xassert
```

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

## How to extend

```js
// CommonJS
const assert = require('xassert')
const { Assertion, AssertionError } = assert
// Or
import assert, { Assertion, AssertionError } from xassert

const banana = 'I am a banana!'
const apple = 'I am an apple'
// Add a new method
Assertion.prototype.isABanana = function isABanana () {
  if (this.actual !== banana) throw this.fire('{name} is not a banana', banana)
  return this
}

assert(banana).isABanana()
assert(() => assert(apple).isABanana()).throwsAn(AssertionError)
```
