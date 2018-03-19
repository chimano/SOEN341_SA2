import React from "react";
import { QuestionBox } from "../QuestionBox";
import "./index.css";
import { voteQuestion } from "../../utils/api";

export class QuestionList extends React.Component {

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
