module.exports = app => {
  const {INTEGER, CHAR} = app.Sequelize

  let HRC20Statistics = app.model.define('hrc20_statistics', {
    contractAddress: {
      type: CHAR(20).BINARY,
      primaryKey: true
    },
    holders: INTEGER.UNSIGNED,
    transactions: INTEGER.UNSIGNED
  }, {freezeTableName: true, underscored: true, timestamps: false})

  HRC20Statistics.associate = () => {
    const {Hrc20: HRC20} = app.model
    HRC20Statistics.belongsTo(HRC20, {as: 'hrc20', foreignKey: 'contractAddress'})
    HRC20.hasOne(HRC20Statistics, {as: 'statistics', foreignKey: 'contractAddress'})
  }

  return HRC20Statistics
}
