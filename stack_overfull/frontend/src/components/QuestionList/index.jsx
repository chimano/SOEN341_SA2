import React from "react";
import { QuestionBox } from "../QuestionBox";
import "./index.css";
import { voteQuestion } from "../../utils/api";

export class QuestionList extends React.Component {
  handleUpvoteButton = id => {
    const { getQuestionList } = this.props;
    console.log("ID IS: " + id);
    voteQuestion("UP", id)
      .then(() => {
        setTimeout(() => getQuestionList(), 500);
      })
      .catch(error => console.log(error));
  };

  handleDownvoteButton = id => {
    const { getQuestionList } = this.props;
    console.log("ID IS: " + id);
    voteQuestion("DOWN", id)
      .then(() => {
        setTimeout(() => getQuestionList(), 500);
      })
      .catch(error => console.log(error));
  };

  render() {
    const { questionList } = this.props;

    return (
      <div className="question-list-wrapper">
        <div className="question-list">
          {questionList.map((x, key) => (
            <QuestionBox
              key={key}
              date_created={x.date_created
                .replace("T", " at ")
                .substring(0, 19)}
              question_head={x.question_head}
              q_id={x.id}
              username={x.user_id.username}
              points={x.points}
              handleDownvoteButton={this.handleDownvoteButton}
              handleUpvoteButton={this.handleUpvoteButton}
            />
          ))}
        </div>
      </div>
    );
  }
}
