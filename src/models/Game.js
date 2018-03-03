const Body = require('./bodies/Body')
const AlienSpacecraft = require('./bodies/spacecraft/Alien')
const PlayersSpacecraft = require('./bodies/spacecraft/Player')
const Meteor = require('./bodies/Meteor')
const {MAX_REMOTE_ALIENS, TICK_INTERVAL} = require('../constants/floating-objects')

const defaults = {}

function repeat (count, fn) {
  for (let index = 0; index < count; index++) {
    setTimeout(fn)
  }
}

class Game {
  constructor (options) {
    Object.assign(this, defaults, options)
    // repeat(MAX_METEORS, () => this.addMeteor())
    repeat(MAX_REMOTE_ALIENS, () => this.addAlien())
  }

  async tick () {
    await Promise.all(Body.allActive
      .map((body) => body.tick())
    )

    await Promise.all(Body.all
      .filter(async (body) => !body.collision)
      .map(async (body) => Promise.all(Body.all
        .map(async (other) => Promise.resolve(other.inCollisionWith(body)))))
    )

    // remove inactive objects
    Body.all
      .filter(({active}) => !active)
      .forEach((body) => body.remove())
  }

  start (tickInterval) {
    this._ticker = setInterval(async () => {
      await this.tick()
    }, tickInterval || TICK_INTERVAL)
  }

  addAlien () {
    const alien = new AlienSpacecraft({
      type: Body.all.length % 2 ? 'typical' : 'spooky'
    })
    alien.start()
  }

  addMeteor () {
    const meteor = new Meteor({})
    meteor.start()
  }

  join (user = {username: 'anon'}) {
    const player = new PlayersSpacecraft()
    player.start()
    return player.state
  }

  update ({id, actions}) {
    const player = Body.get(id)
    if (player) {
      player.actions = actions
      return player
    }
  }

  within (id, body, viewport) {
    const {x = 0, y = 0} = Body.get(id)
    const {width, height} = viewport
    const offsetX = (width / 2) - x
    const offsetY = (height / 2) - y
    const isInView = body.x + offsetX > 0 && body.x + offsetX < width && body.y + offsetY > 0 && body.y + offsetY < height
    return isInView
  }

  async getState (playerId, viewport = {width: 1000, height: 1000}, radar = {width: 100000, height: 100000}) {
    const data = await Promise.all(Body.all.map(async (body) => {
      const {id, x, y, type, klass} = body.state
      let state
      if (this.within(playerId, body, radar)) {
        if (!this.within(playerId, body, viewport)) {
          state = {id, x, y, type, klass}
        }
        state = body.state
      }
      return state
    }))
    return data
      .filter((state) => state)
      .map((state) => Object.assign(state, {x: Math.round(state.x), y: Math.round(state.y)}))
  }
}

module.exports = new Game()
