import React from "react";
import { NavigationBar } from "../../components";
import { getApiQuestionById, getApiAnswerById, postApiAnswer } from "../../utils/api";

export class AnswerPage extends React.Component {
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
        <NavigationBar />
        {question}
        {answerList !== []
          ? answerList.map((x, key) => {
              return (
                <div key={key}>
                  {x.answer_text}
                  {x.date_created}
                </div>
              );
            })
          : ""}
        <textarea
          ref="answer_text"
          className="questionBox__answer-text"
          onChange={e => this.handleChange(e)}
        />
        {/* <div className="question-title">{question_text}</div> */}
        {/* <button className="replyButton" onClick={() => this.handleReplyButton(boxId)} value={this.boxId}>Reply</button> */}
        <button
          className="questionBox__reply-button"
          onClick={() => this.handleReplyButton(q_id)}
        >
          Reply
        </button>
      </div>
    );
  }
}
