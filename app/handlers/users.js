const { User } = require('../models')

/**
 * List all the users. Query params ?skip=0&limit=1000 by default
 */
async function readUsers (request, response, next) {
  try {
    const users = await User.readUsers({}, {})
    return response.json(users)
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  readUsers
}
