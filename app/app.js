const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
global.Promise = require('bluebird')

// app imports
const { connectToDatabase } = require('./config')
const { errorHandler } = require('./handlers')
const { usersRouter } = require('./routers')

// global constants
dotenv.config()
const app = express()
const {
  bodyParserHandler,
  globalErrorHandler,
  fourOhFourHandler,
  fourOhFiveHandler
} = errorHandler

// database
connectToDatabase()

// body parser setup
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ type: '*/*' }))
app.use(bodyParserHandler) // error handling specific to body parser only

// response headers setup; CORS
app.use(cors())

app.use('/users', usersRouter)

// catch-all for 404 "Not Found" errors
app.get('*', fourOhFourHandler)
// catch-all for 405 "Method Not Allowed" errors
app.all('*', fourOhFiveHandler)

app.use(globalErrorHandler)

module.exports = app
