import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { VotingButtons } from "../../components";

export class QuestionBox extends React.Component {
  handleChange = event => {
    this.setState({ answer: event.target.value });
  };

  monthToText(monthRaw) {
    switch (monthRaw) {
      case "01":
        return "January";
      case "02":
        return "February";
      case "03":
        return "March";
      case "04":
        return "April";
      case "05":
        return "May";
      case "06":
        return "June";
      case "07":
        return "July";
      case "08":
        return "August";
      case "09":
        return "September";
      case "10":
        return "October";
      case "11":
        return "November";
      case "12":
        return "December";
      default:
        return "error";
    }
  }

  dayFormat(dayRaw) {
    switch (dayRaw) {
      case "01":
        return "st";
      case "02":
        return "nd";
      case "03":
        return "rd";
      default:
        return "th";
    }
  }

  render() {
    const {
      date_created,
      question_head,
      username,
      q_id,
      points,
      handleUpvoteButton,
      handleDownvoteButton
    } = this.props;

    /** Extracts year, month, day and time from the date_created */
    const year = date_created.substring(0, 4);
    const monthRaw = date_created.substring(5, 7);
    const dayRaw = date_created.substring(8, 10);
    const time = date_created.substring(11, 19);

    /** The following variables will call their respective method
     *  For month, it will convert the month number to a text
     *  For day, it will get the appropriate suffix
     */
    let month = this.monthToText(monthRaw);
    let daySuffix = this.dayFormat(dayRaw);

    /** Initially, date will have the raw date */
    let date = date_created;
    /** If month does not return "error", then date will have the
     *  date format in a specific order with suffix and converted month.
     *
     *  If month returns "error", then show the raw date
     */
    if (month !== "error") {
      date = month + " " + dayRaw + daySuffix + " " + year + " " + time;
    }

    return (
      <div className="question-box">
        <div style={{ display: "flex" }}>
          <div className="question-box__user">
            Asked by {username} on {date}{" "}
          </div>
          <div className="question-box__points">
          <VotingButtons 
            handleDownvoteButton={handleDownvoteButton}
            handleUpvoteButton={handleUpvoteButton}
            id={q_id}
            points={points}
          />
          </div>
        </div>
        <div className="question-box__line" />
        <Link to={`/question/${q_id}`} className="question-box__text">
          {question_head}
        </Link>
        {/* <div className="question-box__line" /> */}
        {/* <div className="question-box__date">{date}</div> */}
      </div>
    );
  }
}
