// @flow
import React from 'react';
import { QuestionBox } from '../../components';
import './index.css';

type Props = {
  questionList: Array<Object>,
};

const QuestionList = (props: Props) => {
  const { questionList } = props;
  return (
    <div className="page-width">
      <div className="QuestionList">
        {questionList.map((question, key) => (
          <QuestionBox
            key={key}
            dateCreated={question.date_created.replace('T', ' at ').substring(0, 19)}
            questionHead={question.question_head}
            questionId={question.id}
            username={question.user_id.username}
            tags={question.tags}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
