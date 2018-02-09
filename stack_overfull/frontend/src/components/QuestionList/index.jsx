import React from "react";
import { QuestionBox } from "../QuestionBox";
import "./index.css";
import { QuestionEdit } from "../QuestionEdit";

export class QuestionList extends React.Component {
  render() {
    const {
      handleAskQuestionButton,
      username,
      questionList,
      createQuestion,
      showCreateQuestionBox,
      question_text,
      handleShowTopQuestions,
      date_created,
      answerQuestion,
      closeCreateQuestionBox
    } = this.props;

    let createQuestionBox;
    if(showCreateQuestionBox){
      createQuestionBox = 
      <QuestionEdit
        user={username}
        createQuestion={createQuestion}
        handleShowTopQuestions={handleShowTopQuestions}
        closeCreateQuestionBox={closeCreateQuestionBox}
      />
    }else{
      createQuestionBox = ""
    }

    return (
      <div className="question-list-wrapper">
        <div className="question-list-title">
          <h3>TOP QUESTIONS</h3>
          <button
            onClick={() => handleAskQuestionButton()}
            style={{ color: "#ffffff" }}
          >
            Ask a question
          </button>
        </div>
        <div className="question-list">
          {questionList.map((x, key) => (
            <QuestionBox
              key={key}
              date_created={x.date_created}
              question_text={x.question_text}
              q_id={x.id}
              answerQuestion={answerQuestion}
            />
          ))}
        </div>
        {createQuestionBox}
      </div>

    );
  }
}
