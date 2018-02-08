
const defaults = {
  height: 10000,
  width: 10000
}

class Viewport {
  constructor (options) {
    Object.assign(this, defaults, options)
  }
}

module.exports = Viewport
