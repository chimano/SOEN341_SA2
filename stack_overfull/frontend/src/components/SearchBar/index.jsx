import React from "react";
import "./index.css";
import { Redirect } from "react-router-dom";
import qs from "qs";
import { Input } from "antd";
const Search = Input.Search;

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search_text: "",
      search_url: "",
      redirect: false
    };
  }

  // Modify the search key of the component state
  handleChange = value => {
    this.setState({
      search_text: value
    });
  };

  // gets the user input
  // and build the url based on it
  handleSearch = e => {
    e.preventDefault(); // prevent page reload
    const { search_text } = this.state;
    const search_url = "/search/?" + qs.stringify({ q: search_text });

    console.log(search_url);
    this.setState({
      search_url: search_url,
      redirect: true
    });
  };

  render() {
    const { search_text, search_url, redirect } = this.state;

    if (redirect) {
      console.log("Redirecting to", search_url);
      // reset redirect without triggering a state change
      this.state.redirect = false;

      return <Redirect push to={search_url} />;
    }

    return (
      <form onSubmit={this.handleSearch}>
        <Search
          placeholder="Search questions here"
          onSearch={value => this.handleChange(value)}
          enterButton
        />
      </form>
    );
  }
}
