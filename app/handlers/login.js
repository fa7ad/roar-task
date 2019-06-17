const jwt = require('jsonwebtoken')

const { User } = require('../models')
const { APIError } = require('../helpers')
const { JWT_SECRET } = require('../config')

/**
 * Handle a login attempt
 */
async function loginUser (request, response, next) {
  const { email, password } = request.body
  try {
    const user = await User.readUser(email)
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw new APIError(401, 'Unauthorized', 'Wrong email/password given.')
    }
    const token = jwt.sign(
      { email, scope: user.admin ? 'admin' : '' },
      JWT_SECRET
    )

    response.json({
      success: true,
      error: null,
      token
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { loginUser }
