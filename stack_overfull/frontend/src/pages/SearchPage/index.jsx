import React from "react";

import { QuestionList, SearchFiltersBar, SearchBar } from "../../components";

import { getApiSearch } from "../../utils/api";

import "./index.css";
import qs from "qs";

export class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionList: [],
      username: "",
      filters: ["head", "text", "username"]
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

  handleFiltersChange = newFilters => {
    this.setState({ filters: [...newFilters] });
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

    const { questionList, filters } = this.state;

    let resultsHeaderText = questionList.length
      ? "Here are the results found"
      : "No results found";

    return (
      <div className="SearchPage-wrapper">
        <div className="SearchPage page-width">
          <h2 className="SearchPage__question-list-title">Search</h2>
          <div style={{ paddingBottom: "15px" }}>
            <SearchBar />
          </div>
          <div className="SearchPage__search-filters-bar">
            <SearchFiltersBar
              defaultFilters={filters}
              onFiltersChange={this.handleFiltersChange}
            />
          </div>
          <h3 className="SearchPage__results">{resultsHeaderText}</h3>

          <QuestionList questionList={questionList} />
        </div>
      </div>
    );
  }
}
