import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Login from './container/login/login'
import Admin from './container/admin/admin/Admin'
export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Admin} />
          <Redirect to="/admin/home" />
        </Switch>
      </div>
    )
  }
}
