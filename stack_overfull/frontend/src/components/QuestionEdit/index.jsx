import React from 'react';
import { Select } from 'antd';
import './index.css';

const { Option } = Select;

type Props = {
  createQuestion: () => {},
  closeCreateQuestionBox: () => {},
};

type State = {
  question_head: string,
  question_text: string,
  tags: Array<string>,
};

export default class QuestionEdit extends React.Component<Props, State> {
  state = {
    question_head: '',
    question_text: '',
    tags: [],
  };

  handleSubmitQuestionButton = () => {
    const { createQuestion, closeCreateQuestionBox } = this.props;
    createQuestion(this.state);
    closeCreateQuestionBox();
  };

  handleChange = (event, name) => {
    this.setState({ [name]: event.target.value });
  };

  handleTagsChange = (tags) => {
    // Calling this.setState here breaks <Select /> component (?)
    // saving tags in 'this' instead
    this.setState({ tags: [...tags] });
  };

  render() {
    const { closeCreateQuestionBox } = this.props;

    return (
      <div className="QuestionEdit__floating-box">
        <div className="QuestionEdit__wrapper">
          <div
            className="QuestionEdit__close-button"
            role="button"
            tabIndex={0}
            onClick={() => closeCreateQuestionBox()}
            onKeyPress={() => closeCreateQuestionBox()}
          >
            &#10005;
          </div>

          <div className="QuestionEdit">
            <div className="QuestionEdit__lines" />
            <h3>Ask a question to the community</h3>
            <div className="QuestionEdit__title">Question Header:</div>
            <textarea
              className="QuestionEdit__text"
              onChange={e => this.handleChange(e, 'question_head')}
            />
            <div className="QuestionEdit__title">Question Body (Optional):</div>
            <textarea
              className="QuestionEdit__text"
              onChange={e => this.handleChange(e, 'question_text')}
            />

            <div className="QuestionEdit__title">Tags</div>
            <br />
            <div>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Add tags"
                onChange={tags => this.handleTagsChange(tags)}
              >
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
            className="QuestionEdit__button button"
            onClick={() => this.handleSubmitQuestionButton()}
            style={{ color: '#ffffff' }}
          >
            Submit question
          </button>
        </div>
      </div>
    );
  }
}
