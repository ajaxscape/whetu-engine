const Vector = require('../../Vector')
const {HEIGHT, WIDTH} = require('../../../constants/viewport')
const Body = require('../Body')
const Bolt = require('../ballistics/Bolt')
const {DELAY_BETWEEN_BOLTS, MAX_BOLT_DURATION, VELOCITY_DEGREDATION} = require('../../../constants/floating-objects')

const defaults = {
  type: 'typical',
  velocityDegradation: VELOCITY_DEGREDATION,
  height: 100,
  width: 100,
  score: 0
}

function randomInt (max) {
  return Math.floor(Math.random() * max)
}

class Spacecraft extends Body {
  constructor (options) {
    super(Object.assign({}, defaults, options))
  }

  async tick (...args) {
    await super.tick(...args)
    if (this.collision && !this.destroyed) {
      if (this.shield) {
      } else {
        await this.destroy()
      }
      this.collision = false
    }
  }

  render () {
    super.render()
    return this
  }

  afterBurnerOn () {
    this.afterBurner = true
    return this
  }

  afterBurnerOff () {
    this.afterBurner = false
    return this
  }

  toggleShield () {
    this.shield = !this.shield
    return this
  }

  async fireBolt () {
    // ToDo Think this through
    if (!this.shield && (!this.lastBolt || this.lastBolt < Date.now() - DELAY_BETWEEN_BOLTS)) {
      this.lastBolt = Date.now()
      const {x, y, velocity, direction, orientation} = this
      const origin = Vector.getVector(orientation, (this.width + this.maxSpeed) / 2)
      const bolt = new Bolt({parent: this})
      await bolt.start({origin: this, x: x + origin.x, y: y - origin.y, velocity, direction, orientation})
      setTimeout(async () => bolt.destroy(), MAX_BOLT_DURATION)
    }
    return this
  }

  onKill (victim) {
    // todo
    if (!(victim && (victim.destroyed || victim.shield))) {
      this.score += 1
    }
  }

  async destroy () {
    this.destroyed = true
    setTimeout(() => {
      this.x = randomInt(WIDTH / 2)
      this.y = randomInt(HEIGHT / 2)
      this.collision = false
      this.destroyed = false
    }, 500)
    return this
  }
}

module.exports = Spacecraft
