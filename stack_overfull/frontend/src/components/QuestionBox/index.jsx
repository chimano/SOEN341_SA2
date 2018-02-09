import React from "react";
import "./index.css";

export class QuestionBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: ""
    };
  }
  handleReplyButton = q_id => {
    console.log("ID IS : " + q_id);
    const { answerQuestion } = this.props;
    answerQuestion(this.state.answer, q_id);
  };

  handleChange = event => {
    this.setState({ answer: event.target.value });
  };

  render() {
    const { date_created, question_text, user, q_id } = this.props;

    return (
      <div className="question-wrapper">
        <div className="question">
          <div className="question-extra-info">
            <div className="question-text">{question_text}</div>
            {/* <a className="question-user">{user}</a> */}
            <div className="question-count">
              {/* <div>{date_created}</div>
                            <div>Votes</div> */}
            </div>
          </div>
          <div className="question-date">{date_created}</div>
          <div className="line" />
          <div style={{ display: "flex" }}>
            <textarea
              className="questionBox__answer-text"
              onChange={e => this.handleChange(e)}
            />
            {/* <div className="question-title">{question_text}</div> */}
            {/* <button className="replyButton" onClick={() => this.handleReplyButton(boxId)} value={this.boxId}>Reply</button> */}
            <button
              className="questionBox__reply-button"
              onClick={() => this.handleReplyButton(q_id)}
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    );
  }
}
