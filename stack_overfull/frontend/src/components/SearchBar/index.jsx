import React from 'react';
import './index.css';
import qs from 'qs';

import { withRouter } from 'react-router';
import { Input } from 'antd';

const Search = Input.Search;

// Search bar
// uses withRouter() decorator to access router's props
// Cutsom prop: preserveInput (defaults to false)
class SearchBarNR extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search_text: '',
    };
  }

  getSearchTextFromQuery = () => {
    const query_string = this.props.location.search;
    const query_parsed = qs.parse(query_string, { ignoreQueryPrefix: true });
    const search_text = query_parsed.q ? query_parsed.q : '';
    return search_text;
  };

  componentDidMount = () => {
    let new_search_text = '';

    if (this.props.preserveInput) new_search_text = this.getSearchTextFromQuery();

    this.setState({
      search_text: new_search_text,
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    // check if the current url has changed
    if (prevProps.location.search !== this.props.location.search) {
      let new_search_text = '';

      if (this.props.preserveInput) new_search_text = this.getSearchTextFromQuery();

      this.setState({
        search_text: new_search_text,
      });
    }
  };

  // Modify the search key of the component state
  handleChange = (event) => {
    this.setState({
      search_text: event.target.value,
    });
  };

  // gets the user input
  // and build the url based on it
  handleSearch = (searchText) => {
    const search_url = `/search/?${qs.stringify({ q: searchText })}`;
    console.log('Redirecting to', search_url);
    this.props.history.push(search_url);
  };

  render() {
    const { search_text } = this.state;

    return (
      <Search
        placeholder="Search questions here"
        value={search_text}
        onSearch={value => this.handleSearch(value)}
        onChange={e => this.handleChange(e)}
        enterButton="Search"
      />
    );
  }
}

const SearchBar = withRouter(SearchBarNR);
export default SearchBar;
