const { Question } = require('../models')

/**
 * List all the questions. Query params ?skip=0&limit=1000 by default
 */
async function readQuestions (request, response, next) {
  try {
    const questions = await Question.readQuestions({}, {})
    const nqs = questions.map(el => {
      const { responses, ...q } = el
      const { response } = responses.filter(
        rs => rs.email === request.user.email
      )[0]

      return { ...q, response }
    })
    return response.json(nqs)
  } catch (err) {
    return next(err)
  }
}

async function updateQuestions (request, response, next) {
  try {
    const questions = request.body
    const { email } = request.user

    for (let question of questions) {
      const { responses } = await Question.readQuestion(question.id)
      let found = false
      const nrs = responses.map(el => {
        if (el.email === email) {
          found = true
          return Object.assign({}, el, { response: question.response })
        }
        return el
      })
      if (!found) nrs.push({ email, response: question.response })
      const res = await Question.updateQuestion(question.id, {
        ...question,
        responses: nrs
      })
      console.log('after', res)
    }

    response.json({
      success: true,
      error: null,
      message: 'Your data has been recorded!'
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  readQuestions,
  updateQuestions
}
