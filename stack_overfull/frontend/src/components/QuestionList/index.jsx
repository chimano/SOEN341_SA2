import React from "react";
import {QuestionBox} from "../QuestionBox";
import "./index.css";
import {
  voteQuestion
} from "../../components";

export class QuestionList extends React.Component {
  
  handleUpvoteButton = id => {
    console.log("ID IS: " + id);
    this.upvoteQuestion(id);
    //setTimeout(() => this.getQuestionList(), 500);
  };

  handleDownvoteButton = id => {
    console.log("ID IS: " + id);
    this.downvoteQuestion(id);
    //setTimeout(() => this.getQuestionList(), 500);
  };

  upvoteQuestion = id => {
    voteQuestion("UP", id);
  };

  downvoteQuestion = id => {
    voteQuestion("DOWN", id);
  };

  render() {
    const {
      questionList
    } = this.props;

    return (
      <div className="question-list-wrapper">
        <div className="question-list">
          {questionList.map((x, key) => (
            <QuestionBox
              key={key}
              date_created={((x.date_created).replace("T", " at ")).substring(0,19)}
              question_head={x.question_head}
              q_id={x.id}
              username={x.user_id.username}
              points={x.points}
              handleDownvoteButton={this.handleDownvoteButton}
              handleUpvoteButton={this.handleUpvoteButton}
            />
          ))}
        </div>
      </div>
    );
  }
}
