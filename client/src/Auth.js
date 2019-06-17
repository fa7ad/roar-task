import React from 'react'
import { Form, Input, Button } from 'reactstrap'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { actions } from './redux'

import './Auth.css'

const LoginPage = props => {
  const handleChange = name => e => {
    props.setForm({ [name]: e.target.value })
  }
  if (props.loggedIn) return <Redirect to='/questions' />
  return (
    <Form className='login-form'>
      <h1>Roar Task - Login</h1>
      <Input
        placeholder='Your email address'
        name='email'
        value={props.email}
        onChange={handleChange('email')}
        required
      />
      <Input
        placeholder='Your password'
        type='password'
        name='password'
        value={props.password}
        onChange={handleChange('password')}
        required
      />
      <Button onClick={props.handleLogin} color='primary'>
        Login
      </Button>
      <Button onClick={props.handleRegister} color='danger'>
        Register
      </Button>
    </Form>
  )
}

const mapStateToProps = state => ({
  email: state.user.email,
  password: state.user.password,
  loggedIn: state.auth.loggedIn,
  scope: state.auth.scope
})

const mapDispatchToProps = {
  setForm: actions.user.set,
  handleLogin: actions.auth.sendLogin,
  handleRegister: actions.auth.sendRegister
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)
