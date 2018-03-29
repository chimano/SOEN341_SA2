import React from 'react';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import './index.css';

export default class TagList extends React.Component {
  render() {
    const { tags } = this.props;
    return (
      <div className="TagList">
        {tags.map((tag, key) => (
          <Tag key={key} color="#108ee9">
            <Link to={`/tags/${tag}`}>{tag}</Link>
          </Tag>
        ))}
      </div>
    );
  }
}
