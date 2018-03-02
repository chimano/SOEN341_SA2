import React from "react";
import {QuestionBox} from "../QuestionBox";
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
              date_created={((x.date_created).replace("T", " at ")).substring(0,19)}
              question_head={x.question_head}
              q_id={x.id}
              username={x.user_id.username}
              points={x.points}
            />
          ))}
        </div>
      </div>
    );
  }
}
