const { Question } = require('../models')

/**
 * Validate the POST request body and create a new Question
 */
async function createQuestion (request, response, next) {
  try {
    const newQuestion = await Question.createQuestion(
      new Question(request.body)
    )
    return response
      .status(201)
      .json({ id: newQuestion.id, success: true, error: null })
  } catch (err) {
    return next(err)
  }
}

/**
 * Get a single question
 * @param {String} id - the id of the Question to retrieve
 */
async function readQuestion (request, response, next) {
  try {
    const { id } = request.params
    const question = await Question.readQuestion(id)
    return response.json(question)
  } catch (err) {
    return next(err)
  }
}

/**
 * Update a single question
 * @param {String} id - the id of the Question to update
 */
async function updateQuestion (request, response, next) {
  try {
    const { id } = request.params
    const question = await Question.updateQuestion(id, request.body)
    return response.json(question)
  } catch (err) {
    return next(err)
  }
}

/**
 * Remove a single question
 * @param {String} id - the id of the Question to remove
 */
async function deleteQuestion (request, response, next) {
  try {
    const { id } = request.params
    const deleteMsg = await Question.deleteQuestion(id)
    return response.json(deleteMsg)
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  createQuestion,
  readQuestion,
  updateQuestion,
  deleteQuestion
}
