import React from "react";
import { QuestionBox } from "../QuestionBox";
import "./index.css";
import { QuestionEdit } from "../QuestionEdit";

export class QuestionList extends React.Component {
  render() {
    const {
      handleAskQuestionButton,
      showTopQuestions,
      title,
      username,
      questionList,
      createQuestion,
      date_created,
      question_text,
      handleShowTopQuestions
    } = this.props;

    var page;
    if (showTopQuestions === true) {
      page = (
        <div className="question-list">
          {questionList.map((x, key) => (
            <QuestionBox
              key={key}
              date_created={x.date_created}
              question_text={x.question_text}
            />
          ))}
        </div>
      );
    } else if (showTopQuestions === false) {
      page = (
        <div className="question-list">
          {
            <QuestionEdit
              user={username}
              createQuestion={createQuestion}
              handleShowTopQuestions={handleShowTopQuestions}
            />
          }
        </div>
      );
    }

    var pageTitle;
    if (showTopQuestions === true) {
      pageTitle = (
        <div className="question-list-title">
          {" "}
          {title}
          <button
            onClick={() => handleAskQuestionButton()}
            style={{ color: "#ffffff" }}
          >
            Ask a question
          </button>
        </div>
      );
    } else if (showTopQuestions === false) {
      pageTitle = <div className="questionEdit-list-title"> {title} </div>;
    }

    return (
      <div className="question-list-wrapper">
        {pageTitle}
        {page}
      </div>
    );
  }
}
