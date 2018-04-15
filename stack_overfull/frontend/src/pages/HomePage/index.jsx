// @flow
import React from 'react';
import { Pagination, message } from 'antd';
import './index.css';
import { QuestionList, QuestionEdit, AskQuestionButton, FilterTabs } from '../../components';
import { getApiSearch, postApiQuestion } from '../../utils/api';

type Props = {
  username: string,
  loggedIn: boolean,
};

type State = {
  showCreateQuestionBox: boolean,
  questionList: Array<Object>,
  currentFilters: Array<string>,
  currentPage: number,
  totalQuestions: number,
  questionPerPage: number,
};

export default class HomePage extends React.Component<Props, State> {
  state = {
    showCreateQuestionBox: false,
    questionList: [],
    currentFilters: [],
    currentPage: 1,
    totalQuestions: 0,
    questionPerPage: 10,
  };

  componentDidMount = () => {
    this.getQuestionList();
  };

  getQuestionList = () => {
    const { currentFilters, currentPage, questionPerPage } = this.state;
    getApiSearch('', 'desc', questionPerPage, 'date_created', currentFilters, currentPage)
      .then((response) => {
        this.setState({
          questionList: response.data.question_list,
          currentPage: response.data.page,
          totalQuestions: response.data.total_items,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  createQuestion = (question: string) => {
    postApiQuestion(question)
      .then(() => {
        message.success('Question successfully created');
        this.getQuestionList();
      })
      .catch(e => message.error(e.response.data.error));
  };

  handleAskQuestionButton = () => {
    const { loggedIn } = this.props;
    if (loggedIn) {
      this.openCreateQuestionBox();
    } else {
      message.error('You need to Sign In to ask a question');
    }
  };

  openCreateQuestionBox = () => {
    this.setState({ showCreateQuestionBox: true });
  };

  closeCreateQuestionBox = () => {
    this.setState({ showCreateQuestionBox: false });
  };

  handleTabsChange = (key: number) => {
    new Promise((resolve) => {
      switch (key) {
        case '1':
          this.setState({
            currentFilters: [],
          });
          break;
        case '2':
          this.setState({
            currentFilters: ['notanswered'],
          });
          break;
        case '3':
          this.setState({
            currentFilters: ['notaccepted'],
          });
          break;
        default:
          this.setState({
            currentFilters: [],
          });
      }
      resolve();
    }).then(() => {
      this.getQuestionList();
    });
  };

  handlePaginationButton = (e: string) => {
    new Promise((resolve) => {
      const page = parseInt(e, 10);
      this.setState({
        currentPage: page,
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
      questionPerPage,
    } = this.state;
    const { username } = this.props;

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
      createQuestionBox = '';
    }

    return (
      <div className="body-wrapper">
        <div className="HomePage page-width">
          <FilterTabs handleTabsChange={this.handleTabsChange} />
          <div className="HomePage__question-list-title">
            <h3>QUESTIONS</h3>
            <AskQuestionButton handleAskQuestionButton={this.handleAskQuestionButton} />
          </div>
          <QuestionList questionList={questionList} getQuestionList={this.getQuestionList} />
          <Pagination
            style={{ textAlign: 'center', paddingBottom: '60px' }}
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
