const express = require('express')

// app imports
const { authHandler } = require('../handlers')
const { jwtVerify } = require('../config')

// globals
const router = new express.Router()
const { loginUser, logoutUser } = authHandler

router.post('/login', loginUser)
router.get('/logout', jwtVerify, logoutUser)

module.exports = router
