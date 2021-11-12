const {Controller} = require('egg')

class HRC721Controller extends Controller {
  async list() {
    const {ctx} = this
    let {totalCount, tokens} = await ctx.service.hrc721.listHRC721Tokens()
    ctx.body = {
      totalCount,
      tokens: tokens.map(item => ({
        address: item.addressHex.toString('hex'),
        addressHex: item.addressHex.toString('hex'),
        name: item.name,
        symbol: item.symbol,
        totalSupply: item.totalSupply.toString(),
        holders: item.holders
      }))
    }
  }
}

module.exports = HRC721Controller
