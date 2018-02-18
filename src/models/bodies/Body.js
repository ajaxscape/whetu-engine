const uuid = require('uuid/v4')
const Vector = require('../Vector')
const {MAX_SPEED, BOOST_SCALING} = require('../../constants/floating-objects')
const {HEIGHT, WIDTH} = require('../../constants/viewport')

const bodiesById = {}

function randomInt (max) {
  return Math.floor(Math.random() * max)
}

const defaults = {
  direction: 0,
  orientation: 0,
  velocity: 0,
  maxSpeed: MAX_SPEED
}

class Body {
  constructor (options = {}) {
    Object.assign(this, defaults, {
      x: randomInt(WIDTH),
      y: randomInt(HEIGHT)
    }, options)
    this.id = uuid()
  }

  static get (id) {
    return bodiesById[id]
  }

  static get all () {
    return Object.keys(bodiesById).map((id) => bodiesById[id])
  }

  static get allActive () {
    return Body.all.filter(({active}) => active)
  }

  get state () {
    const {x, y, width, height, id, orientation, shield, afterBurner, collision, energy, score, destroyed, fire, type, parent} = this
    return {x, y, width, height, id, orientation, shield, afterBurner, collision, energy, score, destroyed, fire, type, parent: parent ? parent.type : '', klass: this.constructor.name, inView: true}
  }

  async tick () {
    this.velocity = this.velocity * (this.velocityDegradation || 1) // degrading velocity
    const {direction, velocity} = this
    const drift = Vector.getVector(direction, velocity)
    this.x += drift.x
    this.y -= drift.y
  }

  async inCollisionWith (that) {
    if (this !== that &&
      !this.shield &&
      !that.shield &&
      this !== that.parent &&
      this.parent !== that &&
      (!this.parent || this.parent !== that.parent) &&
      this.detectCollision(that)) {
      if (this.onCollision) {
        await this.onCollision(that)
      }
    }
  }

  async onCollision () {
    this.collision = true
  }

  detectCollision (that) {
    const dx = this.x - that.x
    const dy = this.y - that.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return (distance < (this.width + that.width) / 2)
  }

  rotate (angle) {
    const orientation = (this.orientation + angle) % 360
    this.orientation = orientation < 0 ? orientation + 360 : orientation
    return this
  }

  thrust (boost) {
    const {direction, orientation, maxSpeed} = this
    const thrust = Vector.getVector(orientation, boost * BOOST_SCALING)
    const drift = Vector.getVector(direction, this.velocity)
    const dx = drift.x + thrust.x
    const dy = drift.y + thrust.y
    const velocity = Vector.getLength(dx, dy)
    this.velocity = velocity < maxSpeed ? velocity : maxSpeed
    this.direction = Math.round(Vector.getAngle(dx, dy))
    return this
  }

  angleDifference (angle) {
    return Math.abs(angle - this.orientation)
  }

  async start (options = {}) {
    Object.assign(this, options)
    this.active = true
    bodiesById[this.id] = this
    return this
  }

  async destroy () {
    this.active = false
    return this
  }

  remove () {
    delete bodiesById[this.id]
  }
}

module.exports = Body
