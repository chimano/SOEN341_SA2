import React from "react";
import "./index.css";
import { Icon } from "antd";

export class VotingButtons extends React.Component {
  render() {
    const { handleUpvoteButton, handleDownvoteButton, id, points } = this.props;

    return (
      <div className="VotingButtons">
        <button
          className="VotingButtons__button button"
          onClick={() => handleDownvoteButton(id)}
        >
          <Icon type="minus" />
        </button>
        <div className="VotingButtons__votes">
          <div className="VotingButtons__votes__text">{points}&nbsp;</div>
        </div>
        <button
          className="VotingButtons__button button"
          onClick={() => handleUpvoteButton(id)}
        >
          <Icon type="plus" />
        </button>
      </div>
    );
  }
}
