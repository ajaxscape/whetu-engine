const assert = require('chai').assert
const engine = require('../index')

let fakePlayer
let fakeState
let fakeRadar
let fakeViewport

describe('engine', () => {
  beforeEach(() => {
    fakeViewport = {
      width: 100000,
      height: 100000
    }
    fakeRadar = {
      width: 10000,
      height: 10000
    }
    fakePlayer = {
      active: true,
      direction: 0,
      energy: 100,
      height: 100,
      id: 'd8b89150-a8f4-456c-be64-f10510625095',
      inView: true,
      klass: 'PlayersSpacecraft',
      maxSpeed: 18,
      orientation: 0,
      parent: '',
      player: true,
      score: 0,
      type: 'shuttle',
      username: 'anon',
      velocity: 0,
      velocityDegradation: 0.997,
      width: 100,
      x: 25681,
      y: 1823
    }

    fakeState = {}

    engine.start()
  })

  describe('join', () => {
    it('should start a new Game', async () => {
      const {id, x, y} = fakePlayer
      const player = await engine.join({id, x, y})
      assert.deepEqual(player, fakePlayer)
    })
  })

  describe('state', () => {
    it('should start a new Game', async () => {
      const {id, x, y} = fakePlayer
      const player = await engine.join({id, x, y})
      const update = await engine.update({id, viewport: fakeViewport, radar: fakeRadar})
      const state = await engine.state()
      assert.deepEqual(state, fakeState)
    })
  })
})