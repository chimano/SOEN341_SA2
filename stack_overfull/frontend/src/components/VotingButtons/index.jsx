import React from 'react';
import { Icon } from 'antd';
import './index.css';

type Props = {
  handleUpvoteButton: () => {},
  handleDownvoteButton: () => {},
  id: number,
  points: number,
  upvotedArray: Array<Object>,
  downvotedArray: Array<Object>,
};

const VotingButtons = (props: Props) => {
  const {
    handleUpvoteButton,
    handleDownvoteButton,
    id,
    points,
    upvotedArray,
    downvotedArray,
  } = props;

  let buttonClassUp;
  let buttonClassDown;

  if (upvotedArray.indexOf(id) !== -1) {
    buttonClassUp = 'VotingButtons--selected';
    buttonClassDown = 'VotingButtons--default';
  } else if (downvotedArray.indexOf(id) !== -1) {
    buttonClassUp = 'VotingButtons--default';
    buttonClassDown = 'VotingButtons--selected';
  } else {
    buttonClassUp = 'VotingButtons--default';
    buttonClassDown = 'VotingButtons--default';
  }

  return (
    <div className="VotingButtons">
      <button
        className={`VotingButtons__button ${buttonClassUp} button`}
        onClick={() => handleUpvoteButton(id)}
      >
        <Icon type="caret-up" />
      </button>
      <div className="VotingButtons__votes">
        <div className="VotingButtons__votes__text">&nbsp;{points}</div>
      </div>
      <button
        className={`VotingButtons__button ${buttonClassDown} button`}
        onClick={() => handleDownvoteButton(id)}
      >
        <Icon type="caret-down" />
      </button>
    </div>
  );
};

export default VotingButtons;
