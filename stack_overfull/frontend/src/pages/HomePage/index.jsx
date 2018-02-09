import React from "react";
import {
  NavigationBar,
  SignUpFormWindow,
  SignInFormWindow,
  QuestionList,
  Footer
} from "../../components";
import "./index.css";
import axios from "axios";

export class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open_signin: false,
      open_signup: false,
<<<<<<< HEAD
      questionList: []
    };

    this.handle_signup_button = this.handle_signup_button.bind(this);
    this.handle_signin_button = this.handle_signin_button.bind(this);
    this.handle_close_button = this.handle_close_button.bind(this);

    this.getQuestionList();
  }

  getQuestionList() {
    axios
      .get("/api/question/order=asc/limit=10/")
      .then(response => {
        this.setState({
          questionList: response.data.question_list
        });
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  handle_signup_button() {
    this.setState({ open_signup: true, open_signin: false });
  }

  handle_signin_button() {
    this.setState({ open_signin: true, open_signup: false });
  }

  handle_close_button() {
    this.setState({ open_signin: false, open_signup: false });
  }

  render() {
    console.log(this.state);
=======
      logged_in: false,
      username: ""
    };

    this.getQuestionList();
  }

  getQuestionList() {
    axios
      .get("/api/question/order=asc/limit=10/")
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  handle_signup_button = () => {
    this.setState({ open_signup: true, open_signin: false });
  };

  handle_signin_button = () => {
    this.setState({ open_signin: true, open_signup: false });
  };

  handle_close_button = () => {
    this.setState({ open_signin: false, open_signup: false });
  };
  handle_login = username => {
    this.setState({ logged_in: true, username: username });
  };
  handle_logout = () => {
    this.setState({ logged_in: false, username: "" });
  };

  render() {
    console.log(this.state);

>>>>>>> 46e01a29e20e643ff7012936b85da5ecc4fccad7
    var login_box;
    if (this.state.open_signin === true) {
      login_box = (
        <div className="login-wrap">
<<<<<<< HEAD
          <SignInFormWindow handle_close_button={this.handle_close_button} />
=======
          <SignInFormWindow
            handle_close_button={this.handle_close_button}
            handle_login={this.handle_login}
          />
>>>>>>> 46e01a29e20e643ff7012936b85da5ecc4fccad7
        </div>
      );
    } else if (this.state.open_signup === true) {
      login_box = (
        <div className="login-wrap">
<<<<<<< HEAD
          <SignUpFormWindow handle_close_button={this.handle_close_button} />
=======
          <SignUpFormWindow 
            handle_close_button={this.handle_close_button}
            handle_login={this.handle_login}            
          />
>>>>>>> 46e01a29e20e643ff7012936b85da5ecc4fccad7
        </div>
      );
    } else {
      login_box = "";
    }

    return (
      <div>
        <NavigationBar
          handle_signup_button={this.handle_signup_button}
          handle_signin_button={this.handle_signin_button}
<<<<<<< HEAD
        />{" "}
        {login_box}
        <div className="main">
          <QuestionList questionList={this.state.questionList} />
=======
          handle_logout={this.handle_logout}
          logged_in={this.state.logged_in}
          username={this.state.username}
        />
        {login_box}
        <div className="main">
          <QuestionList />
>>>>>>> 46e01a29e20e643ff7012936b85da5ecc4fccad7
        </div>
        <div className="footer-area">
          <Footer />
        </div>
      </div>
    );
  }
}
