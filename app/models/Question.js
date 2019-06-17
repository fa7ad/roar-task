const mongoose = require('mongoose')

const { APIError } = require('../helpers')

// globals
const Schema = mongoose.Schema

const responseSchema = new Schema({
  email: String,
  response: String
})

const questionSchema = new Schema({
  id: String,
  question: String,
  responses: [responseSchema]
})

questionSchema.statics = {
  /**
   * Create a Single New Question
   * @param {object} newQuestion - an instance of Question
   * @returns {Promise<Question, APIError>}
   */
  async createQuestion (newQuestion) {
    const duplicate = await this.findOne({ id: newQuestion.id })
    if (duplicate) {
      throw new APIError(
        409,
        'Question Already Exists',
        `There is already a question with id '${newQuestion.id}'.`
      )
    }
    const question = await newQuestion.save()
    return question.toObject()
  },
  /**
   * Delete a single Question
   * @param {String} id - the Question's id
   * @returns {Promise<Question, APIError>}
   */
  async deleteQuestion (id) {
    const deleted = await this.findOneAndRemove({ id })
    if (!deleted) {
      throw new APIError(
        404,
        'Question Not Found',
        `No question '${id}' found.`
      )
    }
    return deleted.toObject()
  },
  /**
   * Get a single Question by id
   * @param {String} id - the Question's id
   * @returns {Promise<Question, APIError>}
   */
  async readQuestion (id) {
    const question = await this.findOne({ id })

    if (!question) {
      throw new APIError(
        404,
        'Question Not Found',
        `No question '${id}' found.`
      )
    }
    return question.toObject()
  },
  /**
   * Get a list of Questions
   * @param {Object} query - pre-formatted query to retrieve questions.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Questions, APIError>}
   */
  async readQuestions (query, fields) {
    const questions = await this.find(query, fields)
      .sort({ id: 1 })
      .exec()
    if (!questions.length) {
      return []
    }
    return questions.map(question => question.toObject())
  },
  /**
   * Patch/Update a single Question
   * @param {String} id - the Question's id
   * @param {Object} questionUpdate - the json containing the Question attributes
   * @returns {Promise<Question, APIError>}
   */
  async updateQuestion (id, questionUpdate) {
    const question = await this.findOneAndUpdate({ id }, questionUpdate, {
      new: true
    })
    if (!question) {
      throw new APIError(
        404,
        'Question Not Found',
        `No question '${id}' found.`
      )
    }
    return question.toObject()
  }
}

questionSchema.pre('save', async function () {
  var question = this
  if (!question.isModified('id')) return
  question.id = '#' + +new Date() + ((Math.random() * 1e3) | 0)
})

/* Transform with .toObject to remove __v and _id from response */
if (!questionSchema.options.toObject) questionSchema.options.toObject = {}
questionSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret
  delete transformed._id
  delete transformed.__v
  return transformed
}

/** Ensure MongoDB Indices **/
questionSchema.index({ id: 1 }, { unique: true })

module.exports = mongoose.model('Question', questionSchema)
