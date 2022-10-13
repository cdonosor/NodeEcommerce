const { Router } = require('express')
const httpErrors = require('http-errors')

const {
  balance: { storeBalanceSchema }
} = require('../../schemas')
const { auth, validatorCompiler } = require('./utils')
const response = require('./response')
const { BalanceService } = require('../../services')

const BalanceRouter = Router()

BalanceRouter.route('/balance/:userId')
  .post(
    validatorCompiler(storeBalanceSchema, 'body'),
    auth.verifyUserRole(),
    async (req, res, next) => {
      try {
        const {
          body: {  balance, roleId },
          params: { userId: userId }
        } = req

        response({
          error: false,
          message: await new BalanceService({
            userId,
            balance
          }).saveBalance(),
          res,
          status: 201
        })
      } catch (error) {
        next(error)
      }
    }
  )

module.exports = BalanceRouter
