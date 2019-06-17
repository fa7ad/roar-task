const express = require('express')
const guard = require('express-jwt-permissions')()

// app imports
const { questionHandler, questionsHandler } = require('../handlers')
const { jwtVerify } = require('../config')

// globals
const router = new express.Router()
const { readQuestions } = questionsHandler
const { createQuestion, readQuestion, updateQuestion, deleteQuestion } = questionHandler

/* All the Questions Route */
router
  .route('')
  .get(jwtVerify, readQuestions)
  .post(jwtVerify, guard.check('admin'), createQuestion)

/* Single Question by Name Route */
router
  .route('/:id')
  .get(jwtVerify, readQuestion)
  .patch(jwtVerify, updateQuestion)
  .delete(jwtVerify, guard.check('admin'), deleteQuestion)

module.exports = router
