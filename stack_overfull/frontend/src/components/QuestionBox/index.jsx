import React from "react";
import "./index.css";
import { Link } from "react-router-dom";

export class QuestionBox extends React.Component {

  handleChange = event => {
    this.setState({ answer: event.target.value });
  };

  render() {
    const { date_created, question_text, username, q_id, points } = this.props;

    return (
      <div className="question-wrapper">
        <div className="question">
          <div className="question-extra-info">
            <Link to={"/question/" + q_id}>
              <div className="question-text">{question_text}</div>
            </Link>
            <div className="question-user">{username}</div>
            <div>{points}</div>
          </div>
          <div className="line" />
          <div className="question-date">{date_created}</div>
          {/* <div className="line" /> */}
        </div>
      </div>
    );
  }
}
