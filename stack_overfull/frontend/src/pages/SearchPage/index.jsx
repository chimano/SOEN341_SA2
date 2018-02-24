import React from "react";
import {
  QuestionList,
  Footer,
  QuestionEdit,
  AskQuestionButton
} from "../../components";
import {
  getApiSearch,
  getApiQuestion,
  postApiQuestion,
  postApiAnswer,
  getApiUserMe
} from "../../utils/api";
import { postApiUserLogout } from "../../utils/api";
import "./index.css";
import qs from "qs"
import { Redirect } from 'react-router-dom';
import { Link } from "react-router-dom";

export class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreateQuestionBox: false,
      questionList: [],
      username: ""
    };
  }

  componentDidMount = () => {
    this.getSearchQuestionList();
  };

  getSearchQuestionList = () => {
    // get the 'q' url parameter from the current url ie /search/?q=<search text>
    // https://github.com/ljharb/qs/issues/177
    var q = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).q

    console.log("Search query('q=') captured as url parameter:", q)

    getApiSearch(q, "desc", 36, "date_created").then(response => {
      this.setState({
        questionList: response.data.question_list
      });
    });
  };

  createQuestion = question => {
    postApiQuestion(question);
    setTimeout(() => this.getQuestionList(), 100);
  };

  answerQuestion(answer, q_id) {
    var parsedQ_id = parseInt(q_id);
    // console.log("parsed_q_id", parsedQ_id);
    // console.log("answer:", answer);
    postApiAnswer(answer, q_id);
  }

  handle_signup_button = () => {
    this.setState({ open_signup: true, open_signin: false });
  };

  handle_signin_button = () => {
    this.setState({ open_signin: true, open_signup: false });
  };

  handle_close_button = () => {
    this.setState({ open_signin: false, open_signup: false });
  };
  handle_login = username => {
    getApiUserMe().then(response => {
      if (!response.error) {
        this.setState({ logged_in: true, username: response.data.username });
      }
    });
  };
  handle_logout = () => {
    postApiUserLogout();
    this.setState({ logged_in: false, username: "" });
  };

  openCreateQuestionBox = () => {
    this.setState({ showCreateQuestionBox: true });
  };

  closeCreateQuestionBox = () => {
    this.setState({ showCreateQuestionBox: false });
  };

  render() {
    console.log("SearchPage state: ", this.state);

    const { showCreateQuestionBox, questionList, username } = this.state;

    let createQuestionBox;
    if (showCreateQuestionBox) {
      createQuestionBox = (
        <QuestionEdit
          user={username}
          createQuestion={this.createQuestion}
          closeCreateQuestionBox={this.closeCreateQuestionBox}
        />
      );
    } else {
      createQuestionBox = "";
    }

    return (
      <div className="homepage-wrapper">
        <div className="homepage-box">
          <div>
            <h2 className="question-list-title">Search</h2>
            <h3 className="results">Here are the results found</h3>
          </div>
          <QuestionList questionList={questionList} />
        </div>
        {createQuestionBox}
      </div>
    );
  }
}
