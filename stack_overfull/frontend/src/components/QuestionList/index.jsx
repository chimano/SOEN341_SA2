import React from "react";
import { QuestionBox } from "../QuestionBox";
import "./index.css";
import { voteQuestion } from "../../utils/api";

export class QuestionList extends React.Component {
  /*
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
  };*/

  render() {
    const { questionList } = this.props;

    return (
      <div className="page-width">
        <div className="QuestionList">
          {questionList.map((question, key) => (
            <QuestionBox
              key={key}
              date_created={question.date_created
                .replace("T", " at ")
                .substring(0, 19)}
              question_head={question.question_head}
              q_id={question.id}
              username={question.user_id.username}
              tags={question.tags}
              showButtons
            />
          ))}
        </div>
      </div>
    );
  }
}
