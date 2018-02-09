import React from "react";
import "./index.css";

export class QuestionEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            question: ''
        };
      }

  handleSubmitQuestionButton = () => {
    const {createQuestion, handleShowTopQuestions} = this.props;
    createQuestion(this.state.question);
    handleShowTopQuestions(true);
  }

  handleChange = (event) => {
    this.setState({question: event.target.value});
  }

  render() {
    const { user } = this.props;

    return (
      <div className="questionEdit-wrapper">
        <div className="questionEdit">
          <div className="question-extra-info">
            <a className="question-user">{user}</a>
          </div>
          <div className="line" />
          <div className="questionEdit-title">
            Question :
            <textarea className="questionTitle" onChange={(e) => this.handleChange(e)}/>
          </div>
        </div>
        <button
          className="questionEdit-button"
          onClick={() => this.handleSubmitQuestionButton()}
          style={{ color: "#ffffff" }}
        >
          Submit question
        </button>
      </div>
    );
  }
}
