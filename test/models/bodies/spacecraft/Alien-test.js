const assert = require('chai').assert
const Vector = require('../../../../src/models/Vector')
const Body = require('../../../../src/models/bodies/Body')
const Alien = require('../../../../src/models/bodies/spacecraft/Alien')
const Player = require('../../../../src/models/bodies/spacecraft/Player')
class Descendant extends Alien {}
const defaultPoint = {x: 100, y: 100}

describe('Alien', () => {
  afterEach(() => {
    // clean up all the entries
    while (Body.all.length) {
      const body = Body.all[0]
      body.remove()
    }
    assert.empty(Body.all)
  })

  describe('constructor', () => {
    it('should return a new Alien', () => {
      const body = new Alien()
      assert.instanceOf(body, Alien)
      assert.notInstanceOf(body, Descendant)
      assert.equal(Alien.get(body.id), undefined)
      assert.empty(Body.all)
      assert.isNotTrue(body.active)
    })

    it('should return a new Descendant', () => {
      const descendant = new Descendant()
      assert.instanceOf(descendant, Alien)
      assert.instanceOf(descendant, Descendant)
      assert.equal(Alien.get(descendant.id), undefined)
      assert.empty(Body.all)
      assert.isNotTrue(descendant.active)
    })
  })

  describe('start', () => {
    it('should index a new spacecraft', () => {
      const body = new Alien()
      body.start()
      assert.equal(Alien.get(body.id), body)
      assert.deepEqual(Body.all, [body])
      assert.isTrue(body.active)
    })
  })

  describe('remove', () => {
    it('should remove a spacecraft', () => {
      const body = new Alien()
      body.start()
      body.remove()
      assert.equal(Alien.get(body.id), undefined)
      assert.empty(Body.all)
    })
  })

  describe('destroy', () => {
    it('should destroy a spacecraft', () => {
      const body = new Alien()
      body.start()
      body.destroy()
      assert.equal(Body.get(body.id), body)
      assert.deepEqual(Body.all, [body])
      // assert.isNotTrue(body.active)
    })
  })

  describe('allActive', () => {
    it('should only return the active collection', () => {
      const body = new Alien()
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
        'energy': 10,
        'height': 100,
        'id': '08a7713b-6d42-403c-940f-6aea67b24e60',
        'inView': true,
        'klass': 'AlienSpacecraft',
        'maxSpeed': 9,
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
      const body = new Alien({id, x, y})
      body.start()
      assert.deepEqual(body.state, expectedState)
    })
  })

  describe('nearest', () => {
    it('should return default nearest', async () => {
      const {x, y} = defaultPoint
      const alienData = {
        id: 'ALIEN_ID',
        x: 200,
        y: 200
      }
      const dx = x - alienData.x
      const dy = y - alienData.y
      const distance = Vector.getLength(dx, dy)
      const angle = Vector.getAngle(dx, -dy)
      const angleDifference = angle
      const body = new Alien(alienData)
      body.start()
      const nearest = await body.nearestPlayer()
      assert.deepEqual(nearest, {distance, angle, angleDifference})
    })
  })

  describe('nearest', () => {
    it('should return only player', async () => {
      const {x, y} = defaultPoint
      const playerData = {
        id: 'PLAYER_ID',
        x,
        y
      }
      const alienData = {
        id: 'ALIEN_ID',
        x: 200,
        y: 200
      }
      const dx = playerData.x - alienData.x
      const dy = playerData.y - alienData.y
      const distance = Vector.getLength(dx, dy)
      const angle = Vector.getAngle(dx, -dy)
      const angleDifference = angle
      const player = new Player(playerData)
      player.start()
      const body = new Alien(alienData)
      body.start()
      const nearest = await body.nearestPlayer()
      assert.deepEqual(nearest, {distance, angle, angleDifference})
    })
  })

  describe('nearest', () => {
    it('should return nearest player', async () => {
      const {x, y} = defaultPoint
      const playerData = {
        id: 'PLAYER_ID',
        x,
        y
      }
      const player2Data = {
        id: 'PLAYER2_ID',
        x: 800,
        y: 800
      }
      const alienData = {
        id: 'ALIEN_ID',
        x: 200,
        y: 200
      }
      const dx = playerData.x - alienData.x
      const dy = playerData.y - alienData.y
      const distance = Vector.getLength(dx, dy)
      const angle = Vector.getAngle(dx, -dy)
      const angleDifference = angle
      const player = new Player(playerData)
      const player2 = new Player(player2Data)
      const body = new Alien(alienData)
      player.start()
      player2.start()
      body.start()
      const nearest = await body.nearestPlayer()
      assert.deepEqual(nearest, {distance, angle, angleDifference})
    })
  })
})
