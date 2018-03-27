// @flow

import React from "react";
import "./index.css";
import { Pagination } from "antd";
import {
  QuestionList,
  QuestionEdit,
  AskQuestionButton,
  SearchFiltersBar,
  FilterTabs
} from "../../components";
import {
  getApiSearch,
  getApiQuestion,
  postApiQuestion,
  postApiAnswer
} from "../../utils/api";

type Props = {
  username: string,
  verifyLogin: () => {}
};

type State = {
  showCreateQuestionBox: boolean,
  questionList: Array<Object>,
  order: string,
  currentFilters: Array<string>,
  title: string,
  currentPage: number,
  totalQuestions: number,
  questionPerPage: number
};

export class HomePage extends React.Component<Props, State> {
  state = {
    showCreateQuestionBox: false,
    questionList: [],
    order: "desc",
    currentFilters: [],
    title: "All",
    currentPage: 1,
    totalQuestions: 0,
    questionPerPage: 10
  };

  componentDidMount = () => {
    this.getQuestionList();
  };

  getQuestionList = () => {
    const { currentFilters, currentPage, questionPerPage } = this.state;
    getApiSearch(
      "",
      "desc",
      questionPerPage,
      "date_created",
      currentFilters,
      currentPage
    )
      .then(response => {
        console.log(
          'response of getApiSearch("", "desc", questionPerPage, "date_created", currentFilters, currentPage)',
          response
        );
        this.setState({
          questionList: response.data.question_list,
          currentPage: response.data.page,
          totalQuestions: response.data.total_items
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  createQuestion = (question: string) => {
    postApiQuestion(question)
      .then(() => this.getQuestionList())
      .catch(error => console.log(error));
  };

  answerQuestion(answer: string, q_id: number) {
    postApiAnswer(answer, q_id).catch(error => console.log(error));
  }

  handleAskQuestionButton = () => {
    const { verifyLogin } = this.props;
    verifyLogin().then(logged_in => {
      if (logged_in) {
        this.openCreateQuestionBox();
      } else {
        alert("You need to Sign In to ask a question");
      }
    });
  };

  openCreateQuestionBox = () => {
    this.setState({ showCreateQuestionBox: true });
  };

  closeCreateQuestionBox = () => {
    this.setState({ showCreateQuestionBox: false });
  };

  handleTabsChange = (key: number) => {
    new Promise(resolve => {
      switch (key) {
        case "1":
          this.setState({
            currentFilters: []
          });
          break;
        case "2":
          this.setState({
            currentFilters: ["notanswered"]
          });
          break;
        case "3":
          this.setState({
            currentFilters: ["notaccepted"]
          });
          break;
      }
      resolve();
    }).then(() => {
      this.getQuestionList();
    });
  };

  handlePaginationButton = (e: string) => {
    new Promise(resolve => {
      let page = parseInt(e);
      this.setState({
        currentPage: page
      });
      resolve();
    }).then(() => {
      this.getQuestionList();
    });
  };

  render() {
    const {
      showCreateQuestionBox,
      questionList,
      currentPage,
      totalQuestions,
      questionPerPage
    } = this.state;
    const { username } = this.props;
    console.log(this.state);

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
      <div className="body-wrapper">
        <div className="HomePage page-width">
          <FilterTabs handleTabsChange={this.handleTabsChange} />
          <div className="HomePage__question-list-title">
            <h3>QUESTIONS</h3>
            <AskQuestionButton
              handleAskQuestionButton={this.handleAskQuestionButton}
            />
          </div>
          <QuestionList
            questionList={questionList}
            getQuestionList={this.getQuestionList}
          />
          <Pagination
            style={{ textAlign: "center", paddingBottom: "60px" }}
            defaultCurrent={1}
            defaultPageSize={questionPerPage}
            current={currentPage}
            total={totalQuestions}
            onChange={e => this.handlePaginationButton(e)}
          />
        </div>
        {createQuestionBox}
      </div>
    );
  }
}
