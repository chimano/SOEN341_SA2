import React from 'react';
import './index.css';
import {withRouter} from "react-router-dom";
import { Redirect } from 'react-router-dom';
import { Link } from "react-router-dom";

export class SearchBar extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        search : '',
        url : '',
        redirect : false
      }
      // binding the context to the SearchBar 
      // because this functions will be executed in a 
      // different context
      this.handleChange = this.handleChange.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
    }
    // Modify the search key of the component state
    handleChange (e) {
      this.setState({
        search : e.target.value
      });
    }
    // gets the user input
    // and build the url based on it
    handleSearch (e) {
      e.preventDefault(); // prevent page reload
      const { search } = this.state;
      const url = "/search/?q=" + search;

    console.log(url)
    this.setState({
        url,
        redirect : true});
    }
  
    render () {
      const { search, url, redirect } = this.state;

    if (redirect) {
          return <Redirect to={"/search/?q=" + search }/>
    }
  
      
      return (
        <form onSubmit={this.handleSearch}>
            <input 
                type="text"
                value={search}
                placeholder="Search questions here"
                onChange={this.handleChange}/>

            <button type="submit" >
                <Link to={"/search/?q=" + search} style={{ color: "white" }}>Search</Link>
            </button>
        </form>
      );
    }
  
  }