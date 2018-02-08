import React, {Component} from 'react';
import './App.css';
import {HomePage} from './pages/HomePage';
import { Route, Switch } from 'react-router-dom';


export default class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage}/>
      </Switch>
    );
  }
}
