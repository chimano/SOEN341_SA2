import React from 'react';
import { QuestionList } from '../../components';

type Props = {
  upvotedQuestions: Array<Object>,
  downvotedQuestions: Array<Object>,
  questionsAsked: Array<Object>,
  questionsAnswered: Array<Object>,
};

const UserQuestionList = (props: Props) => {
  const {
    upvotedQuestions, downvotedQuestions, questionsAsked, questionsAnswered,
  } = props;

  console.log(props);
  return (
    <div style={{ paddingTop: '30px' }}>
      <h3>Upvoted Questions</h3>
      <QuestionList questionList={upvotedQuestions} />
      <h3>Downvoted Questions</h3>
      <QuestionList questionList={downvotedQuestions} />
      <h3>Questions Asked</h3>
      <QuestionList questionList={questionsAsked} />
      <h3>Questions Answered</h3>
      <QuestionList questionList={questionsAnswered} />
    </div>
  );
};

export default UserQuestionList;
