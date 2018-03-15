const assert = require('chai').assert
const Body = require('../../../src/models/bodies/Body')

class Descendant extends Body {}

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
      assert.notInstanceOf(body, Descendant)
      assert.equal(Body.get(body.id), undefined)
      assert.empty(Body.all)
      assert.isNotTrue(body.active)
    })

    it('should return a new Descendant', () => {
      const descendant = new Descendant()
      assert.instanceOf(descendant, Body)
      assert.instanceOf(descendant, Descendant)
      assert.equal(Body.get(descendant.id), undefined)
      assert.empty(Body.all)
      assert.isNotTrue(descendant.active)
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
    it('should return the initial state', () => {
      const expectedState = {
        active: true,
        direction: 0,
        id: '08a7713b-6d42-403c-940f-6aea67b24e60',
        inView: true,
        klass: 'Body',
        maxSpeed: 18,
        orientation: 0,
        parent: '',
        velocity: 0,
        x: 14292,
        y: 24492
      }
      const {id, x, y} = expectedState
      const body = new Body({id, x, y})
      body.start()
      assert.deepEqual(body.state, expectedState)
    })
  })

  describe('distanceTo', () => {
    const distances = [4, 8, 16, 32, 64, 128, 256, 512]
    const getPositions = (distances, point = {x: 0, y: 0}) => distances.map((distance) => {
      const dx = (Math.random() * distance)
      const dy = (Math.sqrt(distance * distance - dx * dx))
      return {x: dx + point.x, y: dy + point.y}
    })
    const points = [{x: 100, y: 100}, {x: 10001, y: 2929}, {x: 0.555, y: 10}]
    points.forEach((point, index) => {
        describe(`should return correct distance between ${point.x}, ${point.y} and`, () => {
          const body = new Body(point)
          const points = getPositions(distances, point)
          points.forEach((target, index) => {
            it(`${target.x}, ${target.y} being ${distances[index]}`, () => {
              const distance = Math.round(body.distanceTo(target))
              assert.equal(distance, distances[index])
            })
          })
        })
      }
    )
  })
})
