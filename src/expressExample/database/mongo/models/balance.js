const { model, Schema } = require('mongoose')

const BalanceSchema = new Schema(
  {
    
    balance: {
      required: true,
      type: Number
    },
    user: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: {
      transform: (_, ret) => {
        delete ret._id
      }
    },
    /*virtuals: {
      fullName: {
        get() {
          return `${this.name} ${this.lastName}`
        }
      }
    }*/
  }
)

const BalanceModel = model('balances', BalanceSchema)

module.exports = BalanceModel
