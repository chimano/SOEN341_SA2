// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import './index.css';
import { AcceptRejectButton, VotingButtons } from '../../components';
import { formatDate } from '../../utils/api';

type Props = {
  handleAccept: () => {},
  handleReject: () => {},
  handleDownvoteButton: () => {},
  handleUpvoteButton: () => {},
  verified: boolean,
  x: Object,
  upvotedArray: Array<Object>,
  downvotedArray: Array<Object>,
};

const AnswerBox = (props: Props) => {
  const {
    handleAccept,
    handleReject,
    handleDownvoteButton,
    handleUpvoteButton,
    verified,
    x,
    upvotedArray,
    downvotedArray,
  } = props;

  let answerBoxClass;
  if (x.isAccepted) {
    answerBoxClass = 'AnswerBox--green';
  } else if (x.isRejected) {
    answerBoxClass = 'AnswerBox--red';
  } else {
    answerBoxClass = 'AnswerBox--blue';
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
          <div className="AnswerBox__button-area">
            {verified ? (
              <AcceptRejectButton
                handleAccept={handleAccept}
                handleReject={handleReject}
                accepted={x.isAccepted}
                rejected={x.isRejected}
                a_id={x.id}
              />
            ) : (
              ''
            )}
          </div>
          <div className="AnswerBox__username">
            Answered by&nbsp;<Link to={`/user/${x.user_id.username}`}>{x.user_id.username}</Link>&nbsp;on{' '}
            {date}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerBox;
