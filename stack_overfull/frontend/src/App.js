import React from "react";
import "./App.css";
import { HomePage, AnswerPage, SearchPage, ProfilePage } from "./pages";
import { Route, Switch, Redirect } from "react-router-dom";
import { NavigationBar, Footer } from "./components";
import { getApiUserMe, postApiUserLogout } from "./utils/api";

import CategoryPage from "./pages/CategoryPage/CategoryPage";
import Business from "./pages/CategoryPage/Categories/Business";
import Cooking from "./pages/CategoryPage/Categories/Cooking";
import Entertainment from "./pages/CategoryPage/Categories/Entertainment";
import Fashion from "./pages/CategoryPage/Categories/Fashion";
import Programming from "./pages/CategoryPage/Categories/Programming";
import Social from "./pages/CategoryPage/Categories/Social";
import Technology from "./pages/CategoryPage/Categories/Technology";

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

  verifyLogin = () => {
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
    console.log("App.js state: ", this.state);

    return (
      <main>
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
          <Route path="/profile" component={ProfilePage}/>
          <Route
            path="/search/"
            render={props => (
              <SearchPage username={this.state.username} {...props} />
            )}
          />
          <Route path="/categories" component={CategoryPage} />
          <Route path="/categories/business" component={Business} />
          <Route path="/categories/cooking" component={Cooking} />
          <Route path="/categories/entertainment" component={Entertainment} />
          <Route path="/categories/fashion" component={Fashion} />
          <Route path="/categories/programming" component={Programming} />
          <Route path="/categories/social" component={Social} />
          <Route path="/categories/technology" component={Technology} />
        </Switch>
        <Footer />
      </main>
    );
  }
}
