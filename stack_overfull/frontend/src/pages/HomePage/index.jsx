import React from "react";
import "./index.css";
import {
  QuestionList,
  QuestionEdit,
  AskQuestionButton,
  SearchFiltersBar,
  PostJobButton
} from "../../components";
import {
  getApiSearch,
  getApiQuestion,
  postApiQuestion,
  postApiAnswer
} from "../../utils/api";
import { FilterTabs } from "../../components/FilterTabs/index";

export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateQuestionBox: false,
      questionList: [],
      order: "desc",
      currentFilters: [],
      title: "All"
    };
  }

  componentDidMount = () => {
    this.getQuestionList();
  };

  getQuestionList = () => {
    getApiSearch("", "desc", 36, "date_created", this.state.currentFilters)
      .then(response => {
        console.log(
          'response of getApiSearch("","desc",36,"date_created")',
          response
        );
        this.setState({
          questionList: response.data.question_list
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  createQuestion = question => {
    postApiQuestion(question).catch(error => console.log(error));
    setTimeout(() => this.getQuestionList(), 100);
  };

  answerQuestion(answer, q_id) {
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

  // onFiltersChange = selectedFilters => {
  //   console.log(selectedFilters);
  //   this.setState({
  //     currentFilters: selectedFilters
  //   });
  //   setTimeout(() => this.getQuestionList(), 100);
  // };

  handleTabsChange = key => {
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
    setTimeout(() => this.getQuestionList(), 100);
  };

  render() {
    console.log("HomePage state: ", this.state);

    const { showCreateQuestionBox, questionList } = this.state;
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
      createQuestionBox = "";
    }

    return (
      <div className="HomePage-wrapper">
        <PostJobButton />
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
        </div>
        {createQuestionBox}
      </div>
    );
  }
}
