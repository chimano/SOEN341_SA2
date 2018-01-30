import React, { Component } from 'react';
import './App.css';
import { HomePage } from './pages/home.page';
import { Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={ HomePage }/>
      </Switch>
    );
  }
}

export default App;
