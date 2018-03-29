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
  logged_in: boolean,
  username: string,
  is_employer: boolean,
  user: Object,
};

export default class App extends React.Component<{}, State> {
  state = {
    logged_in: false,
    username: '',
    is_employer: false,
    user: {},
  };

  componentDidMount() {
    this.handle_login();
  }

  checkIfUserIsLoggedIn = () => {
    getApiUserMe().then((response) => {
      if (!response.data.error) {
        this.setState({
          logged_in: true,
          user: response.data,
          username: response.data.username,
          is_employer: response.data.profile.is_employer,
        });
      }
    });
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  handle_login = () => {
    getApiUserMe()
      .then((response) => {
        console.log('response of getApiUserMe: ', response);
        if (!response.data.error) {
          this.setState({
            logged_in: true,
            user: response.data,
            username: response.data.username,
            is_employer: response.data.profile.is_employer,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handle_logout = () => {
    postApiUserLogout().catch(error => console.log(error));
    this.setState({
      logged_in: false,
      username: '',
      is_employer: false,
    });
  };

  verifyLogin = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      getApiUserMe()
        .then((response) => {
          console.log('response of getApiUserMe: ', response);
          if (!response.data.error) {
            this.setState({
              logged_in: true,
              username: response.data.username,
            });
          } else {
            this.setState({
              logged_in: false,
              username: '',
            });
          }
          resolve(this.state.logged_in);
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
          handle_logout={this.handle_logout}
          handle_login={this.handle_login}
          logged_in={this.state.logged_in}
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
                verifyLogin={this.verifyLogin}
                logged_in={this.state.logged_in}
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
          <Route
            path="/careers"
            render={props => <CareerPage is_employer={this.state.is_employer} {...props} />}
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