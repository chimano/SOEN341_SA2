import React from "react";
import "./index.css";
import { QuestionList } from "../../components";

export class UserQuestionList extends React.Component {
  render() {
    const {
      upvoted_questions,
      downvoted_questions,
      questions_asked,
      questions_answered,
      current_tab
    } = this.props;

    let title;
    let showQuestions;
    // title = (<h3> Questions </h3>);
    if(current_tab == "questionasked") {
      title = ( <h3>Questions Asked</h3> );
      showQuestions = (
        <QuestionList questionList={questions_asked} />
      );
    } else if(current_tab == "questionanswered") {
      title = ( <h3>Questions Answered</h3> );
      showQuestions = (
        <QuestionList questionList={questions_answered} />
      );
    } else if(current_tab == "upvotedquestion") {
      title = ( <h3>Upvoted Questions</h3> );
      showQuestions = (
        <QuestionList questionList={upvoted_questions} />
      );
    } else if(current_tab == "downvotedquestion") {
      title = ( <h3>Downvoted Question</h3> );
      showQuestions = (
        <QuestionList questionList={downvoted_questions} />
      );
    }
    return (
      <div className="UserQuestionList" style={{ paddingTop: "30px"}}>
        {title}
        {showQuestions}
      </div>
    );
  }
}
