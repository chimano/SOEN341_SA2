// @flow
import React from 'react';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import './index.css';

type Props = {
  tags: Array<string>,
};

const TagList = (props: Props) => {
  const { tags } = props;
  return (
    <div className="TagList">
      {tags.map((tag, key) => (
        <Tag key={key} color="#108ee9">
          <Link to={`/tags/${tag}`}>{tag}</Link>
        </Tag>
      ))}
    </div>
  );
};
export default TagList;
