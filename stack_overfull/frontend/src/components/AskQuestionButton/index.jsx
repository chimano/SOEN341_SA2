import React from "react";

export class AskQuestionButton extends React.Component {
  render() {

    const {handleAskQuestionButton} = this.props;

    return (
      <button
        onClick={() => handleAskQuestionButton()}
        style={{ color: "#ffffff" }}
      >
        Ask a question
      </button>
    );
  }
}
