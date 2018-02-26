import React from "react";
import {
  QuestionList
} from "../../components";
import {
  getApiSearch
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

  render() {
    console.log("SearchPage state: ", this.state);

    const { showCreateQuestionBox, questionList, username } = this.state;

    return (
      <div className="SearchPage-wrapper">
        <div className="SearchPage page-width">
          <div>
            <h2 className="SearchPage__question-list-title">Search</h2>
            <h3 className="SearchPage__results">Here are the results found</h3>
          </div>
          <QuestionList questionList={questionList} />
        </div>
      </div>
    );
  }
}
