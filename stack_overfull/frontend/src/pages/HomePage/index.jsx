import React from "react";
<<<<<<< HEAD
import {NavigationBar, SignUpFormWindow, SignInFormWindow, QuestionList, Footer} from "../../components";
import "./index.css";
import axios from "axios";
import qs from "qs";
=======
import "./index.css";
import {
  QuestionList,
  Footer,
  QuestionEdit,
  AskQuestionButton
} from "../../components";
import {
  getApiQuestion,
  postApiQuestion,
  postApiAnswer,
  getApiUserMe
} from "../../utils/api";
>>>>>>> 11140b1ce13fbdc18ae5033e426f3c0106735f75

export class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreateQuestionBox: false,
      questionList: [],
      username: ""
    };
  }

<<<<<<< HEAD
    this.handle_signup_button = this
      .handle_signup_button
      .bind(this);
    this.handle_signin_button = this
      .handle_signin_button
      .bind(this);
    this.handle_close_button = this
      .handle_close_button
      .bind(this);

=======
  componentDidMount = () => {
    console.log("hello");
>>>>>>> 11140b1ce13fbdc18ae5033e426f3c0106735f75
    this.getQuestionList();
  };

  getQuestionList = () => {
<<<<<<< HEAD
    axios
      .get("/api/question/order=desc/limit=10/")
      .then(response => {
        console.log(response);
        this.setState({questionList: response.data.question_list});
      })
      .catch(function (error) {
        console.log(error);
=======
    getApiQuestion().then(list => {
      this.setState({
        questionList: list
>>>>>>> 11140b1ce13fbdc18ae5033e426f3c0106735f75
      });
    });
  };

  createQuestion = question => {
<<<<<<< HEAD
    axios
      .post("/api/question/", qs.stringify({question: question}))
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    setTimeout(() => this.getQuestionList(), 100);
  };

  answerQuestion(answer, q_id) {
    var parsedQ_id = parseInt(q_id);
    console.log("parsed_q_id", parsedQ_id);
    console.log("answer:", answer);
    axios
      .post("/api/answer/", qs.stringify({answer: answer, q_id: parsedQ_id}))
      .then(function (response) {
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

  handle_close_button = () => {
    this.setState({open_signin: false, open_signup: false});
  };
  handle_login = username => {
    this.setState({logged_in: true, username: username});
  };
  handle_logout = () => {
    this.setState({logged_in: false, username: ""});
  };
=======
    postApiQuestion(question);
    setTimeout(() => this.getQuestionList(), 100);
  };

>>>>>>> 11140b1ce13fbdc18ae5033e426f3c0106735f75
  handleAskQuestionButton = () => {
    getApiUserMe().then(response => {
      if (!response.data.error) {
        this.setState({
          username: response.data.username
        })
        this.openCreateQuestionBox();
      } else {
        alert("You need to Sign In to ask a question");        
      }
    });
  };

  openCreateQuestionBox = () => {
<<<<<<< HEAD
    this.setState({showCreateQuestionBox: true});
=======
    this.setState({ showCreateQuestionBox: true });
>>>>>>> 11140b1ce13fbdc18ae5033e426f3c0106735f75
  };

  closeCreateQuestionBox = () => {
<<<<<<< HEAD
    this.setState({showCreateQuestionBox: false});
=======
    this.setState({ showCreateQuestionBox: false });
>>>>>>> 11140b1ce13fbdc18ae5033e426f3c0106735f75
  };

  render() {
    console.log(this.state);
<<<<<<< HEAD
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
          <SignUpFormWindow
            handle_close_button={this.handle_close_button}
            handle_login={this.handle_login}/>
        </div>
=======

    const { showCreateQuestionBox, questionList, username } = this.state;

    let createQuestionBox;
    if (showCreateQuestionBox) {
      createQuestionBox = (
        <QuestionEdit
          user={username}
          createQuestion={this.createQuestion}
          closeCreateQuestionBox={this.closeCreateQuestionBox}
        />
>>>>>>> 11140b1ce13fbdc18ae5033e426f3c0106735f75
      );
    } else {
      createQuestionBox = "";
    }

    return (
<<<<<<< HEAD
      <div>
        <NavigationBar
          handle_signup_button={this.handle_signup_button}
          handle_signin_button={this.handle_signin_button}/>{" "} {login_box}
        <div className="main">
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
            closeCreateQuestionBox={this.closeCreateQuestionBox}/>
=======
      <div className="homepage-wrapper">
        <div className="homepage-box">
          <div className="question-list-title">
            <h3>TOP QUESTIONS</h3>
            <AskQuestionButton
              handleAskQuestionButton={this.handleAskQuestionButton}
            />
          </div>
          <QuestionList questionList={questionList} />
>>>>>>> 11140b1ce13fbdc18ae5033e426f3c0106735f75
        </div>
        {createQuestionBox}
        <div className="footer-area">
          <Footer handle/>
        </div>
      </div>
    );
  }
}
