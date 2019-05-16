const {Controller} = require('egg')

class ContractController extends Controller {
  async summary() {
    const {ctx} = this
    let summary = await ctx.service.contract.getContractSummary(
      ctx.state.contract.contractAddress, ctx.state.contract.addressIds
    )
    ctx.body = {
      address: summary.address,
      addressHex: summary.addressHex.toString('hex'),
      vm: summary.vm,
      type: summary.type,
      owner: summary.owner,
      createTxId: summary.createTxId && summary.createTxId.toString('hex'),
      createHeight: summary.createHeight,
      ...summary.type === 'hrc20' ? {
        hrc20: {
          name: summary.hrc20.name,
          symbol: summary.hrc20.symbol,
          decimals: summary.hrc20.decimals,
          totalSupply: summary.hrc20.totalSupply.toString(),
          version: summary.hrc20.version,
          holders: summary.hrc20.holders
        }
      } : {},
      ...summary.type === 'hrc721' ? {
        hrc721: {
          name: summary.hrc721.name,
          symbol: summary.hrc721.symbol,
          totalSupply: summary.hrc721.totalSupply.toString()
        }
      } : {},
      balance: summary.balance.toString(),
      totalReceived: summary.totalReceived.toString(),
      totalSent: summary.totalSent.toString(),
      unconfirmed: summary.unconfirmed.toString(),
      hrc20Balances: summary.hrc20Balances.map(item => ({
        address: item.address,
        addressHex: item.addressHex.toString('hex'),
        name: item.name,
        symbol: item.symbol,
        decimals: item.decimals,
        balance: item.balance.toString()
      })),
      hrc721Balances: summary.hrc721Balances.map(item => ({
        address: item.address,
        addressHex: item.addressHex.toString('hex'),
        name: item.name,
        symbol: item.symbol,
        count: item.count
      })),
      transactionCount: summary.transactionCount
    }
  }

  async transactions() {
    let {ctx} = this
    let {totalCount, transactions} = await ctx.service.contract.getContractTransactions(
      ctx.state.contract.contractAddress, ctx.state.contract.addressIds
    )
    ctx.body = {
      totalCount,
      transactions: transactions.map(id => id.toString('hex'))
    }
  }

  async balanceHistory() {
    let {ctx} = this
    let {totalCount, transactions} = await ctx.service.balance.getBalanceHistory(ctx.state.contract.addressIds, {nonZero: true})
    ctx.body = {
      totalCount,
      transactions: transactions.map(tx => ({
        id: tx.id.toString('hex'),
        ...tx.block ? {
          blockHash: tx.block.hash.toString('hex'),
          blockHeight: tx.block.height,
          timestamp: tx.block.timestamp
        } : {},
        amount: tx.amount.toString(),
        balance: tx.balance.toString()
      }))
    }
  }

  async hrc20BalanceHistory() {
    let {ctx} = this
    let {totalCount, transactions} = await ctx.service.hrc20.getHRC20BalanceHistory([ctx.state.contract.contractAddress], null)
    ctx.body = {
      totalCount,
      transactions: transactions.map(tx => ({
        id: tx.id.toString('hex'),
        hash: tx.block.hash.toString('hex'),
        height: tx.block.height,
        timestamp: tx.block.timestamp,
        tokens: tx.tokens.map(item => ({
          address: item.address,
          addressHex: item.addressHex.toString('hex'),
          name: item.name,
          symbol: item.symbol,
          decimals: item.decimals,
          amount: item.amount.toString(),
          balance: item.balance.toString()
        }))
      }))
    }
  }

  async callContract() {
    let {ctx} = this
    let data = ctx.query.data
    ctx.assert(ctx.state.contract.vm === 'evm', 400)
    ctx.assert(/^([0-9a-f]{2})+$/i.test(data), 400)
    ctx.body = await ctx.service.contract.callContract(ctx.state.contract.contractAddress, data)
  }

  async searchLogs() {
    let {ctx} = this
    let {fromBlock, toBlock, contract, topic1, topic2, topic3, topic4} = this.ctx.query
    if (fromBlock != null) {
      if (/^(0|[1-9]\d{0,9})$/.test(fromBlock)) {
        fromBlock = Number.parseInt(fromBlock)
      } else {
        ctx.throw(400)
      }
    }
    if (toBlock != null) {
      if (/^(0|[1-9]\d{0,9})$/.test(toBlock)) {
        toBlock = Number.parseInt(toBlock)
      } else {
        ctx.throw(400)
      }
    }
    if (contract != null) {
      contract = (await ctx.service.contract.getContractAddresses([contract]))[0]
    }
    if (topic1 != null) {
      if (/^[0-9a-f]{64}$/i.test(topic1)) {
        topic1 = Buffer.from(topic1, 'hex')
      } else {
        ctx.throw(400)
      }
    }
    if (topic2 != null) {
      if (/^[0-9a-f]{64}$/i.test(topic2)) {
        topic2 = Buffer.from(topic2, 'hex')
      } else {
        ctx.throw(400)
      }
    }
    if (topic3 != null) {
      if (/^[0-9a-f]{64}$/i.test(topic3)) {
        topic3 = Buffer.from(topic3, 'hex')
      } else {
        ctx.throw(400)
      }
    }
    if (topic4 != null) {
      if (/^[0-9a-f]{64}$/i.test(topic4)) {
        topic4 = Buffer.from(topic4, 'hex')
      } else {
        ctx.throw(400)
      }
    }

    let {totalCount, logs} = await ctx.service.contract.searchLogs({fromBlock, toBlock, contract, topic1, topic2, topic3, topic4})
    ctx.body = {
      totalCount,
      logs: logs.map(log => ({
        blockHash: log.blockHash.toString('hex'),
        blockHeight: log.blockHeight,
        timestamp: log.timestamp,
        transactionId: log.transactionId.toString('hex'),
        contractAddress: log.contractAddress,
        contractAddressHex: log.contractAddressHex.toString('hex'),
        address: log.address,
        addressHex: log.addressHex.toString('hex'),
        topic1: log.topic1 && log.topic1.toString('hex'),
        topic2: log.topic2 && log.topic2.toString('hex'),
        topic3: log.topic3 && log.topic3.toString('hex'),
        topic4: log.topic4 && log.topic4.toString('hex'),
        data: log.data.toString('hex')
      }))
    }
  }
}

module.exports = ContractController
