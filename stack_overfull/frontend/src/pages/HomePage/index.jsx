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
import qs from "qs";

export class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open_signin: false,
      open_signup: false,
      logged_in: false,
      username: "",
      title: "TOP QUESTIONS",
      showTopQuestions: true,
      questionList: []
    };

    this.getQuestionList();
  }

  getQuestionList = () => {
    axios
      .get("/api/question/order=desc/limit=10/")
      .then(response => {
        console.log(response);
        this.setState({
          questionList: response.data.question_list
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  createQuestion(question) {
    axios
      .post("/api/question/", qs.stringify({ question: question }))
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
  handleAskQuestionButton = () => {
    if (this.state.username === "") {
      this.handle_signin_button();
    } else {
      this.setState({
        title: "Ask a question to the community",
        showTopQuestions: false
      });
    }
  };
  handleShowTopQuestions = show => {
    this.setState({
      showTopQuestions: show
    });
  };

  render() {
    console.log(this.state);

    var login_box;
    if (this.state.open_signin === true) {
      login_box = (
        <div className="login-wrap">
          <SignInFormWindow
            handle_close_button={this.handle_close_button}
            handle_login={this.handle_login}
          />
        </div>
      );
    } else if (this.state.open_signup === true) {
      login_box = (
        <div className="login-wrap">
          <SignUpFormWindow
            handle_close_button={this.handle_close_button}
            handle_login={this.handle_login}
          />
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
          handle_logout={this.handle_logout}
          logged_in={this.state.logged_in}
          username={this.state.username}
        />
        {login_box}
        <div className="main">
          <QuestionList
            handleAskQuestionButton={this.handleAskQuestionButton}
            showTopQuestions={this.state.showTopQuestions}
            title={this.state.title}
            username={this.state.username}
            questionList={this.state.questionList}
            createQuestion={this.createQuestion}
            handleShowTopQuestions={this.handleShowTopQuestions}
          />
        </div>
        <div className="footer-area">
          <Footer handle />
        </div>
      </div>
    );
  }
}
