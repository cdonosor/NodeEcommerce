const { ArticleModel } = require('../models')
const filter = require('./filter')
const saveArticle = async article => {
  const savedArticle = new ArticleModel(article)

  await savedArticle.save()

  return savedArticle
}

const getArticleByID = async id => {
  const articles = await ArticleModel.find(filter(id)).populate('userId')

  return articles[0]
}

/**
 * @param {String} id
 * @returns found article
 */
const getArticleByUserID = async user => {
  const articles = await ArticleModel.find({ user })

  return articles[0]
}

/**
 * @returns found articles
 */
const getAllArticles = async () => {
  const articles = await ArticleModel.find()

  return articles
}

const removeArticleByID = async id => {
  const article = await ArticleModel.findOneAndRemove(filter(id))

  return article
}

/**
 * It returns the first article in the database that matches the query
 * @param {Object} query - The query object that will be used to find the article.
 * @returns The first article in the database
 */
const getOneArticle = async (query = {}) => {
  const articles = await ArticleModel.find(query)

  return articles[0]
}

const updateArticleUser = async article => {
  console.log(article)
  const { id, userId } = article
  const articleUpdated = await ArticleModel.findOneAndUpdate(
    { id },
    {
      ...(userId && { userId })
    },
    { new: true }
  )

  return articleUpdated
}

module.exports = {
  saveArticle,
  getArticleByID,
  removeArticleByID,
  getArticleByUserID,
  getAllArticles,
  getOneArticle,
  updateArticleUser
}
