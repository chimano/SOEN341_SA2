import React from "react";

import { QuestionList, SearchFiltersBar, SearchBar } from "../../components";

import { getApiSearch } from "../../utils/api";

import "./index.css";
import qs from "qs";

export class TagPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionList: [],
      username: "",
      filters: [""]
    };
  }

  componentDidMount = () => {
    this.getSearchQuestionList();
  };

  componentDidUpdate = (prevProps, prevState) => {
    // check if the current url has changed
    if (prevProps.location.search !== this.props.location.search) {
      this.getSearchQuestionList();
    }

    // check if the current filters have changed
    if (prevState.filters.length !== this.state.filters.length) {
      this.getSearchQuestionList();
    }
  };

  getSearchQuestionList = () => {
    // get the query string from url (react includes '?' in the query string)
    const query_string = this.props.location.search;

    // get the 'q' url parameter from the current url ie /search/?q=<search text>
    const query_parsed = qs.parse(query_string, { ignoreQueryPrefix: true });
    const q = query_parsed.q;

    console.log("Fetching new questionList. Search query('q=') ", q);
    // do api call
    getApiSearch(q, "desc", 36, "date_created", this.state.filters)
      .then(response => {
        console.log(
          'response of getApiSearch(q, "desc", 36, "date_created"): ',
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
    console.log("TagSearchPage state: ", this.state);

    const { questionList, filters } = this.state;

    let resultsHeaderText = questionList.length
      ? "Here are the questions found with the selected tag"
      : "No questions found with the selected tag";

    return (
      <div className="TagPage-wrapper">
        <div className="TagPage page-width">
          <h2 className="TagPage__question-list-title">Search</h2>
          <div style={{ paddingBottom: "15px" }}>
            <SearchBar />
          </div>
          <div className="TagPage__search-filters-bar">
            <SearchFiltersBar
              defaultFilters={filters}
              onFiltersChange={this.handleFiltersChange}
            />
          </div>
          <h3 className="TagPage__results">{resultsHeaderText}</h3>

          <QuestionList questionList={questionList} />
        </div>
      </div>
    );
  }
}
