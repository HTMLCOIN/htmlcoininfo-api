const path = require('path')
const Redis = require('ioredis')

<<<<<<< HEAD
exports.keys = 'htmlcoininfo-api-mainnet'
=======
const redisConfig = {
  host: 'localhost',
  port: 6379,
  password: '',
  db: 0
}

exports.keys = 'qtuminfo-api'
>>>>>>> 94f07a43e7021bb2e2f236da22cec97d6919b88b

exports.security = {
  csrf: {enable: false}
}

exports.middleware = ['ratelimit']

exports.redis = {
  client: redisConfig
}

exports.ratelimit = {
  db: new Redis(redisConfig),
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total',
  },
  disableHeader: false,
<<<<<<< HEAD
  id: ctx => `htmlcoininfo-api-mainnet-${ctx.get('x-forwarded-for') || ctx.ip}`,
=======
>>>>>>> 94f07a43e7021bb2e2f236da22cec97d6919b88b
  errorMessage: 'Rate Limit Exceeded',
  duration: 10 * 60 * 1000,
  max: 10 * 60
}

exports.io = {
  redis: {
    ...redisConfig,
    key: 'qtuminfo-api-socket.io'
  },
  namespace: {
    '/': {connectionMiddleware: ['connection']}
  }
}

exports.sequelize = {
  dialect: 'mysql',
  database: 'htmlcoin_mainnet',
  host: 'localhost',
  port: 3306,
  username: 'htmlcoin',
  password: ''
}

exports.htmlcoin = {
  chain: 'mainnet'
}

exports.htmlcoininfo = {
  path: path.resolve('..', 'htmlcoininfo'),
  port: 3001,
  rpc: {
    protocol: 'http',
    host: 'localhost',
    port: 3889,
    user: 'user',
    password: 'password'
  }
}

exports.cmcAPIKey = null
