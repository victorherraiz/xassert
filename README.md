# xassert - Extensible Assertions

[Homepage](https://victorherraiz.github.io/xassert/)

Just another assertion library inspired by [Chai Assertion Library](http://www.chaijs.com/) and
[Java Hamcrest](http://hamcrest.org/) with interesting features:

* Extensible
* No dependencies
* No complex property chains (e.g. `is.not.equal`)
* No property terminators (e.g. `is.true`) that could deliver false positives on a typographic error.
* Promises support
* Property assertion chaining
* Reusable assertions
* Meaningfully error messages (e.g. 'actual value did not match the given regular expression: /^abc$/')

## Install

```sh
npm install xassert --save-dev
# or
npm install xassert
```

## Usage

### A simple example

```js
const assert = require('xassert')
const result = 'banana'
assert(result).isEqualTo('banana')
```

### Chaining

```js
const assert = require('xassert')

assert(obj)
  .hasOwnProperty('id', it => it.matches(/[a-z0-9]{9}/)).andIt
  .hasOwnProperty('name', it => it.isEqualTo('john'))
```

## Extensible

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

## Reusable assertions

```js
    const assert = require('xassert')
    // Reusable assertions on properties
    // Note that `assert.fn` is only a helper function for auto-completion in some IDE
    const isANumber = assert.fn(it => it.isANumber())
    const areNumbers = assert.fn(it => it.every(isANumber))
    const isString = assert.fn(it => it.isAString())
    const areStrings = assert.fn(it => it.every(isString))

    // Assertion on "things"
    const things = { colors: ['red', 'blue', 'yellow'], numbers: [1, 2] }
    assert(things)
      .named('things')
      .hasOwnProperty('numbers', areNumbers)
      .hasOwnProperty('colors', areStrings)

    // Even the whole assertion
    const areThings = assert.fn(it => it.named('things')
      .hasOwnProperty('numbers', areNumbers)
      .hasOwnProperty('colors', areStrings))

    areThings(assert(things))
````
