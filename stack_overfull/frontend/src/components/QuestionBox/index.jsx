import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { VotingButtons, TagList } from "../../components";
import { formatDate } from "../../utils/api";

export class QuestionBox extends React.Component {
  handleChange = event => {
    this.setState({ answer: event.target.value });
  };

  render() {
    const {
      date_created,
      question_head,
      username,
      q_id,
      points,
      handleUpvoteButton,
      handleDownvoteButton,
      showButtons,
      tags
    } = this.props;

    let date = formatDate(date_created);

    return (
      <div className="question-box">
        <div style={{ display: "flex" }}>
          <Link to={`/question/${q_id}`} className="question-box__text">
            {question_head}
          </Link>
          <div className="question-box__points">
            {showButtons ? (
              <VotingButtons
                handleDownvoteButton={handleDownvoteButton}
                handleUpvoteButton={handleUpvoteButton}
                id={q_id}
                points={points}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="question-box__line" />
        <div style={{ display: "flex" }}>
          <TagList tags={tags} />
          <div className="question-box__user">
            Asked by {username} on {date}{" "}
          </div>
        </div>
      </div>
    );
  }
}
