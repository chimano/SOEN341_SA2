// @flow
import React from 'react';
import './index.css';
import { QuestionList } from '../../components';

type Props = {
  upvotedQuestions: Array<Object>,
  downvotedQuestions: Array<Object>,
  questionsAsked: Array<Object>,
  questionsAnswered: Array<Object>,
  currentTab: string,
};

const UserQuestionList = (props: Props) => {
  const {
    upvotedQuestions,
    downvotedQuestions,
    questionsAsked,
    questionsAnswered,
    currentTab,
  } = props;

  let title;
  let showQuestions;
  // title = (<h3> Questions </h3>);
  if (currentTab === 'questionasked') {
    title = <h3>Questions Asked</h3>;
    showQuestions = <QuestionList questionList={questionsAsked} />;
  } else if (currentTab === 'questionanswered') {
    title = <h3>Questions Answered</h3>;
    showQuestions = <QuestionList questionList={questionsAnswered} />;
  } else if (currentTab === 'upvotedquestion') {
    title = <h3>Upvoted Questions</h3>;
    showQuestions = <QuestionList questionList={upvotedQuestions} />;
  } else if (currentTab === 'downvotedquestion') {
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
