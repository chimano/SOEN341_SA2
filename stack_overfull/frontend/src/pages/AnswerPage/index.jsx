import React from "react";
import "./index.css";
import { AnswerBox, TagList } from "../../components";
import { formatDate } from "../../utils/api";
import { Divider } from "antd";
import { VotingButtons } from "../../components";

import {
  getApiQuestionById,
  getApiAnswerById,
  postApiAnswer,
  getApiUserMe,
  postApiAnswerIdAccept,
  postApiAnswerIdReject,
  voteAnswer,
  voteQuestion
} from "../../utils/api";

export class AnswerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: {
        id: null,
        user_id: {
          username: ""
        },
        question_head: "",
        question_text: "",
        accepted_answer_id: null,
        rejected_answers_ids: [],
        date_created: "",
        points: null,
        tags: []
      },
      answerList: [],
      answer: "",
      accepted_answer_id: "",
      rejected_answers_ids: [],
      verified: false,
      q_user: "",
      downvoted_answers_id: [],
      upvoted_answers_id: [],
      downvoted_questions_id: [],
      upvoted_questions_id: []
    };
  }

  componentWillMount = () => {
    this.getQuestion();
    this.verifyUserAccess();
    this.getAnswerList();
    this.getUserVotes();
  };
  
  componentWillReceiveProps = () => {
    console.log("received props");
    this.getAnswerList();
    this.verifyUserAccess();
    this.getUserVotes();
  };

  verifyUserAccess = () => {
    const { logged_in, username } = this.props;
    const q_id = this.props.match.params.id;
    if (logged_in) {
      getApiQuestionById(q_id)
        .then(response => {
          console.log("response of getApiQuestionById(q_id): ", response);
          let user = response.data.user_id.username;
          if (user === username) {
            this.setState({
              verified: true
            });
          } else {
            this.setState({
              verified: false
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.setState({
        verified: false
      });
    }
  };

  // For more responsive voting buttons
  getUserVotes = () => {
    getApiUserMe()
      .then(response => {
        console.log("response of getApiUserMe(): ", response);
        this.setState({
          downvoted_answers_id: response.data.profile.downvoted_answers,
          upvoted_answers_id: response.data.profile.upvoted_answers,
          downvoted_questions_id: response.data.profile.downvoted_questions,
          upvoted_questions_id:response.data.profile.upvoted_questions
        });
      })
      .catch(error => console.log(error));
  };


  getQuestion = () => {
    const q_id = this.props.match.params.id;
    getApiQuestionById(q_id)
      .then(response => {
        console.log("response of getApiQuestionById(q_id): ", response);
        let q_user = response.data.user_id.username;
        this.setState({
          question: response.data,
          accepted_answer_id: response.data.accepted_answer_id,
          rejected_answers_ids: response.data.rejected_answers_ids,
          q_user: q_user
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getAnswerList = () => {
    const q_id = this.props.match.params.id;
    getApiAnswerById(q_id, "desc", 100)
      .then(response => {
        console.log(
          'response of getApiAnswerById(q_id, "desc", 100): ',
          response
        );
        this.setState({
          answerList: response.data.answer_list
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleReplyButton = q_id => {
    getApiUserMe()
      .then(response => {
        console.log("response of getApiUserMe(): ", response);
        //make sure user is logged in before replying
        if (!response.data.error) {
          console.log("ID IS : " + q_id);
          this.answerQuestion(this.state.answer, q_id);
          setTimeout(() => this.getAnswerList(), 500);
          this.refs.answer_text.value = "";
        } else {
          alert("You need to be logged in to reply!");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleUpvoteButton = id => {
    console.log("ID IS: " + id);
    this.upvoteAnswer(id);
    setTimeout(() => this.getAnswerList(), 500);
    setTimeout(() => this.getUserVotes(), 500);
  };

  handleDownvoteButton = id => {
    console.log("ID IS: " + id);
    this.downvoteAnswer(id);
    setTimeout(() => this.getAnswerList(), 500);
    setTimeout(() => this.getUserVotes(), 500);
  };

  upvoteAnswer = id => {
    voteAnswer("UP", id);
  };

  downvoteAnswer = id => {
    voteAnswer("DOWN", id);
  };

  handleUpvoteQuestion = id => {
    console.log("Q ID: "+id);
    this.upvoteQuestion(id);
    setTimeout(() => this.getQuestion(), 500);
  }

  handleDownvoteQuestion = id => {
    console.log("Q ID: "+id);
    this.downvoteQuestion(id);
    setTimeout(() => this.getQuestion(), 500);
  }

  upvoteQuestion = id => {
    voteQuestion("UP", id)
    .catch(error => console.log(error));
  }

  downvoteQuestion = id => {
    voteQuestion("DOWN", id)
    .catch(error => console.log(error));
  }

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
    const { 
      question, 
      answerList, 
      q_user,
      downvoted_answers_id,
      upvoted_answers_id,
      downvoted_questions_id,
      upvoted_questions_id
     } = this.state;
    
    const { logged_in, username } = this.props;
    const q_id = this.props.match.params.id;

    console.log("# OF ANSWERS: " + answerList.length);
    console.log("Number of downvoted answers: "+downvoted_answers_id.length);
    console.log("Number of upvoted answers: "+upvoted_answers_id.length);
    console.log("Number of downvoted answers: "+downvoted_questions_id.length);
    console.log("Number of upvoted answers: "+upvoted_questions_id.length);


    let verified;
    if (logged_in && q_user === username) {
      verified = true;
    } else {
      verified = false;
    }

    let numberOfAnswersTitle;
    if (answerList.length < 1) {
      numberOfAnswersTitle = (
        <h2 className="AnswerPage__no-answer-text">
          No answer yet... Be the first one to reply!
        </h2>
      );
    } else if (answerList.length == 1) {
      numberOfAnswersTitle = (
        <h2 className="numberOfAnswersText">{answerList.length} answer</h2>
      );
    } else {
      numberOfAnswersTitle = (
        <h2 className="numberOfAnswersText">{answerList.length} answers</h2>
      );
    }

    let answerListBox = [];
    let acceptedAnswerKey;

    let upvoted = false;
    let downvoted = false;

    
    //add the accepted answer box first
    answerList.forEach((x, key) => {
      console.log("!"+x.id);
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
            upvoted_array={this.state.upvoted_answers_id}
            downvoted_array={this.state.downvoted_answers_id}
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
            upvoted_array={this.state.upvoted_answers_id}
            downvoted_array={this.state.downvoted_answers_id}
            />
        );
      }
    });

    let questionBodyBox;
    if (question.question_text) {
      questionBodyBox = (
        <div className="AnswerPage__question-body">
          {question.question_text}
        </div>
      );
    } else {
      questionBodyBox = "";
    }

    let questionTags = "";
    if (question.tags) {
      questionTags = <TagList tags={question.tags} />;
    }

    let questionDate = "";
    if (question.date_created) {
      questionDate = formatDate(
        question.date_created.replace("T", " at ").substring(0, 19)
      );
    }

    return (
      <div className="body-wrapper">
        <div className="page-width">
        
        <div className="AnswerPage__question-area">
          <div className="AnswerPage__question-voting">
          <VotingButtons
              handleDownvoteButton={this.handleDownvoteQuestion}
              handleUpvoteButton={this.handleUpvoteQuestion}
              id={question.id}
              points={question.points}
              upvoted_array={this.state.upvoted_questions_id}
              downvoted_array={this.state.downvoted_questions_id}
              question_buttons={true}
              answer_buttons={false}
            />
          </div>
          <div className="AnswerPage__question-box">
            <h1 className="AnswerPage__question-title">
              {question.question_head}
            </h1>
            <div className="AnswerPage__tags">{questionTags}</div>
            {questionBodyBox}
            <Divider />
            <div className="AnswerPage__question-creator">
              Asked by <a>{q_user}</a> on {questionDate}
            </div>
          </div>
          </div>


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
