const assert = require('chai').assert
const Body = require('../../../src/models/bodies/Body')

describe('Body', () => {
  afterEach(() => {
    // clean up all the entries
    while (Body.all.length) {
      const body = Body.all[0]
      body.remove()
    }
  })

  describe('constructor', () => {
    it('should return a new Body', () => {
      const body = new Body()
      assert.instanceOf(body, Body)
      assert.equal(Body.get(body.id), undefined)
      assert.empty(Body.all)
    })
  })

  describe('start', () => {
    it('should index a new body', () => {
      const body = new Body()
      body.start()
      assert.equal(Body.get(body.id), body)
      assert.deepEqual(Body.all, [body])
    })
  })

  describe('remove', () => {
    it('should remove a body', () => {
      const body = new Body()
      body.start()
      body.remove()
      assert.equal(Body.get(body.id), undefined)
      assert.empty(Body.all)
    })
  })
})
