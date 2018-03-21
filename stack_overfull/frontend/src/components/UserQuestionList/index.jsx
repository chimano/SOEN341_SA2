import React from "react";
import { QuestionList } from "../../components";

export class UserQuestionList extends React.Component {
  render() {
    const {
      upvoted_questions,
      downvoted_questions,
      questions_asked,
      questions_answered
    } = this.props;
    return (
      <div style={{ paddingTop: "30px" }}>
        <h3>Upvoted Questions</h3>
        <QuestionList questionList={upvoted_questions} />
        <h3>Downvoted Questions</h3>
        <QuestionList questionList={downvoted_questions} />
        <h3>Questions Asked</h3>
        <QuestionList questionList={questions_asked} />
        <h3>Questions Answered</h3>
        <QuestionList questionList={questions_answered} />
      </div>
    );
  }
}
