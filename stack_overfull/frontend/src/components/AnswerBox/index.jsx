// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import './index.css';
import { AcceptRejectButton, VotingButtons } from '../../components';
import { formatDate } from '../../utils/api';
import { QuestionBox } from '../QuestionBox';
import { Icon } from 'antd';

type Props = {
  handleAccept: () => {},
  handleReject: () => {},
  handleDownvoteButton: () => {},
  handleUpvoteButton: () => {},
  handleDeleteAnswer: () => {},
  verified: boolean,
  x: Object,
  upvotedArray: Array<Object>,
  downvotedArray: Array<Object>,
  username: string,
};

const AnswerBox = (props: Props) => {
  const {
    handleAccept,
    handleReject,
    handleDownvoteButton,
    handleUpvoteButton,
    handleDeleteAnswer,
    verified,
    x,
    upvotedArray,
    downvotedArray,
    username,
  } = props;

  let answerBoxClass;
  if (x.is_accepted) {
    answerBoxClass = 'AnswerBox--green';
  } else if (x.is_rejected) {
    answerBoxClass = 'AnswerBox--red';
  } else {
    answerBoxClass = 'AnswerBox--blue';
  }

  let deleteButtons;
  if (username === x.user_id.username) {
    deleteButtons = (
      <button className="AnswerBox__delete" onClick={() => handleDeleteAnswer(x.id)} type="primary">
        <Icon type="delete" />
      </button>
    );
  } else {
    deleteButtons = <div />;
  }

  const date = formatDate(x.date_created.replace('T', ' at ').substring(0, 19));

  return (
    <div className="AnswerBox__wrapper">
      <VotingButtons
        handleDownvoteButton={handleDownvoteButton}
        handleUpvoteButton={handleUpvoteButton}
        id={x.id}
        points={x.points}
        upvotedArray={upvotedArray}
        downvotedArray={downvotedArray}
      />
      <div className={`AnswerBox ${answerBoxClass}`}>
        <div className="AnswerBox__row">
          <div className="AnswerBox__answer">{x.answer_text}</div>
        </div>
        <Divider />
        <div className="AnswerBox__row">
          <div className="AnswerBox__row">
            <div className="AnswerBox__button-area">
              {verified ? (
                <AcceptRejectButton
                  handleAccept={() => handleAccept(x.id)}
                  handleReject={() => handleReject(x.id)}
                  accepted={x.is_accepted}
                  rejected={x.is_rejected}
                  a_id={x.id}
                />
              ) : (
                ''
              )}
            </div>
            <div className="AnswerBox__username">
              Answered by&nbsp;<Link to={`/user/${x.user_id.username}`}>{x.user_id.username}</Link>&nbsp;on{' '}
              {date}
              &nbsp;
              {deleteButtons}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerBox;
