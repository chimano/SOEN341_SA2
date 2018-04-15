// @flow
import React from 'react';
import { message } from 'antd';
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
};

export default class App extends React.Component<{}, State> {
  state = {
    loggedIn: false,
    username: '',
    isEmployer: false,
  };

  componentDidMount() {
    this.handleLogin();
  }

  checkIfUserIsLoggedIn = () => {
    getApiUserMe()
      .then((response) => {
        if (!response.data.error) {
          this.setState({
            loggedIn: true,
            username: response.data.username,
            isEmployer: response.data.profile.is_employer,
          });
        }
      })
      .catch(() => {
        this.setState({
          loggedIn: false,
          username: '',
          isEmployer: false,
        });
      });
  };

  handleLogin = () => {
    getApiUserMe()
      .then((response) => {
        if (!response.data.error) {
          this.setState({
            loggedIn: true,
            username: response.data.username,
            isEmployer: response.data.profile.is_employer,
          });
        }
      });
  };

  handleLogout = () => {
    postApiUserLogout().then(() => { message.success('Signed out'); });
    this.setState({
      loggedIn: false,
      username: '',
      isEmployer: false,
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
          <Route
            path="/profile"
            render={props => <ProfilePage currentUsername={this.state.username} {...props} />}
          />
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
          <Route path="/user/:username" component={UserPage} currentUser={this.state.username} />
        </Switch>
        <Footer />
      </main>
    );
  }
}
