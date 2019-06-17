const express = require('express')
const guard = require('express-jwt-permissions')()

// app imports
const { userHandler, usersHandler } = require('../handlers')
const { jwtVerify } = require('../config')

// globals
const router = new express.Router()
const { readUsers } = usersHandler
const { createUser, readUser, updateUser, deleteUser } = userHandler

/* All the Users Route */
router
  .route('')
  .get(jwtVerify, readUsers)
  .post(createUser)

/* Single User by Name Route */
router
  .route('/:email')
  .get(jwtVerify, readUser)
  .patch(jwtVerify, updateUser)
  .delete(jwtVerify, guard.check('admin'), deleteUser)

module.exports = router
