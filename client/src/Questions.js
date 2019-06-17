import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Button, Label, Input } from 'reactstrap'

import { actions } from './redux'

const Question = props => {
  return (
    <div className='p-3'>
      <Label htmlFor={'question' + props.qid}>{props.question}</Label>
      <Input
        id={'question' + props.qid}
        onChange={props.onChange}
        value={props.response}
      />
    </div>
  )
}

class QuestionsPage extends React.PureComponent {
  render () {
    if (!this.props.loggedIn) return <Redirect to='/' />
    return (
      <div className='container'>
        <h1>Roar Task</h1>
        <h3>{this.props.email}</h3>
        {this.props.questions.map(data => (
          <Question
            qid={data.id}
            question={data.question}
            response={data.response}
            onChange={this.questionChange(data.id)}
          />
        ))}
        {this.props.questions.length > 0 && (
          <Button color='primary' onClick={this.sendResponse}>
            Save
          </Button>
        )}
      </div>
    )
  }

  sendResponse = e => {
    this.props.sendResponse()
  }

  questionChange = id => e => {
    const val = e.target.value
    const questions = this.props.questions.map(el => {
      if (el.id === id) {
        return Object.assign({}, el, {
          id,
          response: val || e.currentTarget.value
        })
      }
      return el
    })
    this.props.setQuestions(questions)
  }

  componentDidMount () {
    this.props.getQuestions()
  }
}

const mapStateToProps = state => ({
  questions: state.questions,
  loggedIn: state.auth.loggedIn,
  email: state.user.email
})

const mapDispatchToProps = {
  getQuestions: actions.questions.getQuestions,
  sendResponse: actions.questions.sendResponse,
  setQuestions: actions.questions.load
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionsPage)
