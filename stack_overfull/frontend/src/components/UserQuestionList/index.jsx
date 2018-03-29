import React from 'react';
import './index.css';
import { QuestionList } from '../../components';

type Props = {
  upvotedQuestions: Array<Object>,
  downvotedQuestions: Array<Object>,
  questionsAsked: Array<Object>,
  questionsAnswered: Array<Object>,
  current_tab: string,
};

const UserQuestionList = (props: Props) => {
  const {
    upvotedQuestions,
    downvotedQuestions,
    questionsAsked,
    questionsAnswered,
    current_tab,
  } = props;

  console.log(props);

  let title;
  let showQuestions;
  // title = (<h3> Questions </h3>);
  if (current_tab == 'questionasked') {
    title = <h3>Questions Asked</h3>;
    showQuestions = <QuestionList questionList={questionsAsked} />;
  } else if (current_tab == 'questionanswered') {
    title = <h3>Questions Answered</h3>;
    showQuestions = <QuestionList questionList={questionsAnswered} />;
  } else if (current_tab == 'upvotedquestion') {
    title = <h3>Upvoted Questions</h3>;
    showQuestions = <QuestionList questionList={upvotedQuestions} />;
  } else if (current_tab == 'downvotedquestion') {
    title = <h3>Downvoted Question</h3>;
    showQuestions = <QuestionList questionList={downvotedQuestions} />;
  }

  return (
    <div className="UserQuestionList" style={{ paddingTop: '30px' }}>
      {title}
      {showQuestions}
    </div>
  );
};

export default UserQuestionList;
