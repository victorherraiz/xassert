/* eslint-env mocha */
'use strict'

const assert = require('..')

describe('Mocha Examples', function () {
  it('should allow simple assertions', function () {
    assert(3).isEqualTo(3)
    assert(3).isANumber().andIt.isNotEqualTo(4)
    assert([3, 4]).isDeeplyEqualTo([3, 4])
    assert(7).isEqualToAnyOf([4, 7])
    assert({ a: 2, b: [3, 6] })
      .hasProperty('a', it => it.isANumber())
      .hasProperty('b', it => it.isAnArray().every(it => it.isANumber()))
  })

  it('should allow to define reusable assertion with IDE auto-completion', function () {
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
  })
  context('promises', function () {
    const promise = Promise.resolve([{ a: 3 }, { a: 6 }])
    it('should allow promise assertions with reusable assertions', function () {
      return assert(promise).isFulfilled(
        it => it.every(
          it => it.hasProperty('a',
            it => it.isAtLeast(2).andIt.isAtMost(10))))
    })
    // or
    it('should allow promise assertions with reusable assertions', function () {
      const isValidA = assert.fn(it => it.isAtLeast(2).andIt.isAtMost(10))
      const isAThing = assert.fn(it => it.hasProperty('a', isValidA))
      const areArrayOfThings = assert.fn(it => it.every(isAThing))
      return assert(promise).isFulfilled(areArrayOfThings)
    })
  })
})
