const path = require('path')
const Redis = require('ioredis')

const redisConfig = {
  host: 'localhost',
  port: 6379,
  password: '',
  db: 0
}

exports.keys = 'htmlcoininfo-api'

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
  errorMessage: 'Rate Limit Exceeded',
  duration: 10 * 60 * 1000,
  max: 10 * 60
}

exports.io = {
  redis: {
    ...redisConfig,
    key: 'htmlcoininfo-api-socket.io'
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
    port: 4889,
    user: 'user',
    password: 'password'
  }
}

exports.cmcAPIKey = null
