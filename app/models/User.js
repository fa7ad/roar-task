const mongoose = require('mongoose')
const { hash, compare } = require('bcrypt')

// app imports
const { APIError } = require('../helpers')

// globals
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: String,
  password: String,
  admin: Boolean
})

userSchema.statics = {
  /**
   * Create a Single New User
   * @param {object} newUser - an instance of User
   * @returns {Promise<User, APIError>}
   */
  async createUser (newUser) {
    const duplicate = await this.findOne({ email: newUser.email })
    if (duplicate) {
      throw new APIError(
        409,
        'User Already Exists',
        `There is already a user with email '${newUser.email}'.`
      )
    }
    const user = await newUser.save()
    return user.toObject()
  },
  /**
   * Delete a single User
   * @param {String} email - the User's email
   * @returns {Promise<User, APIError>}
   */
  async deleteUser (email) {
    const deleted = await this.findOneAndRemove({ email })
    if (!deleted) {
      throw new APIError(404, 'User Not Found', `No user '${email}' found.`)
    }
    return deleted.toObject()
  },
  /**
   * Get a single User by email
   * @param {String} email - the User's email
   * @returns {Promise<User, APIError>}
   */
  async readUser (email) {
    const user = await this.findOne({ email })

    if (!user) {
      throw new APIError(404, 'User Not Found', `No user '${email}' found.`)
    }
    return user.toObject()
  },
  /**
   * Get a list of Users
   * @param {Object} query - pre-formatted query to retrieve users.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Users, APIError>}
   */
  async readUsers (query, fields) {
    const users = await this.find(query, fields)
      .sort({ email: 1 })
      .exec()
    if (!users.length) {
      return []
    }
    return users.map(user => user.toObject())
  },
  /**
   * Patch/Update a single User
   * @param {String} email - the User's email
   * @param {Object} userUpdate - the json containing the User attributes
   * @returns {Promise<User, APIError>}
   */
  async updateUser (email, userUpdate) {
    const user = await this.findOneAndUpdate({ email }, userUpdate, {
      new: true
    })
    if (!user) {
      throw new APIError(404, 'User Not Found', `No user '${email}' found.`)
    }
    return user.toObject()
  }
}

userSchema.methods = {
  /**
   * Compare a given password against a user's password
   * @param {String} candidatePassword - the password to be tested
   * @returns {Promise<boolean, Error>}
   */
  async comparePassword (candidatePassword, next) {
    return compare(candidatePassword, this.password)
  }
}

userSchema.pre('save', async function () {
  var user = this
  if (!user.isModified('password')) return
  user.password = await hash(user.password, 10)
})

/* Transform with .toObject to remove __v and _id from response */
if (!userSchema.options.toObject) userSchema.options.toObject = {}
userSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret
  delete transformed._id
  delete transformed.__v
  return transformed
}

/** Ensure MongoDB Indices **/
userSchema.index({ email: 1 }, { unique: true })

module.exports = mongoose.model('User', userSchema)
