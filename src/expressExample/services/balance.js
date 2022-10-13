const httpErrors = require('http-errors')
const { nanoid } = require('nanoid')

const UserService = require('./user')
const RoleService = require('./role')

const {
  mongo: { queries }
} = require('../database')
const {
  hash: { hashString }
} = require('../utils')
const {
  balance: { getBalanceByUserID, saveBalance, getAllBalances }
} = queries

class BalanceService {
  #userId
  #balance

  constructor(args = {}) {
    const { userId = '', balance = '' } = args

    this.#userId = userId
    this.#balance = balance
  }

  async saveBalance() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId ACAA')

    if (!this.#balance)
      throw new httpErrors.BadRequest('Missing required field: balance')

    const user = await new UserService({ userId: this.#userId })
    const userExist = await user.verifyUserExists()

    /* const role = await new RoleService({id: '3'})

    const clientRole = await role.getRoleByID()

  

    if(String(userExist.role) !== String(clientRole._id)) 
      throw new httpErrors.BadRequest('User is not a client')
    */
    // const userRole = await user.verifyUserRole()

    await saveBalance({
      id: nanoid(),
      user: userExist._id,
      balance: this.#balance
    })

    return await getAllBalances()
  }

  async getBalanceByUserID() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const balance = await getBalanceByUserID(this.#userId)

    if (!balance)
      throw new httpErrors.NotFound('The requested balance does not exists')

    return balance
  }

  async getAllBalances() {
    return await getAllBalances()
  }
}

module.exports = BalanceService
