const Body = require('../Body')
const Spacecraft = require('./Spacecraft')
const {ENERGY, ROTATE, THRUST} = require('../../../constants/floating-objects')

const defaults = {
  type: 'shuttle',
  player: true,
  energy: ENERGY
}

class PlayersSpacecraft extends Spacecraft {
  constructor (options) {
    super(Object.assign({}, defaults, options))
  }

  async tick () {
    const {rotate, thrust, shield, fire} = this.actions || {}
    if (rotate) {
      this.rotate(rotate * ROTATE)
    }
    if (thrust) {
      this.afterBurnerOn().thrust(THRUST)
    } else {
      this.afterBurnerOff()
    }
    this.shield = shield
    if (fire) {
      this.fireBolt()
    }
    await super.tick()
  }

  onKill (victim) {
    // todo
    super.onKill(victim)
  }

  async destroy () {
    if (this.energy) {
      this.energy--
    } else {
      await super.destroy()
      this.energy = ENERGY
    }
    this.collision = false
  }
}

module.exports = PlayersSpacecraft
