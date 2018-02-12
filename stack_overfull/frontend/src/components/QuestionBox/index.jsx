import React from "react";
import "./index.css";
import {Link} from "react-router-dom";

export class QuestionBox extends React.Component {

  render() {
    const { date_created, question_text, user, q_id } = this.props;

    return (
      <div className="question-wrapper">
      <Link to={"/question/"+q_id}>
        <div className="question">
          <div className="question-extra-info">
            <div className="question-text">{question_text}</div>
            {/* <a className="question-user">{user}</a> */}
            <div className="question-count">
              {/* <div>{date_created}</div>
                            <div>Votes</div> */}
            </div>
          </div>
          <div className="question-date">{date_created}</div>
          <div className="line" />
        </div>
        </Link>
      </div>
    );
  }
}
