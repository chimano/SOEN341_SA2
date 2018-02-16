import React from "react";

export class AskQuestionButton extends React.Component {
  render() {

    const {handleAskQuestionButton} = this.props;

    return (
      <button type="button"
        onClick={() => handleAskQuestionButton()}
      >
        Ask a question
      </button>
    );
  }
}
