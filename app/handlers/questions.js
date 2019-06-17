const { Question } = require('../models')

/**
 * List all the questions. Query params ?skip=0&limit=1000 by default
 */
async function readQuestions (request, response, next) {
  try {
    const questions = await Question.readQuestions({}, {})
    return response.json(questions)
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  readQuestions
}
