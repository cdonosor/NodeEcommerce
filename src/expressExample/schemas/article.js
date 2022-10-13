const { Type } = require('@sinclair/typebox')

const storeArticleSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  description: Type.String({ minLength: 2 }),
  price: Type.Number()
})

const updateArticleSchema = Type.Partial(storeArticleSchema)

const ArticleIDSchema = Type.Object({
  id: Type.String({ minLength: 21, maxLength: 21 })
})

module.exports = {
  storeArticleSchema,
  updateArticleSchema,
  ArticleIDSchema
}
