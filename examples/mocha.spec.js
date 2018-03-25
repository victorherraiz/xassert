/* eslint-env mocha */
'use strict'

const assert = require('..')

describe('Mocha Examples', function () {
  it('should be a simple example', function () {
    assert(3).isEqualTo(3)
    assert(3).isANumber().andIt.isNotEqualTo(4)
    assert([3, 4]).isDeeplyEqualTo([3, 4])
    assert(7).isEqualToAnyOf([4, 7])
  })

  it('should be a more complex example', function () {
    // Reusable assertions on properties
    const isANumber = it => it.isANumber()
    const areNumbers = it => it.every(isANumber)
    const isString = it => it.isAString()
    const areStrings = it => it.every(isString)

    // Assertion on "things"
    const things = { colors: ['red', 'blue', 'yellow'], numbers: [1, 2] }
    assert(things)
      .named('things')
      .hasOwnProperty('numbers', areNumbers)
      .hasOwnProperty('colors', areStrings)
  })
})
