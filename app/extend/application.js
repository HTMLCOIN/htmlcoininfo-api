const path = require('path')

const CHAIN = Symbol('htmlcoin.chain')

module.exports = {
  get chain() {
    this[CHAIN] = this[CHAIN] || this.htmlcoininfo.lib.Chain.get(this.config.htmlcoin.chain)
    return this[CHAIN]
  },
  get htmlcoininfo() {
    return {
      lib: require(path.resolve(this.config.htmlcoininfo.path, 'lib')),
      rpc: require(path.resolve(this.config.htmlcoininfo.path, 'rpc'))
    }
  }
}
