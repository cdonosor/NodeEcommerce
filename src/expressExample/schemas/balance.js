const { Type } = require('@sinclair/typebox')

const storeBalanceSchema = Type.Object({
  balance: Type.Integer()
})

const updateBalanceSchema = Type.Partial(storeBalanceSchema)

const BalanceIDSchema = Type.Object({
  id: Type.String({ minLength: 21, maxLength: 21 })
})


module.exports = {
  storeBalanceSchema,
  updateBalanceSchema,
  BalanceIDSchema
}
