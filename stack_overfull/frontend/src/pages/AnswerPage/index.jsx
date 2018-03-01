import React from "react";
import "./index.css";
import { AnswerBox } from "../../components";

import {
  getApiQuestionById,
  getApiAnswerById,
  postApiAnswer,
  getApiUserMe,
  postApiAnswerIdAccept,
  postApiAnswerIdReject,
  voteAnswer
} from "../../utils/api";

export class AnswerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      answerList: [],
      answer: "",
      accepted_answer_id: "",
      rejected_answers_ids: [],
      verified: false,
      q_user: ""
    };
  }

  componentWillMount = () => {
    this.getQuestion();
    this.verifyUserAccess();
    this.getAnswerList();
  };
  componentWillReceiveProps = () => {
    console.log("received props");
    this.getAnswerList();
    this.verifyUserAccess();
  };

  verifyUserAccess = () => {
    const { logged_in, username } = this.props;
    console.log(this.props);
    const q_id = this.props.match.params.id;
    console.log("logged_in: ", logged_in, "username: ", username);
    if (logged_in) {
      getApiQuestionById(q_id).then(response => {
        var user = response.data.user_id.username;
        if (user === username) {
          this.setState({
            verified: true
          });
        } else {
          this.setState({
            verified: false
          });
        }
      });
    } else {
      this.setState({
        verified: false
      });
    }
  };

  getQuestion = () => {
    const q_id = this.props.match.params.id;
    getApiQuestionById(q_id).then(response => {
      var q_user = response.data.user_id.username;
      this.setState({
        question: response.data.question_text,
        accepted_answer_id: response.data.accepted_answer_id,
        rejected_answers_ids: response.data.rejected_answers_ids,
        q_user: q_user
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

  handleUpvoteButton = id => {
    console.log("ID IS: " + id);
    this.upvoteAnswer(id);
    setTimeout(() => this.getAnswerList(), 500);
  };

  handleDownvoteButton = id => {
    console.log("ID IS: " + id);
    this.downvoteAnswer(id);
    setTimeout(() => this.getAnswerList(), 500);
  };

  upvoteAnswer = id => {
    voteAnswer("UP", id);
  };

  downvoteAnswer = id => {
    voteAnswer("DOWN", id);
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
    const { question, answerList, q_user } = this.state;
    const { logged_in, username } = this.props;
    const q_id = this.props.match.params.id;

    console.log(this.state);
    console.log("# OF ANSWERS: " + answerList.length);

    var verified;
    if (logged_in && q_user === username) {
      verified = true;
    } else {
      verified = false;
    }

    let numberOfAnswersTitle;
    if (answerList.length === 0) {
      numberOfAnswersTitle = (
        <h2 className="AnswerPage__no-answer-text">
          No answer yet... Be the first one to reply!
        </h2>
      );
    } else if (answerList.length === 1) {
      numberOfAnswersTitle = (
        <h2 className="AnswerPage__number-of-answers-Text">1 answer</h2>
      );
    } else {
      numberOfAnswersTitle = (
        <h2 className="AnswerPage__number-of-answers-Text">
          {answerList.length} answers
        </h2>
      );
    }

    var answerListBox = [];
    var acceptedAnswerKey;

    //add the accepted answer box first
    answerList.forEach((x, key) => {
      if (x.is_accepted) {
        acceptedAnswerKey = key;
        answerListBox.push(
          <AnswerBox
            key={key}
            handleAccept={this.handleAccept}
            handleReject={this.handleReject}
            handleDownvoteButton={this.handleDownvoteButton}
            handleUpvoteButton={this.handleUpvoteButton}
            verified={verified}
            x={x}
          />
        );
      }
    });

    //add the rest of the answerbox
    answerList.forEach((x, key) => {
      if (key !== acceptedAnswerKey) {
        answerListBox.push(
          <AnswerBox
            key={key}
            handleAccept={this.handleAccept}
            handleReject={this.handleReject}
            handleDownvoteButton={this.handleDownvoteButton}
            handleUpvoteButton={this.handleUpvoteButton}
            verified={verified}
            x={x}
          />
        );
      }
    });

    return (
      <div className="body-wrapper">
        <div className="page-width">
          <h1 className="AnswerPage__question-title">{question}</h1>
          <div className="AnswerPage__seperator" />
          {numberOfAnswersTitle}
          {answerListBox}
          <div className="AnswerPage__seperator" />
          <div className="AnswerPage__your-answer-area">
            <h2 className="AnswerPage__your-answer-title">Your Answer</h2>
            <textarea
              ref="answer_text"
              className="AnswerPage__answer-text-area"
              onChange={e => this.handleChange(e)}
            />
            <button
              className="AnswerPage__reply-button button"
              onClick={() => this.handleReplyButton(q_id)}
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    );
  }
}
