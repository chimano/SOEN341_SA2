import React from "react";
import "./index.css";

export class QuestionBox extends React.Component {
  handleReplyButton(boxId) {
    console.log("ID IS : " + boxId);
  }

  render() {
    const { date_created, question_text, user, boxId } = this.props;

    return (
      <div className="question-wrapper">
        <div className="question">
          <div className="question-extra-info">
            <a className="question-user">{user}</a>
            <div className="question-count">
              <div>Votes</div>
            </div>
          </div>
          <div className="line" />
          <div className="question-text">{question_text}</div>
          <div className="question-date">{date_created}</div>
          {/* <button className="replyButton" onClick={() => this.handleReplyButton(boxId)} value={this.boxId}>Reply</button> */}
          <button className="replyButton" onClick={this.props.onClick}>
            Reply
          </button>
        </div>
      </div>
    );
  }
}
