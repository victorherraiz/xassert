# eXtensible Assertions for NodeJS

Disclamer: work in progress, it is not estable for production yet. Any suggestion, defect and features are very welcome.

Just another assertion library with some interesting features:

* Extensible
* No property chains (e.g `is.not.equal`)
* No property terminators (e.g. `is.true`) that could deliver false possives on a typographic error.
* Promises support
* Property assertion chaining:

```
Assert.that(obj)
	.hasOwnProperty("a", it => it.above(3))
	.hasOwnProperty("b", it => it.isANumber())
```


## Simple example


```
const Assert = require("xassert");

Assert.that("banana").equals("banana");

```

## API

### Assert.that(any) : Assertion

### Assertion.prototype.equals(any) : Assertion

The value must be strictly equal (e.i. `===`) to the argument


```
Assert.that("banana").equals("banana"); // OK
Assert.that("banana").equals("apple"); // Throws AssertionError
```

### Assertion.prototype.notEquals(any) : Assertion

The value must be strictly not equal (e.i. `!==`) to the argument


```
Assert.that("banana").equals("apple"); // OK
Assert.that("banana").equals("banana"); // Throws AssertionError
```

TODO: Include all the API
