import React from 'react';
import './index.css';

import { Redirect } from 'react-router-dom';
import qs from 'qs'

export class SearchBar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      search_text : '',
      search_url : '',
      redirect : false
    }
  }


  // Modify the search key of the component state
  handleChange = (e) => {
    this.setState({
      search_text : e.target.value
    });
  }

  // gets the user input
  // and build the url based on it
  handleSearch = (e) => {
    e.preventDefault(); // prevent page reload
    const { search_text } = this.state;
    const search_url = "/search/?" + qs.stringify({q:search_text});

    console.log(search_url)
    this.setState({
      search_url:  search_url,
      redirect : true
    });

  }

  render () {
    const { search_text, search_url, redirect } = this.state;

    if (redirect) {
      console.log('Redirecting to', search_url)
      // reset redirect without triggering a state change
      this.state.redirect = false

      return <Redirect to={search_url}/>
    }

    return (
      <form onSubmit={this.handleSearch}>
        <input
          type="text"
          value={search_text}
          placeholder="Search questions here"
          onChange={this.handleChange}/>

        <button type="submit" style={{ color: "white" }}>
          Search
        </button>
      </form>
    );
  }

}
