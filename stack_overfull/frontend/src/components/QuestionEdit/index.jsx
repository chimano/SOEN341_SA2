import React from "react";
import "./index.css";
import { Select } from "antd";

const Option = Select.Option;

const children = [];
{
  children.push();
}

export class QuestionEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question_head: "",
      question_text: "",
      tags: []
    };
  }

  handleSubmitQuestionButton = () => {
    const { createQuestion, closeCreateQuestionBox } = this.props;
    createQuestion(this.state);
    closeCreateQuestionBox();
  };

  handleChange = (event, name) => {
    this.setState({ [name]: event.target.value });
  };

  handleTagsChange = tags => {
    // Calling this.setState here breaks <Select /> component (?)
    // saving tags in 'this' instead
    this.setState({ tags: [...tags] });
  };

  render() {
    console.log("state of QuestionEdit: ", this.state);
    const { user, closeCreateQuestionBox } = this.props;

    return (
      <div className="questionEdit-floating-box">
        <div className="questionEdit-wrapper">
          <div
            className="questionEdit__close-button"
            onClick={() => closeCreateQuestionBox()}
          >
            &#10005;
          </div>

          <div className="questionEdit">
            <a className="questionEdit-user">{user}</a>
            <div className="line" />
            <h3>Ask a question to the community</h3>
            <div className="questionEdit-title">Question Header:</div>
            <textarea
              className="questionEdit-text"
              onChange={e => this.handleChange(e, "question_head")}
            />
            <div className="questionEdit-title">Question Body (Optional):</div>
            <textarea
              className="questionEdit-text"
              onChange={e => this.handleChange(e, "question_text")}
            />

            <div className="questionEdit-title">Tags</div>
            <br />
            <div>
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Add tags"
                onChange={tags => this.handleTagsChange(tags)}
              >
                {children}

                <Option value="business">business</Option>
                <Option value="cooking">cooking</Option>
                <Option value="entertainment">entertainment</Option>
                <Option value="fashion">fashion</Option>
                <Option value="programming">programming</Option>
                <Option value="social">social</Option>
                <Option value="technology">technology</Option>
              </Select>
            </div>
          </div>
          <button
            className="questionEdit-button button"
            onClick={() => this.handleSubmitQuestionButton()}
            style={{ color: "#ffffff" }}
          >
            Submit question
          </button>
        </div>
      </div>
    );
  }
}