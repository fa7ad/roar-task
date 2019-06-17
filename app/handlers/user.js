const { validate } = require('jsonschema')

// app imports
const { User } = require('../models')
const { APIError } = require('../helpers')
const { userNewSchema, userUpdateSchema } = require('../schemas')

/**
 * Validate the POST request body and create a new User
 */
async function createUser (request, response, next) {
  if (!request.body.admin) request.body.admin = false

  const validation = validate(request.body, userNewSchema)
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        'Bad Request',
        validation.errors.map(e => e.stack).join('. ')
      )
    )
  }

  try {
    const newUser = await User.createUser(new User(request.body))
    return response
      .status(201)
      .json({ email: newUser.email, success: true, error: null })
  } catch (err) {
    return next(err)
  }
}

/**
 * Get a single user
 * @param {String} email - the email of the User to retrieve
 */
async function readUser (request, response, next) {
  const { email } = request.params
  try {
    const user = await User.readUser(email)
    return response.json(user)
  } catch (err) {
    return next(err)
  }
}

/**
 * Update a single user
 * @param {String} email - the email of the User to update
 */
async function updateUser (request, response, next) {
  const { email } = request.params

  const validation = validate(request.body, userUpdateSchema)
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        'Bad Request',
        validation.errors.map(e => e.stack).join('. ')
      )
    )
  }

  try {
    const user = await User.updateUser(email, request.body)
    return response.json(user)
  } catch (err) {
    return next(err)
  }
}

/**
 * Remove a single user
 * @param {String} email - the email of the User to remove
 */
async function deleteUser (request, response, next) {
  const { email } = request.params
  try {
    const deleteMsg = await User.deleteUser(email)
    return response.json(deleteMsg)
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  createUser,
  readUser,
  updateUser,
  deleteUser
}
