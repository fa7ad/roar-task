const jwt = require('jsonwebtoken')

const { User } = require('../models')
const { APIError } = require('../helpers')
const { JWT_SECRET } = require('../config')

/**
 * Handle a login attempt
 */
async function loginUser (request, response, next) {
  try {
    const { email, password } = request.body
    const user = await User.findOne({ email })
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw new APIError(401, 'Unauthorized', 'Wrong email/password given.')
    }
    const token = jwt.sign(
      { email, scope: user.admin ? 'admin' : '' },
      JWT_SECRET,
      { expiresIn: 15 * 60 }
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

/**
 * Logout a user and invalidate their token
 */

async function logoutUser (req, res, next) {
  try {
    // TODO: implement invalidation logic
    res.json({
      success: true,
      error: null
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { loginUser, logoutUser }
