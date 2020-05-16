# ToDo

## Current tasks

* isFulfilledWith
* test that isFulfilled return always the value
* Test messages
* equality in arrays in any order
* review all texts

## Backlog

* isRejectedWith
* mayHaveAProperty
* satisfiesAnyOf
* itDoesNotHaveAnyOtherPropertyApartFrom
* isDeeplyFrozen
* Assertions can be disconnected
* Is satisfies function necessary?
* Every should have a message and capture the exception?
* document fire as protected or public and add example in readme

## Version 2

```js
const obj = { a: { a: 2 }, b: { a: 'a' }, c: 'c' }
const isANumber = assert.fn(it => it.isANumber())
const isAnAProperty = assert.fn(it => a.isObject().hasProperty('a', isANumber))
assert(obj).isObject().hasProperty('a',isAnAProperty)
```
