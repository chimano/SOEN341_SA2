import React from "react";
import "./App.css";
import { HomePage, QuestionPage } from "./pages";
import { Route, Switch } from "react-router-dom";

export default class App extends React.Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/question/:id" component={QuestionPage} />
        </Switch>
      </main>
    );
  }
}
