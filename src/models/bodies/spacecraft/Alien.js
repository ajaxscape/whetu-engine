const Spacecraft = require('./Spacecraft')
const Vector = require('../../Vector')
const {MAX_SPEED, ROTATE, THRUST, AFTERBURNER_MIN_DISTANCE, BOLTS_MAX_DISTANCE, ENERGY} = require('../../../constants/floating-objects')

const defaults = {
  maxSpeed: MAX_SPEED / 2,
  energy: 10
}

class AlienSpacecraft extends Spacecraft {
  constructor (options) {
    super(Object.assign({}, defaults, options))
  }

  async tick () {
    const players = Spacecraft.all
      .filter((body) => body.player)
    if (players.length) {
      const nearest = await Promise.resolve(players.reduce((nearest, player) => {
        const distanceToNearest = Vector.getLength(nearest.x - this.x, nearest.y - this.y)
        const distanceToPlayer = Vector.getLength(player.x - this.x, player.y - this.y)
        if (distanceToPlayer < distanceToNearest) {
          return player
        } else {
          return nearest
        }
      }))
      const targetAngle = await Promise.resolve(Vector.getAngle(nearest.x - this.x, this.y - nearest.y))
      const chance = this.shield ? 100 : 500
      if (!Math.floor(Math.random() * chance)) {
        this.toggleShield()
      }
      let thrust = Math.random() * THRUST / 3
      let rotate = ROTATE
      this.afterBurnerOff()
      const angleDifference = this.angleDifference(targetAngle)
      const distanceToNearest = Vector.getLength(nearest.x - this.x, nearest.y - this.y)
      if (angleDifference > 1) {
        if (angleDifference < ROTATE) {
          rotate = angleDifference
          if (distanceToNearest < BOLTS_MAX_DISTANCE) {
            await this.fireBolt()
          }
        }
        if (targetAngle > this.orientation) {
          this.rotate(rotate)
        } else {
          this.rotate(-rotate)
        }
      }
      if (distanceToNearest > AFTERBURNER_MIN_DISTANCE) {
        this.afterBurnerOn().thrust(thrust)
      }
    }
    await super.tick()
  }
}

module.exports = AlienSpacecraft
