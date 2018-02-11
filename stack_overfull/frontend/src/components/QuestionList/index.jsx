import React from "react";
import {QuestionBox} from "../QuestionBox";
import "./index.css";

export class QuestionList extends React.Component {
  render() {
    var {questionList} = this.props;

    return (
      <div className="question-list-wrapper">
        <div className="question-list-title">TOP QUESTIONS</div>
        <div className="question-list">
          {questionList.map(x => (<QuestionBox
            questionTitle={x.question_text}
            numVotes="1"
            numAnswers="1"
            user="bob"/>))}
        </div>
      </div>
    );
  }
}
