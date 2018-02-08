const Body = require('./Body')

const defaults = {
  type: 'typical',
  height: 44,
  width: 44,
  velocity: 1
}

class Meteor extends Body {
  constructor (options) {
    super(Object.assign({}, defaults, options))
  }
}

module.exports = Meteor
