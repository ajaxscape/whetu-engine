const game = require('./src/models/Game')

module.exports = {
  start: (...args) => game.start(...args),
  join: (...args) => game.join(...args),
  update: (...args) => game.update(...args),
  state: async (...args) => await game.getState(...args)
}
