import React from "react";
import "./index.css";

export class VotingButtons extends React.Component {
  render() {
    const { handleUpvoteButton, handleDownvoteButton, id, points } = this.props;

    return (
      <div className="VotingButtons">
        <button className="VotingButtons__button button" onClick={() => handleDownvoteButton(id)}>
        &#10134;
        </button>
        <div className="VotingButtons__votes">
          <div className="VotingButtons__votes__text">{points}&nbsp;</div>
        </div>
        <button className="VotingButtons__button button" onClick={() => handleUpvoteButton(id)}>
        &#10133;
        </button>
      </div>
    );
  }
}
