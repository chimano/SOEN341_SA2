import React from 'react';
import {Input} from 'antd';
import './index.css';
const Search = Input.Search;

export class SearchBar extends React.Component {
    render() {
        return (
            <Search
                placeholder="Search"
                onSearch={value => console.log(value)}
                enterButton
            />
        )
    }
}