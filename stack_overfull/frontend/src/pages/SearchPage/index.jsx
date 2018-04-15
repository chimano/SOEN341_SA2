// @flow
import React from 'react';
import qs from 'qs';
import { QuestionList, SearchFiltersBar, SearchBar } from '../../components';
import { getApiSearch } from '../../utils/api';
import './index.css';

type Props = {
  location: Object,
};

type State = {
  questionList: Array<Object>,
  filters: Array<string>,
};

export default class SearchPage extends React.Component<Props, State> {
  state = {
    questionList: [],
    filters: ['head', 'text', 'username'],
  };

  componentDidMount = () => {
    this.getSearchQuestionList();
  };

  componentDidUpdate = (prevProps: Object, prevState: Object) => {
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
    const queryString = this.props.location.search;

    // get the 'q' url parameter from the current url ie /search/?q=<search text>
    const queryParsed = qs.parse(queryString, { ignoreQueryPrefix: true });
    const { q } = queryParsed;

    // do api call
    getApiSearch(q, 'desc', 36, 'date_created', this.state.filters).then((response) => {
      this.setState({
        questionList: response.data.question_list,
      });
    });
  };

  handleFiltersChange = (newFilters: any) => {
    this.setState({ filters: [...newFilters] });
  };

  render() {
    const { questionList, filters } = this.state;

    const resultsHeaderText = questionList.length
      ? 'Here are the results found'
      : 'No results found';

    return (
      <div className="SearchPage-wrapper">
        <div className="SearchPage page-width">
          <h2 className="SearchPage__question-list-title">Search</h2>
          <div style={{ paddingBottom: '15px' }}>
            <SearchBar preserveInput />
          </div>
          <div className="SearchPage__search-filters-bar">
            <SearchFiltersBar defaultFilters={filters} onFiltersChange={this.handleFiltersChange} />
          </div>
          <h3 className="SearchPage__results">{resultsHeaderText}</h3>

          <QuestionList questionList={questionList} />
        </div>
      </div>
    );
  }
}
