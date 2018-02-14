import React from "react";
import "./index.css";
import { AcceptRejectButton } from "../../components";
import {
  getApiQuestionById,
  getApiAnswerById,
  postApiAnswer,
  getApiUserMe,
  postApiAnswerIdAccept,
  postApiAnswerIdReject
} from "../../utils/api";

export class AnswerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      answerList: [],
      answer: "",
      userName: "",
      accepted_answer_id: "",
      rejected_answers_ids: [],
      verified: false
    };

    this.getQuestion();
    this.getAnswerList();
    this.verifyUserAccess();
  }

  componentWillReceiveProps = () => {
    this.verifyUserAccess();
    this.getAnswerList();
  };

  verifyUserAccess = () => {
    const q_id = this.props.match.params.id;
    getApiUserMe().then(response => {
      this.setState({
        userName: response.data.username
      });
      getApiQuestionById(q_id).then(response => {
        var user = response.data.user_id.username;
        if (user === this.state.userName) {
          this.setState({
            verified: true
          });
        } else {
          this.setState({
            verified: false
          });
        }
      });
    });
  };

  getQuestion = () => {
    const q_id = this.props.match.params.id;
    getApiQuestionById(q_id).then(response => {
      this.setState({
        question: response.data.question_text,
        accepted_answer_id: response.data.accepted_answer_id,
        rejected_answers_ids: response.data.rejected_answers_ids
      });
    });
  };

  getAnswerList = () => {
    const q_id = this.props.match.params.id;
    getApiAnswerById(q_id, "desc", 100).then(list => {
      this.setState({
        answerList: list
      });
    });
  };

  handleReplyButton = q_id => {
    getApiUserMe().then(response => {
      //make sure user is logged in before replying
      if (!response.data.error) {
        console.log("ID IS : " + q_id);
        this.answerQuestion(this.state.answer, q_id);
        setTimeout(() => this.getAnswerList(), 500);
        this.refs.answer_text.value = "";
      } else {
        alert("You need to be logged in to reply!");
      }
    });
  };

  answerQuestion = (answer, q_id) => {
    postApiAnswer(answer, q_id);
  };

  handleChange = event => {
    this.setState({ answer: event.target.value });
  };

  handleAccept = id => {
    postApiAnswerIdAccept(id);
    setTimeout(() => this.getAnswerList(), 500);
  };

  handleReject = id => {
    postApiAnswerIdReject(id);
    setTimeout(() => this.getAnswerList(), 500);
  };

  render() {
    const { question, answerList } = this.state;
    const q_id = this.props.match.params.id;

    console.log(this.state);
    console.log("# OF ANSWERS: " + answerList.length);

    let numberOfAnswersTitle;
    if (answerList.length === 0) {
      numberOfAnswersTitle = (
        <h2 className="noAnswerText">
          No answer yet... Be the first one to reply!
        </h2>
      );
    } else if (answerList.length == 1) {
      numberOfAnswersTitle = (
        <h2 className="noAnswerText">
          No answer yet... Be the first one to reply!
        </h2>
      );
    } else if (answerList.length === 1) {
      numberOfAnswersTitle = <h2 className="numberOfAnswersText">1 answer</h2>;
    } else {
      numberOfAnswersTitle = (
        <h2 className="numberOfAnswersText">{answerList.length} answers</h2>
      );
    }

    var answerListBox = [];
    var acceptFound = false;
    answerList.map((x, key) => {
      if (this.state.verified === true) {
        if (x.is_accepted === true) {
          answerListBox.push(
            <div className="answerBox answerBox--green" key={key}>
              <div className="answerText">{x.answer_text}</div>
              <div className="dateText">
                {x.date_created.replace("T", " at ").substring(0, 19)}
              </div>
              <AcceptRejectButton
                handleAccept={this.handleAccept}
                handleReject={this.handleReject}
                Accepted={true}
                Rejected={false}
                a_id={x.id}
              />
            </div>
          );
        } else if (x.is_rejected === true) {
          answerListBox.push(
            <div className="answerBox answerBox--red" key={key}>
              <div className="answerText">{x.answer_text}</div>
              <div className="dateText">
                {x.date_created.replace("T", " at ").substring(0, 19)}
              </div>
              <AcceptRejectButton
                handleAccept={this.handleAccept}
                handleReject={this.handleReject}
                Accepted={false}
                Rejected={true}
                a_id={x.id}
              />
            </div>
          );
        } else {
          answerListBox.push(
            <div className="answerBox answerBox--blue" key={key}>
              <div className="answerText">{x.answer_text}</div>
              <div className="dateText">
                {x.date_created.replace("T", " at ").substring(0, 19)}
              </div>
              <AcceptRejectButton
                handleAccept={this.handleAccept}
                handleReject={this.handleReject}
                Accepted={false}
                Rejected={false}
                a_id={x.id}
              />
            </div>
          );
        }
      } else {
        if (x.is_accepted === true) {
          answerListBox.push(
            <div className="answerBox answerBox--green" key={key}>
              <div className="answerText">{x.answer_text}</div>
              <div className="dateText">
                {x.date_created.replace("T", " at ").substring(0, 19)}
              </div>
            </div>
          );
        } else if (x.is_rejected === true) {
          answerListBox.push(
            <div className="answerBox answerBox--red" key={key}>
              <div className="answerText">{x.answer_text}</div>
              <div className="dateText">
                {x.date_created.replace("T", " at ").substring(0, 19)}
              </div>
            </div>
          );
        } else {
          answerListBox.push(
            <div className="answerBox answerBox--blue" key={key}>
              <div className="answerText">{x.answer_text}</div>
              <div className="dateText">
                {x.date_created.replace("T", " at ").substring(0, 19)}
              </div>
            </div>
          );
        }
      }
    });

    return (
      <div>
        <h1 className="questionTitle">{question}</h1>
        <div className="seperator" />
        {numberOfAnswersTitle}
        {answerListBox}
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
            onClick={() => this.handleReplyButton(q_id)}
          >
            Reply
          </button>
        </div>
      </div>
    );
  }
}
