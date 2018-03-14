import React from "react";
import "./index.css";
import { QuestionBox } from "../QuestionBox";
import { AcceptRejectButton, VotingButtons } from "../../components";
import { formatDate } from "../../utils/api";
import { Divider } from "antd";

export class AnswerBox extends React.Component {
  render() {
    const {
      handleAccept,
      handleReject,
      handleDownvoteButton,
      handleUpvoteButton,
      verified,
      x
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

    let date = formatDate(x.date_created.replace("T", " at ").substring(0, 19));

    return (
      <div>
        <div className={"AnswerBox " + answerBox_class}>
          <div className="AnswerBox__row">
            <div className="AnswerBox__answer">{x.answer_text}</div>

            <VotingButtons
              handleDownvoteButton={handleDownvoteButton}
              handleUpvoteButton={handleUpvoteButton}
              id={x.id}
              points={x.points}
            />
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
              Asked by&nbsp;<a>{x.user_id.username}</a>&nbsp;on {date}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
