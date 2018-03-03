import React from "react";
import "./index.css";
import {
  QuestionList,
  QuestionEdit,
  AskQuestionButton
} from "../../components";
import {
  getApiQuestion,
  postApiQuestion,
  postApiAnswer
} from "../../utils/api";

export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateQuestionBox: false,
      questionList: []
    };
  }

  componentDidMount = () => {
    this.getQuestionList();
  };

  getQuestionList = () => {
    getApiQuestion("desc", 36, "date_created")
      .then(response => {
        this.setState({
          console.log("get question list: ", response);
          questionList: response.data.question_list
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  createQuestion = question => {
    postApiQuestion(question).catch(error => console.log(error));
    setTimeout(() => this.getQuestionList(), 100);
  };

  answerQuestion(answer, q_id) {
    postApiAnswer(answer, q_id).catch(error => console.log(error));
  }

  handleAskQuestionButton = () => {
    const { verifyLogin } = this.props;
    verifyLogin().then(logged_in => {
      if (logged_in) {
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
    console.log("HomePage state: ", this.state);

    const { showCreateQuestionBox, questionList } = this.state;
    const { username } = this.props;

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
      <div className="HomePage-wrapper">
        <div className="HomePage page-width">
          <div className="HomePage__question-list-title">
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
