const path = require('path')

const CHAIN = Symbol('htmlcoin.chain')

module.exports = {
  get chain() {
    this[CHAIN] = this[CHAIN] || this.htmlcoininfo.lib.Chain.get(this.config.htmlcoin.chain)
    return this[CHAIN]
  },
  get htmlcoininfo() {
    return {
<<<<<<< HEAD
      lib: _require(path.resolve(this.config.htmlcoininfo.path, 'packages', 'htmlcoininfo-lib')),
      rpc: _require(path.resolve(this.config.htmlcoininfo.path, 'packages', 'htmlcoininfo-rpc')).default
=======
      lib: require(path.resolve(this.config.qtuminfo.path, 'lib')),
      rpc: require(path.resolve(this.config.qtuminfo.path, 'rpc'))
>>>>>>> 94f07a43e7021bb2e2f236da22cec97d6919b88b
    }
  }
}
