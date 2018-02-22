import React from 'react';
import {Input} from 'antd';
import './index.css';
const Search = Input.Search;
import {withRouter} from "react-router-dom";

export class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
      console.log('Click happened');
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Search questions here"  id="query" name="search/?q="/>
                <input type="submit" value="Search" 
                onclick="onLoadConfigPress(document.getElementById('search/?q=').value)" />
            </form>
          );
        }
      }


