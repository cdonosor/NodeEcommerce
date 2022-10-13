const { model, Schema } = require('mongoose')

const ArticleSchema = new Schema(
  {
    id: {
      required: true,
      type: String,
      unique: true
    },
    name: {
      required: true,
      type: String
    },
    description: {
      required: true,
      type: String
    },
    price: {
      required: true,
      type: Number
    },
    userId: {
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

const ArticleModel = model('articles', ArticleSchema)

module.exports = ArticleModel
