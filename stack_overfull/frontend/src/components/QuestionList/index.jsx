import React from "react";
import { QuestionBox } from "../QuestionBox";
import "./index.css";

export class QuestionList extends React.Component {
  render() {
    const {
      questionList
    } = this.props;

    return (
      <div className="question-list-wrapper">
        <div className="question-list">
          {questionList.map((x, key) => (
            <QuestionBox
              key={key}
              date_created={x.date_created}
              question_text={x.question_text}
              q_id={x.id}
            />
          ))}
        </div>
      </div>

    );
  }
}
