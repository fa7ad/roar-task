const mongoose = require('mongoose')
const exJWT = require('express-jwt')

const APP_NAME = 'Roar Task API'
const ENV = process.env.NODE_ENV
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'i haz a secur33ty'

// database configs

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb/boilerplate'
if (ENV === 'test') {
  MONGODB_URI = global.__MONGO_URI__
}

mongoose.Promise = Promise
if (ENV === 'development' || ENV === 'test') {
  mongoose.set('debug', true)
}

/**
 * Connect to mongoose asynchronously or bail out if it fails
 */
async function connectToDatabase () {
  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: false,
      useNewUrlParser: true
    })
    console.log(`${APP_NAME} successfully connected to database.`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

const jwtVerify = exJWT({ secret: JWT_SECRET })

module.exports = {
  APP_NAME,
  ENV,
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  jwtVerify,
  connectToDatabase
}
