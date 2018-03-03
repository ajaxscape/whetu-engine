const Body = require('../Body')
const {MAX_BOLT_DURATION, MAX_SPEED} = require('../../../constants/floating-objects')

const defaults = {
  type: 'typical',
  height: 12,
  width: 2
}

class Bolt extends Body {
  constructor (options) {
    super(Object.assign({}, defaults, options))
    this.created = Date.now()
  }

  async start (options = {}) {
    await super.start(options)
    this.thrust(MAX_SPEED * 20)
    this.timer = setTimeout(() => this.destroy(), MAX_BOLT_DURATION)
    return this
  }

  async onCollision (other) {
    if (!(other instanceof Bolt)) {
      this.collision = other
      await this.destroy()
    }
  }

  async destroy () {
    clearTimeout(this.timer)
    if (this.collision) {
      this.parent.onKill(this.collision)
      this.collision = false
    }
    await super.destroy()
  }
}

module.exports = Bolt
