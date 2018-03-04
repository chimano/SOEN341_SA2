import React from "react";
import "./index.css";
import { AcceptRejectButton, VotingButtons } from "../../components";

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

    console.log("verified: ",verified);

    let answerBox_class;
    if (x.is_accepted) {
      answerBox_class = "AnswerBox--green";
    } else if (x.is_rejected) {
      answerBox_class = "AnswerBox--red";
    } else {
      answerBox_class = "AnswerBox--blue";
    }

    return (
      <div>
        <div className={"AnswerBox " + answerBox_class}>
          <div>{x.user_id.username}</div>
          <div className="AnswerBox__answer">{x.answer_text}</div>
          <div className="AnswerBox__date">
            {x.date_created.replace("T", " at ").substring(0, 19)}
          </div>
          <div className="AnswerBox__button-area">
            <VotingButtons
              handleDownvoteButton={handleDownvoteButton}
              handleUpvoteButton={handleUpvoteButton}
              id={x.id}
              points={x.points}
            />
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
        </div>
      </div>
    );
  }
}
