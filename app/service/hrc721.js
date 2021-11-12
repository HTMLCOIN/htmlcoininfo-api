const {Service} = require('egg')

class HRC721Service extends Service {
  async listHRC721Tokens() {
    const db = this.ctx.model
    const {sql} = this.ctx.helper
    let {limit, offset} = this.ctx.state.pagination

<<<<<<< HEAD:app/service/hrc721.js
    let result = await db.query(sql`
      SELECT COUNT(DISTINCT(hrc721_token.contract_address)) AS count FROM hrc721_token
      INNER JOIN hrc721 USING (contract_address)
=======
    let [{totalCount}] = await db.query(sql`
      SELECT COUNT(DISTINCT(qrc721_token.contract_address)) AS count FROM qrc721_token
      INNER JOIN qrc721 USING (contract_address)
>>>>>>> 94f07a43e7021bb2e2f236da22cec97d6919b88b:app/service/qrc721.js
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})
    let list = await db.query(sql`
      SELECT
        contract.address_string AS address, contract.address AS addressHex,
        hrc721.name AS name, hrc721.symbol AS symbol, hrc721.total_supply AS totalSupply,
        list.holders AS holders
      FROM (
        SELECT contract_address, COUNT(*) AS holders FROM hrc721_token
        INNER JOIN hrc721 USING (contract_address)
        GROUP BY contract_address
        ORDER BY holders DESC
        LIMIT ${offset}, ${limit}
      ) list
      INNER JOIN hrc721 USING (contract_address)
      INNER JOIN contract ON contract.address = list.contract_address
      ORDER BY holders DESC
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})

    return {
      totalCount,
      tokens: list.map(item => ({
        address: item.addressHex.toString('hex'),
        addressHex: item.addressHex,
        name: item.name.toString(),
        symbol: item.symbol.toString(),
        totalSupply: BigInt(`0x${item.totalSupply.toString('hex')}`),
        holders: item.holders
      }))
    }
  }

  async getAllHRC721Balances(hexAddresses) {
    if (hexAddresses.length === 0) {
      return []
    }
    const db = this.ctx.model
    const {sql} = this.ctx.helper
    let list = await db.query(sql`
      SELECT
        contract.address AS addressHex, contract.address_string AS address,
        hrc721.name AS name,
        hrc721.symbol AS symbol,
        hrc721_token.count AS count
      FROM (
        SELECT contract_address, COUNT(*) AS count FROM hrc721_token
        WHERE holder IN ${hexAddresses}
        GROUP BY contract_address
      ) hrc721_token
      INNER JOIN contract ON contract.address = hrc721_token.contract_address
      INNER JOIN hrc721 ON hrc721.contract_address = hrc721_token.contract_address
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})
    return list.map(item => ({
      address: item.addressHex.toString('hex'),
      addressHex: item.addressHex,
      name: item.name.toString(),
      symbol: item.symbol.toString(),
      count: item.count
    }))
  }
}

module.exports = HRC721Service
