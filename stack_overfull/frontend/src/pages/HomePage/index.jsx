import React from "react";
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
import { postApiUserLogout } from "../../utils/api";

export class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreateQuestionBox: false,
      questionList: [],
      username: ""
    };
  }

  componentDidMount = () => {
    this.getQuestionList();
  };

  getQuestionList = () => {
    getApiQuestion("desc", 36, "date_created").then(response => {
      this.setState({
        questionList: response.data.question_list
      });
    });
  };

  createQuestion = question => {
    postApiQuestion(question);
    setTimeout(() => this.getQuestionList(), 100);
  };

  answerQuestion(answer, q_id) {
    var parsedQ_id = parseInt(q_id);
    // console.log("parsed_q_id", parsedQ_id);
    // console.log("answer:", answer);
    postApiAnswer(answer, q_id);
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
    getApiUserMe().then(response => {
      if (!response.error) {
        this.setState({ logged_in: true, username: response.data.username });
      }
    });
  };
  handle_logout = () => {
    postApiUserLogout();
    this.setState({ logged_in: false, username: "" });
  };
  handleAskQuestionButton = () => {
    getApiUserMe().then(response => {
      if (!response.data.error) {
        this.setState({
          username: response.data.username
        });
        this.openCreateQuestionBox();
      } else {
        alert("You need to Sign In to ask a question");
      }
    });
  };

  openCreateQuestionBox = () => {
    this.setState({ showCreateQuestionBox: true });
  };

  closeCreateQuestionBox = () => {
    this.setState({ showCreateQuestionBox: false });
  };

  render() {
    console.log("HomePage state: ",this.state);

    const { showCreateQuestionBox, questionList, username } = this.state;

    let createQuestionBox;
    if (showCreateQuestionBox) {
      createQuestionBox = (
        <QuestionEdit
          user={username}
          createQuestion={this.createQuestion}
          closeCreateQuestionBox={this.closeCreateQuestionBox}
        />
      );
    } else {
      createQuestionBox = "";
    }

    return (
      <div className="homepage-wrapper">
        <div className="homepage-box">
          <div className="question-list-title">
            <h3>TOP QUESTIONS</h3>
            <AskQuestionButton
              handleAskQuestionButton={this.handleAskQuestionButton}
            />
          </div>
          <QuestionList questionList={questionList} />
        </div>
        {createQuestionBox}
      </div>
    );
  }
}
