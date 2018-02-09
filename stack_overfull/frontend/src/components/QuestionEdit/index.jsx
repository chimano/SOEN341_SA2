import React from "react";
import "./index.css";

export class QuestionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: ""
    };
  }

  handleSubmitQuestionButton = () => {
    const { createQuestion, closeCreateQuestionBox } = this.props;
    createQuestion(this.state.question);
    closeCreateQuestionBox();
  };

  handleChange = event => {
    this.setState({ question: event.target.value });
  };

  render() {
    const { user, closeCreateQuestionBox } = this.props;

    return (
      <div className="questionEdit-floating-box">
        <div className="questionEdit-wrapper">
          <div
            className="questionEdit__close-button"
            onClick={() => closeCreateQuestionBox()}
          >
            &#10005;
          </div>

          <div className="questionEdit">
            <a className="questionEdit-user">{user}</a>
            <div className="line" />
            <h3>Ask a question to the community</h3>
            <div className="questionEdit-title">Question :</div>
            <textarea
              className="questionEdit-text"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <button
            className="questionEdit-button"
            onClick={() => this.handleSubmitQuestionButton()}
            style={{ color: "#ffffff" }}
          >
            Submit question
          </button>
        </div>
      </div>
    );
  }
}
