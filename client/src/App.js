import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import { store } from './redux'
import Auth from './Auth'
import Questions from './Questions'

function App () {
  return (
    <Provider store={store}>
      <Router>
        <Route path='/' exact component={Auth} />
        <Route path='/questions' component={Questions} />
      </Router>
    </Provider>
  )
}

export default App
