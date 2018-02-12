<<<<<<< HEAD
import React, { Component } from "react";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { Route, Switch } from "react-router-dom";
import { About } from "./pages/About";
=======
import React from "react";
import "./App.css";
import { HomePage, QuestionPage } from "./pages";
import { Route, Switch } from "react-router-dom";
import { NavigationBar } from "./components";
import { getApiUserMe, postApiUserLogout } from "./utils/api";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logged_in: false,
      username: ""
    };

    this.handle_login();
  }

  handle_login = () => {
    getApiUserMe().then(response => {
      console.log(response);
      if (!response.data.error) {
        this.setState({ logged_in: true, username: response.data.username });
      }
    });
  };

  handle_logout = () => {
    postApiUserLogout();
    this.setState({ logged_in: false, username: "" });
  };
>>>>>>> 11140b1ce13fbdc18ae5033e426f3c0106735f75

  render() {
    console.log(this.state);

    return (
<<<<<<< HEAD
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/About" component={About} />
      </Switch>
=======
      <main>
        <NavigationBar
          handle_logout={this.handle_logout}
          logged_in={this.state.logged_in}
          username={this.state.username}
          handle_login={this.handle_login}
        />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/question/:id" component={QuestionPage} />
        </Switch>
      </main>
>>>>>>> 11140b1ce13fbdc18ae5033e426f3c0106735f75
    );
  }
}
