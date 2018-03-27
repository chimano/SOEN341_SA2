// @flow

import React from "react";
import "./App.css";
import {
  HomePage,
  AnswerPage,
  SearchPage,
  CareerPage,
  ProfilePage,
  CategoryListPage,
  TagPage,
  UserPage
} from "./pages";
import { Route, Switch } from "react-router-dom";
import { NavigationBar, Footer } from "./components";
import { getApiUserMe, postApiUserLogout } from "./utils/api";

type Props = {};

type State = {
  logged_in: boolean,
  username: string
};

export default class App extends React.Component<Props, State> {
  state = {
    logged_in: false,
    username: ""
  };

  componentDidMount() {
    this.handle_login();
  }

  handle_login = () => {
    getApiUserMe()
      .then(response => {
        console.log("response of getApiUserMe: ", response);
        if (!response.data.error) {
          this.setState({ logged_in: true, username: response.data.username });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  handle_logout = () => {
    postApiUserLogout().catch(error => console.log(error));
    this.setState({ logged_in: false, username: "" });
  };

  verifyLogin = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      getApiUserMe()
        .then(response => {
          console.log("response of getApiUserMe: ", response);
          if (!response.data.error) {
            this.setState({
              logged_in: true,
              username: response.data.username
            });
          } else {
            this.setState({ logged_in: false, username: "" });
          }
          resolve(this.state.logged_in);
        })
        .catch(error => console.log(error));
    });
  };

  render() {
    return (
      <main className="App">
        <NavigationBar
          handle_logout={this.handle_logout}
          handle_login={this.handle_login}
          logged_in={this.state.logged_in}
          username={this.state.username}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <HomePage
                username={this.state.username}
                verifyLogin={this.verifyLogin}
                {...props}
              />
            )}
          />
          <Route
            path="/question/:id"
            render={props => (
              <AnswerPage
                username={this.state.username}
                verifyLogin={this.verifyLogin}
                logged_in={this.state.logged_in}
                {...props}
              />
            )}
          />
          <Route path="/profile" component={ProfilePage} />
          <Route
            path="/search/"
            render={props => (
              <SearchPage username={this.state.username} {...props} />
            )}
          />

          <Route
            path="/categories"
            render={props => (
              <CategoryListPage username={this.state.username} {...props} />
            )}
          />

          <Route
            path="/tags/:tags"
            render={props => (
              <TagPage
                username={this.state.username}
                verifyLogin={this.verifyLogin}
                logged_in={this.state.logged_in}
                {...props}
              />
            )}
          />

          <Route path="/careers" component={CareerPage} />
          <Route path="/user/:username" component={UserPage} />
        </Switch>
        <Footer />
      </main>
    );
  }
}
