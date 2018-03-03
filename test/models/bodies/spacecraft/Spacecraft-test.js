const assert = require('chai').assert
const Body = require('../../../../src/models/bodies/Body')
const Spacecraft = require('../../../../src/models/bodies/spacecraft/Spacecraft')
class Descendant extends Spacecraft {}

describe('Spacecraft', () => {
  afterEach(() => {
    // clean up all the entries
    while (Body.all.length) {
      const body = Body.all[0]
      body.remove()
    }
    assert.empty(Body.all)
  })

  describe('constructor', () => {
    it('should return a new Spacecraft', () => {
      const body = new Spacecraft()
      assert.instanceOf(body, Spacecraft)
      assert.notInstanceOf(body, Descendant)
      assert.equal(Spacecraft.get(body.id), undefined)
      assert.empty(Body.all)
      assert.isNotTrue(body.active)
    })

    it('should return a new Descendant', () => {
      const descendant = new Descendant()
      assert.instanceOf(descendant, Spacecraft)
      assert.instanceOf(descendant, Descendant)
      assert.equal(Spacecraft.get(descendant.id), undefined)
      assert.empty(Body.all)
      assert.isNotTrue(descendant.active)
    })
  })

  describe('start', () => {
    it('should index a new spacecraft', () => {
      const body = new Spacecraft()
      body.start()
      assert.equal(Spacecraft.get(body.id), body)
      assert.deepEqual(Body.all, [body])
      assert.isTrue(body.active)
    })
  })

  describe('remove', () => {
    it('should remove a spacecraft', () => {
      const body = new Spacecraft()
      body.start()
      body.remove()
      assert.equal(Spacecraft.get(body.id), undefined)
      assert.empty(Body.all)
    })
  })

  describe('destroy', () => {
    it('should destroy a spacecraft', () => {
      const body = new Spacecraft()
      body.start()
      body.destroy()
      assert.equal(Body.get(body.id), body)
      assert.deepEqual(Body.all, [body])
      // assert.isNotTrue(body.active)
    })
  })

  describe('allActive', () => {
    it('should only return the active collection', () => {
      const body = new Spacecraft()
      assert.empty(Body.all)
      assert.empty(Body.allActive)
      body.start()
      assert.deepEqual(Body.all, [body])
      assert.deepEqual(Body.allActive, [body])
      body.destroy()
      assert.deepEqual(Body.all, [body])
      // assert.empty(Body.allActive)
      body.remove()
      assert.empty(Body.all)
      assert.empty(Body.allActive)
    })
  })

  describe('state', () => {
    it('should return the initial state', () => {
      const expectedState = {
        'active': true,
        'direction': 0,
        'height': 100,
        'id': '08a7713b-6d42-403c-940f-6aea67b24e60',
        'inView': true,
        'klass': 'Spacecraft',
        'maxSpeed': 18,
        'orientation': 0,
        'parent': '',
        'score': 0,
        'type': 'typical',
        'velocity': 0,
        'velocityDegradation': 0.997,
        'width': 100,
        'x': 14292,
        'y': 24492
      }
      const {id, x, y} = expectedState
      const body = new Spacecraft({id, x, y})
      body.start()
      assert.deepEqual(body.state, expectedState)
    })
  })
})
