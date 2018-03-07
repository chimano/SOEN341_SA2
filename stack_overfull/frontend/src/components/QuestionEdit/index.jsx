import React from "react";
import "./index.css";
import { Select } from 'antd';

const Option = Select.Option;

const children = [];{
  children.push();
}

function handleChange(value) {
  console.log(`selected ${value}`);
}

export class QuestionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question_head: "",
      question_text: ""
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

  render() {
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
              onChange={e => this.handleChange(e, 'question_head')}
            />
            <div className="questionEdit-title">Question Body (Optional):</div>
            <textarea
              className="questionEdit-text"
              onChange={e => this.handleChange(e, 'question_text')}
            />

          <div className="questionEdit-title">Tags</div>
          <br />
            <div>
              <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Add tags"
              onChange={handleChange}
              >

              {children}

              <option value="A">business</option>
              <option value="B">cooking</option>
              <option value="C">entertainment</option>
              <option value="D">fashion</option>
              <option value="E">programming</option>
              <option value="F">social</option>
              <option value="G">technology</option>

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
