const httpErrors = require('http-errors')
const { nanoid } = require('nanoid')

const UserService = require('./user')
const RoleService = require('./role')
const BalanceService = require('./balance')

const {
  mongo: { queries }
} = require('../database')
const {
  article: {
    saveArticle,
    getArticleByID,
    getAllArticles,
    removeArticleByID,
    updateArticleUser
  }
} = queries

class ArticleService {
  #articleId
  #name
  #description
  #price
  #userId

  /**
   * @param {Object} args
   * @param {String} args.articleId
   * @param {String} args.name
   * @param {String} args.description
   * @param {Number} args.price
   * @param {import("mongoose").Schema.Types.ObjectId} args.userId
   */
  constructor(args = {}) {
    const {
      articleId = '',
      name = '',
      description = '',
      price = 1,
      userId = ''
    } = args

    this.#articleId = articleId
    this.#name = name
    this.#description = description
    this.#price = price
    this.#userId = userId
  }

  async verifyArticleExists() {
    if (!this.#articleId)
      throw new httpErrors.BadRequest('Missing required field: articleId')

    const article = await getArticleByID(this.#articleId)

    if (!article) throw new httpErrors.NotFound('Article not found')

    return article
  }

  async saveArticle() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const user = await new UserService({ userId: this.#userId })
    const userExist = await user.verifyUserExists()

    return await saveArticle({
      id: nanoid(),
      name: this.#name,
      price: this.#price,
      description: this.#description,
      userId: userExist._id
    })
  }

  async getArticleByID() {
    if (!this.#articleId)
      throw new httpErrors.BadRequest('Missing required field: articleId')

    const article = await getArticleByID(this.#articleId)

    if (!article) throw new httpErrors.NotFound('Article does not exist')

    return article.articleId
  }

  async getAllArticles() {
    return await getAllArticles()
  }

  async removeArticleByID() {
    if (!this.#articleId)
      throw new httpErrors.BadRequest('Missing required field: articleId')

    const article = await removeArticleByID(this.#articleId)

    if (!article)
      throw new httpErrors.NotFound('The requested article does not exist')

    return article
  }

  async updateOneArticle() {
    if (!this.#articleId)
      throw new httpErrors.BadRequest('Missing required field: articleId')

    return await updateOneArticle({
      id: this.#articleId,
      name: this.#name,
      price: this.#price,
      description: this.#description,
      userId: this.#userId
    })
  }

  async buyArticle() {
    if (!this.#articleId)
      throw new httpErrors.BadRequest('Missing required field: articleId')
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const article = await getArticleByID(this.#articleId)
    if (!article)
      throw new httpErrors.NotFound('The requested article does not exist')
    // const seller = await sellerBalance.verifyUserExists()

    const buyerUser = await new UserService({
      userId: this.#userId
    }).getUserByID()

    const actualBalance = await new BalanceService({
      userId: buyerUser._id
    }).getBalanceByUserID()
    const totalBalance = actualBalance.reduce(
      (total, obj) => obj.balance + total,
      0
    )
    console.log(totalBalance)

    if (totalBalance < article.price)
      throw new httpErrors.BadRequest(
        'Not enough balance to purchase this item, please recharge'
      )

    //  const buyer = await buyerService.verifyUserExists()

    const updateBuyerBalance = new BalanceService({
      userId: buyerUser.id,
      balance: article.price * -1
    }).saveBalance()

    const updateSellerBalance = new BalanceService({
      userId: article.userId.id,
      balance: article.price
    }).saveBalance()

    const updateUser = await this.updateArticleUser()

    return await this.getArticlesByUser()
  }

  async updateArticleUser() {
    const buyerUser = await new UserService({
      userId: this.#userId
    }).getUserByID()

    return await updateArticleUser({
      id: this.#articleId,
      userId: buyerUser._id
    })
  }

  async getArticlesByUser() {
    if (!this.#userId)
      throw new httpErrors.BadRequest('Missing required field: userId')

    const userService = new UserService({ userId: this.#userId })
    const user = await userService.verifyUserExists()

    const articles = await getAllArticles()

    const articlesFiltered = articles.filter(
      article => article.userId.toString() === user._id.toString()
    )

    return articlesFiltered
  }
}

module.exports = ArticleService
