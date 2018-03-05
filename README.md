# Extensible Assertions

Disclaimer: work in progress, it is not stable for production yet. Any suggestion, defect and features are welcome.

Just another assertion library with some interesting features:

* Extensible
* No property chains (e.g `is.not.equal`)
* No property terminators (e.g. `is.true`) that could deliver false positives on a typographic error.
* Promises support
* Property assertion chaining:

```js
assert(obj).hasOwnProperty('a')
  .andIt.hasOwnProperty('b', it => it.isEqualTo('john'))
```

## Simple example

```js
const assert = require('xassert');
assert('banana').isEqualTo('banana');

```

## API

TODO: Include all the API
