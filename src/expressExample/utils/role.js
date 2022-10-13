const ROLES = {
  1: {
    name: 'admin',
    description: 'system admin'
  },
  2: {
    name: 'user',
    description: 'user who can sell and buy articles'
  },
  3: {
    name: 'client',
    description: 'user who can only buy articles'
  },

  4: {
    name: 'seller',
    description: 'user who can only sell articles'
  }
}

const ROLE_IDS = Object.keys(ROLES)

const ROLE_NAMES = Object.entries(ROLES).map(role => role[1].name)

module.exports = {
  ROLES,
  ROLE_IDS,
  ROLE_NAMES
}
