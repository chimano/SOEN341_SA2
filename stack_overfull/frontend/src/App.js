import React from "react";
import "./App.css";
import { HomePage, AnswerPage } from "./pages";
import { Route, Switch } from "react-router-dom";
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
    getApiUserMe().then(response => {
      if (!response.data.error) {
        this.setState({ logged_in: true, username: response.data.username });
      }
    });
  };

  handle_logout = () => {
    postApiUserLogout();
    this.setState({ logged_in: false, username: "" });
  };

  render() {
    console.log("App.js state: ", this.state);

    return (
      <main>
        <NavigationBar
          handle_logout={this.handle_logout}
          logged_in={this.state.logged_in}
          username={this.state.username}
          handle_login={this.handle_login}
        />
        <Switch>
          <Route exact path="/" component={HomePage} />
          {/* <Route
            path="/question/:id"
            component={AnswerPage}
          /> */}
          <Route
            path="/question/:id"
            render={(props) => (<AnswerPage username = {this.state.username} {...props} />)}
          />

          <Route path="/categories" component={CategoryPage} />
          <Route path='/categories/business' component={Business}/>
          <Route path='/categories/cooking' component={Cooking}/>
          <Route path='/categories/entertainment' component={Entertainment}/>
          <Route path='/categories/fashion' component={Fashion}/>
          <Route path='/categories/programming' component={Programming}/>
          <Route path='/categories/social' component={Social}/>
          <Route path='/categories/technology' component={Technology}/>

        </Switch>
        <Footer />
      </main>
    );
  }
}


// logged_in={this.state.logged_in}