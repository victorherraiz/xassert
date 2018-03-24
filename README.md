# Extensible Assertions

Disclaimer: work in progress, it is not stable for production yet. Any suggestion, defects and features are welcome.

Just another assertion library with interesting features:

* Extensible
* No complex property chains (e.g `is.not.equal`)
* No property terminators (e.g. `is.true`) that could deliver false positives on a typographic error.
* Promises support
* Property assertion chaining

## Chaining

```js
const assert = require('xassert')

assert(obj).hasOwnProperty('a')
  .andIt.hasOwnProperty('b', it => it.isEqualTo('john'))
```

## Simple example

```js
const assert = require('xassert')
const result = getBananaMethod()
assert(result).isEqualTo('banana')
```

## API

### Value assertions

TODO: Include all the API
