import React from "react";
import "./index.css";
import {
  QuestionList,
} from "../../components";
import {
  getApiQuestion,
} from "../../utils/api";
import qs from "qs";

export class TagPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionList: [],
      order: "desc",
      title: "All",
      filters: [""]
    };
  }

  componentDidMount = () => {
    this.getQuestionList();
  };

  componentDidUpdate = (prevProps, prevState) => {
    // check if the current url has changed
    if (prevProps.location !== this.props.location) {
      this.getQuestionList();
    }

    // check if the current filters have changed
    if (prevState.filters.length !== this.state.filters.length) {
      this.getQuestionList();
    }
  };

  getQuestionList = () => {
    // get tagname from url match
    const tagname = this.props.match.params.tags

    getApiQuestion("desc", 36, "date_created", [tagname])
      .then(response => {
        console.log(
          'response of getQuestion(desc",36,"date_created", ["<tagname>"])',
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

  render() {
    console.log("TagPage state: ", this.state);

    const { questionList, filters } = this.state;

    let resultsHeaderText = questionList.length
    ? "Here are the questions found with the selected tag"
    : "No questions found with the selected tag";

    return (
        <div className="TagPage-wrapper">
          <div className="TagPage page-width">
            <h2 className="TagPage__question-list-title">Search</h2>
            <h3 className="TagPage__results">{resultsHeaderText}</h3>

            <QuestionList
            questionList={questionList}
            getQuestionList={this.getQuestionList}
            />
          </div>
        </div>
      );
  }
}
