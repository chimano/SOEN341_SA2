import React from "react";
import "./index.css";
import { Link } from "react-router-dom";

export class QuestionBox extends React.Component {
  handleChange = event => {
    this.setState({ answer: event.target.value });
  };

  render() {
    const { date_created, question_head, username, q_id, points } = this.props;

    return (
      <div className="question-box">
        <div style={{ display: "flex" }}>
          <div className="question-box__user">{username}</div>
          <div>{points}</div>
        </div>
        <Link to={`/question/${q_id}`} className="question-box__text">
          {question_head}
        </Link>
        <div className="question-box__line" />
        <div className="question-box__date">{date_created}</div>
      </div>
    );
  }
}
