const Spacecraft = require('./Spacecraft')
const Vector = require('../../Vector')
const {MAX_SPEED, ROTATE, THRUST, AFTERBURNER_MIN_DISTANCE, BOLTS_MAX_DISTANCE} = require('../../../constants/floating-objects')

const defaults = {
  maxSpeed: MAX_SPEED / 2,
  energy: 10
}

const defaultPoint = {
  x: 100,
  y: 100
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
        const distance = Vector.getLength(x - this.x, y - this.y)
        const angle = Vector.getAngle(x - this.x, this.y - y)
        nearest = {distance, angle}
        break
      }
      case 1: {
        const player = players[0]
        const {x, y} = player
        const distance = Vector.getLength(x - this.x, y - this.y)
        const angle = Vector.getAngle(x - this.x, this.y - y)
        nearest = {distance, angle}
        break
      }
      default: {
        nearest = players.reduce((nearest, player) => {
          const {x, y} = player
          const distance = Vector.getLength(x - this.x, y - this.y)
          if (distance < nearest.distance) {
            const angle = Vector.getAngle(x - this.x, this.y - y)
            return {x, y, distance, angle}
          } else {
            const {x, y} = nearest
            const distance = Vector.getLength(x - this.x, y - this.y)
            const angle = Vector.getAngle(x - this.x, this.y - y)
            return {x, y, distance, angle}
          }
        })
        break
      }
    }
    const {distance, angle} = nearest
    const angleDifference = this.angleDifference(angle)
    return {distance, angle, angleDifference}
  }

  async tick () {
    const {distance, angle, angleDifference} = await this.nearestPlayer
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
