// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import './index.css';
import { TagList } from '../../components';
import { formatDate } from '../../utils/api';

type Props = {
  dateCreated: string,
  questionHead: string,
  username: string,
  questionId: number,
  tags: Array<string>,
};

const QuestionBox = (props: Props) => {
  const {
    dateCreated, questionHead, username, questionId, tags,
  } = props;

  const date = formatDate(dateCreated);

  return (
    <div className="QuestionBox grey-border">
      <div style={{ display: 'flex' }}>
        <Link to={`/question/${questionId}`} className="QuestionBox__text">
          {questionHead}
        </Link>
      </div>
      <Divider />
      <div style={{ display: 'flex' }}>
        <TagList tags={tags} />
        <div className="QuestionBox__user">
          Asked by <Link to={`/user/${username}`}>{username}</Link> on {date}{' '}
        </div>
      </div>
    </div>
  );
};
export default QuestionBox;
