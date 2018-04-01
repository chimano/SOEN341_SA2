// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import {
  HomePage,
  AnswerPage,
  SearchPage,
  CareerPage,
  ProfilePage,
  CategoryListPage,
  TagPage,
  UserPage,
} from './pages';
import { NavigationBar, Footer } from './components';
import { getApiUserMe, postApiUserLogout } from './utils/api';

type State = {
  loggedIn: boolean,
  username: string,
  isEmployer: boolean,
  user: Object,
};

export default class App extends React.Component<{}, State> {
  state = {
    loggedIn: false,
    username: '',
    isEmployer: false,
    user: {},
  };

  componentDidMount() {
    this.handleLogin();
  }

  checkIfUserIsLoggedIn = () => {
    getApiUserMe().then((response) => {
      if (!response.data.error) {
        this.setState({
          loggedIn: true,
          user: response.data,
          username: response.data.username,
          isEmployer: response.data.profile.is_employer,
        });
      }
    });
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  handleLogin = () => {
    getApiUserMe()
      .then((response) => {
        console.log('response of getApiUserMe: ', response);
        if (!response.data.error) {
          this.setState({
            loggedIn: true,
            user: response.data,
            username: response.data.username,
            isEmployer: response.data.profile.is_employer,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleLogout = () => {
    postApiUserLogout().catch(error => console.log(error));
    this.setState({
      loggedIn: false,
      username: '',
      isEmployer: false,
      user: {},
    });
  };

  render() {
    return (
      <main className="App">
        <NavigationBar
          handleLogout={this.handleLogout}
          handleLogin={this.handleLogin}
          loggedIn={this.state.loggedIn}
          username={this.state.username}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <HomePage username={this.state.username} loggedIn={this.state.loggedIn} {...props} />
            )}
          />
          <Route
            path="/question/:id"
            render={props => (
              <AnswerPage
                username={this.state.username}
                loggedIn={this.state.loggedIn}
                {...props}
              />
            )}
          />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/search/" component={SearchPage} />
          <Route path="/categories" component={CategoryListPage} />
          <Route path="/tags/:tags" component={TagPage} />
          <Route
            path="/careers"
            render={props => (
              <CareerPage
                isEmployer={this.state.isEmployer}
                loggedIn={this.state.loggedIn}
                {...props}
              />
            )}
          />
          <Route path="/user/:username" component={UserPage} />
        </Switch>
        <Footer />
      </main>
    );
  }
}
