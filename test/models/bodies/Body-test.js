const assert = require('chai').assert
const Body = require('../../../src/models/bodies/Body')

describe('Body', () => {
  afterEach(() => {
    // clean up all the entries
    while (Body.all.length) {
      const body = Body.all[0]
      body.remove()
    }
    assert.empty(Body.all)
  })

  describe('constructor', () => {
    it('should return a new Body', () => {
      const body = new Body()
      assert.instanceOf(body, Body)
      assert.equal(Body.get(body.id), undefined)
      assert.empty(Body.all)
      assert.isNotTrue(body.active)
    })
  })

  describe('start', () => {
    it('should index a new body', () => {
      const body = new Body()
      body.start()
      assert.equal(Body.get(body.id), body)
      assert.deepEqual(Body.all, [body])
      assert.isTrue(body.active)
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

  describe('destroy', () => {
    it('should destroy a body', () => {
      const body = new Body()
      body.start()
      body.destroy()
      assert.equal(Body.get(body.id), body)
      assert.deepEqual(Body.all, [body])
      assert.isNotTrue(body.active)
    })
  })

  describe('allActive', () => {
    it('should only return the active collection', () => {
      const body = new Body()
      assert.empty(Body.all)
      assert.empty(Body.allActive)
      body.start()
      assert.deepEqual(Body.all, [body])
      assert.deepEqual(Body.allActive, [body])
      body.destroy()
      assert.deepEqual(Body.all, [body])
      assert.empty(Body.allActive)
      body.remove()
      assert.empty(Body.all)
      assert.empty(Body.allActive)
    })
  })

  describe('state', () => {
    it('should return the current state', () => {
      const body = new Body()
      body.start()
      assert.deepEqual(body.state, {})
    })
  })
})
