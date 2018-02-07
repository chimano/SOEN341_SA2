import React, {Component} from 'react';
import {Input} from 'antd';
import './SearchBar.css';
const Search = Input.Search;

export class SearchBar extends Component {
    render() {
        return (<Search
            placeholder="Search"
            onSearch={value => console.log(value)}
            enterButton/>)
    }
}