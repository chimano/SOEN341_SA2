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
    console.log("hello");
    this.getQuestionList();
  };

  getQuestionList = () => {
    getApiQuestion().then(list => {
      this.setState({
        questionList: list
      });
    });
  };

  createQuestion = question => {
    postApiQuestion(question);
    setTimeout(() => this.getQuestionList(), 100);
  };

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
    this.setState({ showCreateQuestionBox: true });
  };

  closeCreateQuestionBox = () => {
    this.setState({ showCreateQuestionBox: false });
  };

  render() {
    console.log(this.state);

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
        <div className="footer-area">
          <Footer/>
        </div>
      </div>
    );
  }
}
