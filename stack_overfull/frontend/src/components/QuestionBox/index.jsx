import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { VotingButtons, TagList } from "../../components";
import { formatDate } from "../../utils/api";
import { Divider } from "antd";

export class QuestionBox extends React.Component {
  handleChange = event => {
    this.setState({ answer: event.target.value });
  };

  render() {
    const {
      date_created,
      question_head,
      username,
      q_id,
      showButtons,
      tags
    } = this.props;

    let date = formatDate(date_created);

    return (
      <div className="QuestionBox grey-border">
        <div style={{ display: "flex" }}>
          <Link to={`/question/${q_id}`} className="QuestionBox__text">
            {question_head}
          </Link>
        </div>
        <Divider />
        <div style={{ display: "flex" }}>
          <TagList tags={tags} />
          <div className="QuestionBox__user">
            Asked by <Link to={`/user/${username}`}>{username}</Link> on {date}{" "}
          </div>
        </div>
      </div>
    );
  }
}
