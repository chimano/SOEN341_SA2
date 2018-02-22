import React from "react";
import "./index.css";
import { AcceptRejectButton } from "../AcceptRejectButton";

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

    var answerBox_class;
    if (x.is_accepted) {
      answerBox_class = "answerBox--green";
    } else if (x.is_rejected) {
      answerBox_class = "answerBox--red";
    } else {
      answerBox_class = "answerBox--blue";
    }

    return (
      <div>
        <div className={"answerBox " + answerBox_class}>
          <div className="answer-page__username">{x.user_id.username}</div>
          <div className="answerText">{x.answer_text}</div>
          <div className="dateText">
            {x.date_created.replace("T", " at ").substring(0, 19)}
          </div>
          <table className="votingArea">
            <tbody>
              <tr>
                <td>
                  <button
                    className="votes"
                    onClick={() => handleDownvoteButton(x.id)}
                  >
                    -
                  </button>
                </td>
                <td>
                  <div>{x.points} vote(s)</div>
                </td>
                <td>
                  <button
                    className="votes"
                    onClick={() => handleUpvoteButton(x.id)}
                  >
                    +
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
    );
  }
}
