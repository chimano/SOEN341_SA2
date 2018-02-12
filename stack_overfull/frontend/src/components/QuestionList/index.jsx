import React from "react";
import {QuestionBox} from "../QuestionBox";
import "./index.css";

export class QuestionList extends React.Component {
  render() {
<<<<<<< HEAD
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
=======
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
>>>>>>> 11140b1ce13fbdc18ae5033e426f3c0106735f75
        </div>
      </div>
    );
  }
}
