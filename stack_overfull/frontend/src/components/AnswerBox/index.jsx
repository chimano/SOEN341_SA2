import React from "react";
import "./index.css";
import { QuestionBox } from "../QuestionBox";
import { AcceptRejectButton, VotingButtons } from "../../components";
import { Link } from "react-router-dom";

import {
  formatDate,
  getApiUserMe
} from "../../utils/api";

import { Divider } from "antd";

export class AnswerBox extends React.Component {
  
  render() {
    const {
      handleAccept,
      handleReject,
      handleDownvoteButton,
      handleUpvoteButton,
      verified,
      x,
      upvoted_array,
      downvoted_array
    } = this.props;

    console.log("verified: ", verified);

    let answerBox_class;
    if (x.is_accepted) {
      answerBox_class = "AnswerBox--green";
    } else if (x.is_rejected) {
      answerBox_class = "AnswerBox--red";
    } else {
      answerBox_class = "AnswerBox--blue";
    }

    console.log("UOVOTED: "+upvoted_array);
    console.log("DOWNVOTED: "+downvoted_array);
    let date = formatDate(x.date_created.replace("T", " at ").substring(0, 19));

    return (
      <div className="AnswerBox__wrapper">
        <VotingButtons
              handleDownvoteButton={handleDownvoteButton}
              handleUpvoteButton={handleUpvoteButton}
              id={x.id}
              points={x.points}
              upvoted_array={upvoted_array}
              downvoted_array={downvoted_array}
            />
        <div className={`AnswerBox ${answerBox_class}`}>
          <div className="AnswerBox__row">
            <div className="AnswerBox__answer">{x.answer_text}</div>
          </div>
          <Divider />
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
                ""
              )}
            </div>
            <div className="AnswerBox__username">
              Answered by&nbsp;<Link to={`/user/${x.user_id.username}`}>{x.user_id.username}</Link>&nbsp;on {date}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
