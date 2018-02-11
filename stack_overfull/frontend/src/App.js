import React, { Component } from "react";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { Route, Switch } from "react-router-dom";
import { About } from "./pages/About";

export default class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/About" component={About} />
      </Switch>
    );
  }
}
