import React from "react";
import {NavigationBar, SignUpFormWindow, SignInFormWindow, QuestionList, Footer} from "../../components";
import "./index.css";
import axios from "axios";
import qs from "qs";

export class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open_signin: false,
      open_signup: false,
<<<<<<< HEAD
      questionList: []
=======
      logged_in: false,
      showCreateQuestionBox: false,
      username: "",
      questionList: [],
      answerList: []
>>>>>>> 35f8800046a3695423af9237e109d83f1c2794b7
    };

    this.handle_signup_button = this
      .handle_signup_button
      .bind(this);
    this.handle_signin_button = this
      .handle_signin_button
      .bind(this);
    this.handle_close_button = this
      .handle_close_button
      .bind(this);

    this.getQuestionList();
  }

  getQuestionList = () => {
    axios
<<<<<<< HEAD
      .get("/api/question/order=asc/limit=10/")
      .then(response => {
        this.setState({questionList: response.data.question_list});
=======
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

  createQuestion = question => {
    axios
      .post("/api/question/", qs.stringify({ question: question }))
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    setTimeout(() => this.getQuestionList(), 100);
  };

  answerQuestion(answer, q_id) {
    var parsedQ_id = parseInt(q_id);
    console.log("parsed_q_id", parsedQ_id);
    console.log("answer:", answer);
    axios
      .post("/api/answer/", qs.stringify({ answer: answer, q_id: parsedQ_id }))
      .then(function(response) {
>>>>>>> 35f8800046a3695423af9237e109d83f1c2794b7
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handle_signup_button() {
    this.setState({open_signup: true, open_signin: false});
  }

  handle_signin_button() {
    this.setState({open_signin: true, open_signup: false});
  }

<<<<<<< HEAD
  handle_close_button() {
    this.setState({open_signin: false, open_signup: false});
  }
=======
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
      this.openCreateQuestionBox();
    }
  };
  openCreateQuestionBox = () => {
    this.setState({
      showCreateQuestionBox: true
    });
  };
  closeCreateQuestionBox = () => {
    this.setState({
      showCreateQuestionBox: false
    });
  };
>>>>>>> 35f8800046a3695423af9237e109d83f1c2794b7

  render() {
    console.log(this.state);
    var login_box;
    if (this.state.open_signin === true) {
      login_box = (
        <div className="login-wrap">
          <SignInFormWindow handle_close_button={this.handle_close_button}/>
        </div>
      );
    } else if (this.state.open_signup === true) {
      login_box = (
        <div className="login-wrap">
<<<<<<< HEAD
          <SignUpFormWindow handle_close_button={this.handle_close_button}/>
=======
          <SignUpFormWindow
            handle_close_button={this.handle_close_button}
            handle_login={this.handle_login}
          />
>>>>>>> 35f8800046a3695423af9237e109d83f1c2794b7
        </div>
      );
    } else {
      login_box = "";
    }

    return (
      <div>
        <NavigationBar
          handle_signup_button={this.handle_signup_button}
          handle_signin_button={this.handle_signin_button}/>{" "} {login_box}
        <div className="main">
<<<<<<< HEAD
          <QuestionList questionList={this.state.questionList}/>
        </div>
        <div className="footer-area">
          <Footer/>
=======
          <QuestionList
            handleAskQuestionButton={this.handleAskQuestionButton}
            showTopQuestions={this.state.showTopQuestions}
            title={this.state.title}
            username={this.state.username}
            questionList={this.state.questionList}
            createQuestion={this.createQuestion}
            answerQuestion={this.answerQuestion}
            handleShowTopQuestions={this.handleShowTopQuestions}
            showCreateQuestionBox={this.state.showCreateQuestionBox}
            closeCreateQuestionBox={this.closeCreateQuestionBox}
          />
        </div>
        <div className="footer-area">
          <Footer handle />
>>>>>>> 35f8800046a3695423af9237e109d83f1c2794b7
        </div>
      </div>
    );
  }
}
