import React from "react";
import "./index.css";
import { getApiQuestionById, getApiAnswerById, postApiAnswer } from "../../utils/api";

export class QuestionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      answerList: [],
      answer: ""
    };
    this.getQuestion();
    this.getAnswerList();
  }

  getQuestion = () => {
    const q_id = this.props.match.params.id;
    getApiQuestionById(q_id).then(response => {
      this.setState({
        question: response.data.question_text
      });
    });
  };

  getAnswerList = () => {
    const q_id = this.props.match.params.id;
    getApiAnswerById(q_id).then(list => {
      this.setState({
        answerList: list
      });
    });
  };

  handleReplyButton = (q_id) => {
    console.log("ID IS : " + q_id);
    this.answerQuestion(this.state.answer, q_id);
    setTimeout(() => this.getAnswerList(), 100);
    this.refs.answer_text.value = "";
  };

  answerQuestion = (answer, q_id) => {
    postApiAnswer(answer, q_id);
  };

  handleChange = event => {
    this.setState({ answer: event.target.value });
  };

  render() {
    const { question, answerList } = this.state;
    const q_id = this.props.match.params.id;
    
    console.log(this.state);

    return (
      <div>
        <h1 className="questionTitle">{question}</h1>
        <div className="seperator" />
        {answerList !== []
          ? answerList.map((x, key) => {
              return (
                <div className="answerBox" key={key}>
                  <div className="answerText">{x.answer_text}</div>
                  <div className="dateText">{x.date_created}</div>
                </div>
              );
            })
          : ""}
        <div className="seperator" />
        <div className="yourAnswerArea">
          <h2 className="yourAnswerTitle">Your Answer</h2>
          <textarea
            ref="answer_text"
            className="questionBox_answer-text"
            onChange={e => this.handleChange(e)}
          />
          {/* <div className="question-title">{question_text}</div> */}
          {/* <button className="replyButton" onClick={() => this.handleReplyButton(boxId)} value={this.boxId}>Reply</button> */}
          <button
            className="questionBox_reply-button"
            onClick={() => this.handleReplyButton(q_id)}>
            Reply
          </button>
        </div>
      </div>
    );
  }
}
