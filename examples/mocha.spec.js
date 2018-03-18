/* eslint-env mocha */
'use strict'

const assert = require('..')

describe('Mocha Examples', function () {
  it('should be a simple example', function () {
    assert(3).isEqualTo(3)
    assert(3).isNotEqualTo(4)
    assert([3, 4]).isDeeplyEqualTo([3, 4])
    assert(null).isNull()
    assert(7).isEqualToAnyOf(4, 7)
  })
})
