// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import './index.css';
import { AnswerBox, TagList, VotingButtons } from '../../components';
import {
  getApiQuestionById,
  getApiAnswerById,
  postApiAnswer,
  getApiUserMe,
  postApiAnswerIdAccept,
  postApiAnswerIdReject,
  voteAnswer,
  voteQuestion,
  formatDate,
} from '../../utils/api';

type Props = {
  username: string,
  logged_in: boolean,
  match: Object
}

type State = {
  question: Object,
  answerList: Array<Object>,
  answer: string,
  questionCreator: string,
  downvotedAnswersId: Array<number>,
  upvotedAnswersId: Array<number>,
  downvotedQuestionsId: Array<number>,
  upvotedQuestionsId: Array<number>,
}

export default class AnswerPage extends React.Component<Props, State> {
  state = {
    question: {},
    answerList: [],
    answer: '',
    questionCreator: '',
    downvotedAnswersId: [],
    upvotedAnswersId: [],
    downvotedQuestionsId: [],
    upvotedQuestionsId: [],
  };

  componentWillMount = () => {
    this.getQuestion();
    this.getAnswerList();
    this.getUserVotes();
  };

  componentWillReceiveProps = () => {
    this.getAnswerList();
    this.getUserVotes();
  };

  // For more responsive voting buttons
  getUserVotes = () => {
    getApiUserMe()
      .then((response) => {
        const downvotedAnswers = response.data.profile.downvoted_answers;
        const upvotedAnswers = response.data.profile.upvoted_answers;
        const downvotedQuestions = response.data.profile.downvoted_questions;
        const upvotedQuestions = response.data.profile.upvoted_questions;
        this.setState({
          downvotedAnswersId: downvotedAnswers,
          upvotedAnswersId: upvotedAnswers,
          downvotedQuestionsId: downvotedQuestions,
          upvotedQuestionsId: upvotedQuestions,
        });
      })
      .catch(error => console.log(error));
  };

  getQuestion = () => {
    const { match } = this.props;
    const questionId = match.params.id;
    getApiQuestionById(questionId)
      .then((response) => {
        this.setState({
          question: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getAnswerList = () => {
    const { match } = this.props;
    const questionId = match.params.id;
    getApiAnswerById(questionId, 'desc', 100)
      .then((response) => {
        this.setState({
          answerList: response.data.answer_list,
        });
      });
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  handleReplyButton = (questionId: number) => {
    getApiUserMe()
      .then((response) => {
        if (!response.data.error) {
          this.answerQuestion(this.state.answer, questionId);
          setTimeout(() => this.getAnswerList(), 500);
          this.refs.answer_text.value = '';
        } else {
          alert('You need to be logged in to reply!');
        }
      });
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  handleUpvoteButton = (answerId:number) => {
    this.upvoteAnswer(answerId);
    setTimeout(() => this.getAnswerList(), 500);
    setTimeout(() => this.getUserVotes(), 500);
  };

  handleDownvoteButton = (answerId:number) => {
    this.downvoteAnswer(answerId);
    setTimeout(() => this.getAnswerList(), 500);
    setTimeout(() => this.getUserVotes(), 500);
  };

  upvoteAnswer = (answerId:number) => {
    voteAnswer('UP', answerId);
    // .then((response) => {
    //   console.log(response);
    // })
    // .catch(e => alert(e.response.data.error));
  };

  downvoteAnswer = (answerId:number) => {
    voteAnswer('DOWN', answerId);
    // .then((response) => {
    //   console.log(response);
    // })
    // .catch(e => alert(e.response.data.error));
  };

  handleUpvoteQuestion = (questionId: number) => {
    this.upvoteQuestion(questionId);
    setTimeout(() => this.getQuestion(), 500);
    setTimeout(() => this.getUserVotes(), 500);
  };

  handleDownvoteQuestion = (questionId: number) => {
    this.downvoteQuestion(questionId);
    setTimeout(() => this.getQuestion(), 500);
    setTimeout(() => this.getUserVotes(), 500);
  };

  upvoteQuestion = (questionId: number) => {
    voteQuestion('UP', questionId)
      .then((response) => {
        console.log(response);
      })
      .catch(e => alert(e.response.data.error));
  };

  downvoteQuestion = (questionId: number) => {
    voteQuestion('DOWN', questionId)
      .then((response) => {
        console.log(response);
      })
      .catch(e => alert(e.response.data.error));
  };

  answerQuestion = (answer:string, questionId:number) => {
    postApiAnswer(answer, questionId);
  };

  handleChange = (event:Object) => {
    this.setState({ answer: event.target.value });
  };

  handleAccept = (AnswerId:number) => {
    postApiAnswerIdAccept(AnswerId);
    setTimeout(() => this.getAnswerList(), 500);
  };

  handleReject = (AnswerId:number) => {
    postApiAnswerIdReject(AnswerId);
    setTimeout(() => this.getAnswerList(), 500);
  };

  render() {
    const {
      question,
      answerList,
      questionCreator,
    } = this.state;
    const { match, logged_in, username } = this.props;
    const questionId = match.params.id;

    let verified;
    if (logged_in && questionCreator === username) {
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
    } else if (answerList.length === 1) {
      numberOfAnswersTitle = (
        <h2 className="numberOfAnswersText">{answerList.length} answer</h2>
      );
    } else {
      numberOfAnswersTitle = (
        <h2 className="numberOfAnswersText">{answerList.length} answers</h2>
      );
    }

    const answerListBox = [];
    let acceptedAnswerKey;

    // add the accepted answer box first
    answerList.forEach((x, key) => {
      if (x.is_accepted) {
        acceptedAnswerKey = key;
        answerListBox.push(<AnswerBox
          key={key}
          handleAccept={this.handleAccept}
          handleReject={this.handleReject}
          handleDownvoteButton={this.handleDownvoteButton}
          handleUpvoteButton={this.handleUpvoteButton}
          verified={verified}
          x={x}
          upvotedArray={this.state.upvotedAnswersId}
          downvotedArray={this.state.downvotedAnswersId}
        />);
      }
    });

    // add the rest of the answerbox
    answerList.forEach((x, key) => {
      if (key !== acceptedAnswerKey) {
        answerListBox.push(<AnswerBox
          key={key}
          handleAccept={this.handleAccept}
          handleReject={this.handleReject}
          handleDownvoteButton={this.handleDownvoteButton}
          handleUpvoteButton={this.handleUpvoteButton}
          verified={verified}
          x={x}
          upvotedArray={this.state.upvotedAnswersId}
          downvotedArray={this.state.downvotedAnswersId}
        />);
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
      questionBodyBox = '';
    }

    let questionTags = '';
    if (question.tags) {
      questionTags = <TagList tags={question.tags} />;
    }

    let questionDate = '';
    if (question.date_created) {
      questionDate = formatDate(question.date_created.replace('T', ' at ').substring(0, 19));
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
                upvotedArray={this.state.upvotedQuestionsId}
                downvotedArray={this.state.downvotedQuestionsId}
              />
            </div>
            <div className="AnswerPage__question-box grey-border">
              <h1 className="AnswerPage__question-title">
                {question.question_head}
              </h1>
              <div className="AnswerPage__tags">{questionTags}</div>
              {questionBodyBox}
              <Divider />
              <div className="AnswerPage__question-creator">
                Asked by <Link to={`/user/${questionCreator}`}>{questionCreator}</Link> on{' '}
                {questionDate}
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
              onClick={() => this.handleReplyButton(questionId)}
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    );
  }
}
