const express = require('express')
const guard = require('express-jwt-permissions')({
  requestProperty: 'user',
  permissionsProperty: 'scope'
})

// app imports
const { questionHandler, questionsHandler } = require('../handlers')
const { jwtVerify } = require('../config')

// globals
const router = new express.Router()
const { readQuestions, updateQuestions } = questionsHandler
const { createQuestion, readQuestion, updateQuestion, deleteQuestion } = questionHandler

/* All the Questions Route */
router
  .route('')
  .get(jwtVerify, readQuestions)
  .patch(jwtVerify, updateQuestions)
  .post(jwtVerify, guard.check('admin'), createQuestion)

/* Single Question by Name Route */
router
  .route('/:id')
  .get(jwtVerify, readQuestion)
  .patch(jwtVerify, updateQuestion)
  .delete(jwtVerify, guard.check('admin'), deleteQuestion)

module.exports = router
