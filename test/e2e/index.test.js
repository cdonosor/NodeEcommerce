const axios = require('axios')
const { faker } = require('@faker-js/faker')
const { server } = require('../../src/expressExample/network')

const URL = `http://localhost:${process.env.PORT || 2000}`

beforeAll(async () => {
  await server.start()
})

afterAll(async () => {
  await server.stop()
})

describe('API: GET /', () => {
  let response = {}

  test('Should return 200 as status code', async () => {
    response = await axios.get(URL)
    expect(response.status).toBe(200)
  })

  test('Should be a successful operation', () => {
    expect(response.data.error).toBe(false)
  })
})

describe('E2E test: Use cases from UserService', () => {
  const buyerName = faker.name.firstName()
  const buyerLastName = faker.name.lastName()
  const buyerEmail = faker.internet.email(buyerName, buyerLastName).toLowerCase()
  const buyerPassword = faker.datatype.string()
  const buyerRole = '3'
  const newUserBuyer = {
    name: buyerName,
    lastName: buyerLastName,
    email: buyerEmail,
    password: buyerPassword,
    role: buyerRole
  }

  const sellerName = faker.name.firstName()
  const sellerLastName = faker.name.lastName()
  const sellerEmail = faker.internet.email(sellerName, sellerLastName).toLowerCase()
  const sellerPassword = faker.datatype.string()
  const sellerRole = '4'
  const newUserSeller = {
    name: sellerName,
    lastName: sellerLastName,
    email: sellerEmail,
    password: sellerPassword,
    role: sellerRole
  }

  const tokensBuyer = {
    accessToken: '',
    refreshToken: ''
  }


  const tokensSeller = {
    accessToken: '',
    refreshToken: ''
  }

  
  let idBuyer = ''
  let _idBuyer = ''
  const newBalance = 10000

  let idSeller = ''
  let _idSeller = ''

  let idProduct = ''
  

  describe('Testing save user with buyer role', () => {
    let response = {}

    test('Should return 201 as status code and asign user id', async () => {
      response = await axios.post(`${URL}/api/user/signup`, newUserBuyer)
      expect(response.status).toBe(201)
      idBuyer = response.data.message.id
      _idBuyer = response.data.message._id
    })
  })

  describe('Testing login as buyer lclient', () => {
    const keys = ['accessToken', 'refreshToken']

    test('Should return accessToken and refreshToken', async () => {
      const {
        data: { message }
      } = await axios.post(`${URL}/api/user/login`, {
        email: newUserBuyer.email,
        password: newUserBuyer.password
      })

      expect(Object.keys(message)).toEqual(keys)
      tokensBuyer.accessToken = message.accessToken
      tokensBuyer.refreshToken = message.refreshToken
    })
  })

  describe('Testing get all users', () => {
    test('Should return an array of users', async () => {
      const {
        data: { message: allUsers }
      } = await axios.get(`${URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${tokensBuyer.accessToken}`
        }
      })

      expect(allUsers.some(u => u.email === newUserBuyer.email)).toBe(true)

    })
  })

  describe('Testing save seller user', () => {
    let response = {}

    test('Should return 201 as status code and asign user id', async () => {
      response = await axios.post(`${URL}/api/user/signup`, newUserSeller)
      expect(response.status).toBe(201)
      idSeller = response.data.message.id
      _idSeller = response.data.message._id
    })
  })

  describe('Testing login a seller ', () => {
    const keys = ['accessToken', 'refreshToken']

    test('Should return accessToken and refreshToken', async () => {
      const {
        data: { message }
      } = await axios.post(`${URL}/api/user/login`, {
        email: newUserSeller.email,
        password: newUserSeller.password
      })

      expect(Object.keys(message)).toEqual(keys)
      tokensSeller.accessToken = message.accessToken
      tokensSeller.refreshToken = message.refreshToken
    })
  })

  describe('Testing post a new article as seller', () => {
    response: {}
    const article = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: 10000,
      roleId: '4'
    }
    
    test('Should return 201 status code', async () => {
     response = await axios.post(`${URL}/api/article/${idSeller}`, article, {
        headers: {
         Authorization: `Bearer ${tokensSeller.accessToken}`
        }
       }
      )

      expect(response.status).toBe(201)
      idProduct = response.data.message.id
    })
  })


  describe('Testing buy a product without credit', () => {
    response: {}
    test('Should throw error with message not enough money', async () => {
    
    try {
      await axios.post(`${URL}/api/user/${idBuyer}/articles/buy/${idProduct}`, {
          headers: {
            Authorization: `Bearer ${tokensBuyer.accessToken}`
          }
      })
    } catch (error) {
        expect(error.response.status).toBe(400)
    }
    })
  })

  describe('Testing charge balance to buyer', () => {
    response: {}
    const balance = {
      balance: 10000,
      roleId: '3'
    }
    
    test('Should return 201 status code', async () => {
     response = await axios.post(`${URL}/api/balance/${idBuyer}`, balance, {
        headers: {
         Authorization: `Bearer ${tokensBuyer.accessToken}`
        }
       }
      )

      expect(response.status).toBe(201)
    })
  })


  describe('Testing buying a product with enough balance', () => {
    response: {}
    test('Should return 200 status code', async () => {
      response = await axios.post(`${URL}/api/user/${idBuyer}/articles/buy/${idProduct}`, {}, 
      {
        headers: {
          Authorization: `Bearer ${tokensBuyer.accessToken}`
        }
      })
      
      expect(response.status).toBe(200)
    })

  })

})

/**
 * E commerce
 * ------
 * 1. Registrar (sign up) un usuario como cliente✅
 *  1.1. Login del cliente✅
 * 2. Recargar saldo del cliente✅
 * 3. Registrar un usuario como vendedor✅
 *  3.1. Login del vendedor✅
 * 4. Registrar un artículo (precio) del vendedor✅
 * 5. El cliente intenta comprar el artículo✅
 *  5.1. El saldo del cliente del insuficiente -> Recarga más saldo
 *  5.2. El saldo es suficiente -> Se genera la compra ✅
 * 6. El saldo pasa de la cuenta del cliente a la cuenta del vendedor ✅
 * 7. El artículo pasa de la cuenta del vendedor a la cuenta del cliente ✅
 *
 * Nota: las únicas rutas públicas son las rutas de registro
 */