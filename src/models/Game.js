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

  start (gameData = {}) {
    this.gameData = gameData
    this._ticker = setInterval(async () => {
      await this.tick()
    }, gameData.tickInterval || TICK_INTERVAL)
  }

  addAlien () {
    const {alienTypes = ['spooky', 'creepy', 'ghostly', 'eerie']} = this
    const type = alienTypes[Body.all.length % alienTypes.length]
    const alien = new AlienSpacecraft({type})
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
    return body.x + offsetX > 0 && body.x + offsetX < width && body.y + offsetY > 0 && body.y + offsetY < height
  }

  async getState (playerId, viewport = {width: 1000, height: 1000}, radar = {width: 100000, height: 100000}) {
    const data = await Promise.all(Body.all.map(async (body) => {
      if (this.within(playerId, body, radar)) {
        if (!this.within(playerId, body, viewport)) {
          const {id, type, klass, x, y} = body.state
          return {id, type, klass, x, y}
        } else {
          return body.state
        }
      }
    }))
    return data
      .filter((state) => state)
  }
}

module.exports = new Game()
