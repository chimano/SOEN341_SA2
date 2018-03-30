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
          isEmployer: response.data.profile.isEmployer,
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
            isEmployer: response.data.profile.isEmployer,
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
    });
  };

  verifyLogin = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      getApiUserMe()
        .then((response) => {
          console.log('response of getApiUserMe: ', response);
          if (!response.data.error) {
            this.setState({
              loggedIn: true,
              username: response.data.username,
            });
          } else {
            this.setState({
              loggedIn: false,
              username: '',
            });
          }
          resolve(this.state.loggedIn);
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });

  render() {
    return (
      <main className="App">
        <NavigationBar
          handleLogout={this.handleLogout}
          handleLogin={this.handleLogin}
          loggedIn={this.state.loggedIn}
          username={this.state.username}
        />{' '}
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <HomePage username={this.state.username} verifyLogin={this.verifyLogin} {...props} />
            )}
          />{' '}
          <Route
            path="/question/:id"
            render={props => (
              <AnswerPage
                username={this.state.username}
                loggedIn={this.state.loggedIn}
                {...props}
              />
            )}
          />{' '}
          <Route path="/profile" component={ProfilePage} />{' '}
          <Route
            path="/search/"
            render={props => <SearchPage username={this.state.username} {...props} />}
          />
          <Route path="/categories" render={props => <CategoryListPage {...props} />} />
          <Route path="/tags/:tags" component={TagPage} />
          <Route
            path="/careers"
            render={props => <CareerPage isEmployer={this.state.isEmployer} {...props} />}
          />
          <Route
            path="/user/:username"
            render={props => <UserPage user={this.state.user} {...props} />}
          />
        </Switch>
        <Footer />
      </main>
    );
  }
}
