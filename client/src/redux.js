import { createAction, createReducer, configureStore } from 'redux-starter-kit'
import axios from 'axios'

const initialState = {
  auth: { loggedIn: false, token: '', scope: '' },
  user: {
    email: '',
    password: ''
  },
  questions: []
}

const actions = {
  auth: {
    login: createAction('auth/login'),
    logout: createAction('auth/logout'),
    info: createAction('auth/info'),
    sendLogin () {
      return (dispatch, getState) =>
        axios
          .post('http://0.0.0.0:5000/login', getState().user)
          .then(res => {
            if (res.status === 200) {
              const { scope, token } = res.data
              dispatch({ type: 'auth/login', payload: { scope, token } })
            }
          })
          .catch(err => {
            dispatch({ type: 'auth/info', payload: err })
          })
    },
    sendRegister () {
      return (dispatch, getState) =>
        axios
          .post('http://0.0.0.0:5000/users', getState().user)
          .then(res => {
            if (res.status === 200) {
              dispatch({
                type: 'auth/info',
                payload: {
                  message:
                    getState().user.email +
                    ' was successfully registered. Please login!'
                }
              })
            }
          })
          .catch(err => {
            dispatch({ type: 'auth/info', payload: err })
          })
    }
  },
  user: {
    set: createAction('user/set')
  },
  questions: {
    getQuestions () {
      return (dispatch, getState) =>
        axios
          .get('http://0.0.0.0:5000/questions', {
            headers: {
              Authorization: `Bearer ${getState().auth.token}`
            }
          })
          .then(res => {
            dispatch({
              type: 'questions/load',
              payload: res.data
            })
          })
    },
    load: createAction('questions/load'),
    sendResponse () {
      return (dispatch, getState) =>
        axios
          .patch('http://0.0.0.0:5000/questions', getState().questions, {
            headers: {
              Authorization: `Bearer ${getState().auth.token}`
            }
          })
          .then(res => {
            dispatch({
              type: 'questions/info',
              payload: 'Your responses were successfully recorded!'
            })
          })
    }
  }
}

const rootReducer = createReducer(initialState, {
  [actions.user.set] (state, action) {
    Object.assign(state.user, action.payload)
  },
  [actions.auth.login] (state, action) {
    state.auth.loggedIn = true
    state.auth.token = action.payload.token
    state.auth.scope = action.payload.scope
  },
  [actions.auth.logout] (state, action) {
    state.auth.loggedIn = false
    state.auth.token = ''
    state.auth.scope = ''
  },
  [actions.auth.info] (state, action) {
    alert(action.payload.description || action.payload.message)
  },
  [actions.questions.load] (state, action) {
    state.questions = action.payload
  }
})

const store = configureStore({
  reducer: rootReducer
})

export { store, actions }
