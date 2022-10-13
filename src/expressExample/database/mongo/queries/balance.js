const { BalanceModel } = require('../models')

const saveBalance = async balance => {
  const savedBalance = new BalanceModel(balance)

  await savedBalance.save()

  return savedBalance
}

/**
 * @param {String} id
 * @returns found balance
 */
const getBalanceByUserID = async user => {
  const balances = await BalanceModel.find({ user })

  return balances
}

/**
 * @returns found balances
 */
const getAllBalances = async () => {
  const balances = await BalanceModel.find()

  return balances
}

/**
 * It returns the first balance in the database that matches the query
 * @param {Object} query - The query object that will be used to find the balance.
 * @returns The first balance in the database
 */
const getOneBalance = async (query = {}) => {
  const balances = await BalanceModel.find(query)

  return balances[0]
}

module.exports = {
  saveBalance,
  getBalanceByUserID,
  getAllBalances,
  getOneBalance
}
