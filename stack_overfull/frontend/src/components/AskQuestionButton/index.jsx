// @flow
import React from 'react';

type Props = {
  handleAskQuestionButton: () => {},
};

const AskQuestionButton = (props: Props) => {
  const { handleAskQuestionButton } = props;

  return (
    <button className="button" type="button" onClick={() => handleAskQuestionButton()}>
      Ask a question
    </button>
  );
};

export default AskQuestionButton;
