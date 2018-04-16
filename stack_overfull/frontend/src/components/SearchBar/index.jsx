// @flow
import React from 'react';
import { withRouter } from 'react-router';
import { Input } from 'antd';
import qs from 'qs';
import './index.css';

const { Search } = Input;

type Props = {
  preserveInput: boolean,
  location: Object,
  history: Object,
};

type State = {
  searchText: string,
};

// Search bar
// uses withRouter() decorator to access router's props
// Cutsom prop: preserveInput (defaults to false)
class SearchBarNR extends React.Component<Props, State> {
  state = {
    searchText: '',
  };

  componentDidMount = () => {
    let newSearchText = '';

    if (this.props.preserveInput) newSearchText = this.getSearchTextFromQuery();

    this.setState({
      searchText: newSearchText,
    });
  };

  componentDidUpdate = (prevProps) => {
    // check if the current url has changed
    if (prevProps.location.search !== this.props.location.search) {
      let newSearchText = '';

      if (this.props.preserveInput) newSearchText = this.getSearchTextFromQuery();

      this.setState({
        searchText: newSearchText,
      });
    }
  };

  getSearchTextFromQuery = () => {
    const queryString = this.props.location.search;
    const queryParsed = qs.parse(queryString, { ignoreQueryPrefix: true });
    const searchText = queryParsed.q ? queryParsed.q : '';
    return searchText;
  };

  // Modify the search key of the component state
  handleChange = (event) => {
    this.setState({
      searchText: event.target.value,
    });
  };

  // gets the user input
  // and build the url based on it
  handleSearch = (searchText) => {
    const searchUrl = `/search/?${qs.stringify({ q: searchText })}`;
    this.props.history.push(searchUrl);
  };

  render() {
    const { searchText } = this.state;

    return (
      <Search
        placeholder="Search questions here"
        value={searchText}
        onSearch={value => this.handleSearch(value)}
        onChange={e => this.handleChange(e)}
        enterButton="Search"
      />
    );
  }
}

const SearchBar = withRouter(SearchBarNR);
export default SearchBar;
