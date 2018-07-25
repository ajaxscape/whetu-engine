const Spacecraft = require('./Spacecraft')
const Vector = require('../../Vector')
const {MAX_SPEED, ROTATE, THRUST, AFTERBURNER_MIN_DISTANCE, BOLTS_MAX_DISTANCE} = require('../../../constants/floating-objects')

const defaults = {
  maxSpeed: MAX_SPEED / 2,
  energy: 10
}

const defaultPoint = {
  x: 0,
  y: 0
}

class AlienSpacecraft extends Spacecraft {
  constructor (options) {
    super(Object.assign({}, defaults, options))
  }

  async nearestPlayer () {
    let nearest
    const players = Spacecraft.all.filter((body) => body.player && !body.shield)
    switch (players.length) {
      case 0: {
        const {x, y} = defaultPoint
        const distance = this.distanceTo(defaultPoint)
        nearest = {distance, x, y}
        break
      }
      case 1: {
        const player = players[0]
        const {id, x, y} = player
        const distance = this.distanceTo(player)
        nearest = {id, distance, x, y}
        break
      }
      default: {
        const distances = players.map(({id, x, y}) => {
          const distance = this.distanceTo({x, y})
          return {distance, id, x, y}
        })
        nearest = distances.reduce((nearest, player) => {
          if (player.distance < nearest.distance) {
            return player
          } else {
            return nearest
          }
        })
        break
      }
    }

    const angle = this.directionTo(nearest)
    const {id, distance} = nearest
    const angleDifference = this.angleDifference(angle)
    if (id) {
      return {id, distance, angle, angleDifference}
    }
    return {distance, angle, angleDifference}
  }

  async tick () {
    const {distance, angle, angleDifference} = await this.nearestPlayer()
    const chance = this.shield ? 100 : 500
    if (!Math.floor(Math.random() * chance)) {
      this.toggleShield()
    }
    let thrust = Math.random() * THRUST / 3
    let rotate = ROTATE
    this.afterBurnerOff()
    if (angleDifference > 1) {
      if (angleDifference < ROTATE) {
        rotate = angleDifference
        if (!this.shield && distance < BOLTS_MAX_DISTANCE) {
          await this.fireBolt()
        }
      }
      if (angle > this.orientation) {
        this.rotate(rotate)
      } else {
        this.rotate(-rotate)
      }
    }
    if (distance > AFTERBURNER_MIN_DISTANCE) {
      this.afterBurnerOn().thrust(thrust)
    }
    await super.tick()
  }
}

module.exports = AlienSpacecraft
