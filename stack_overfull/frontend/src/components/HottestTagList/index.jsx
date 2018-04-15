// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import './index.css';

type Props = {
  hotTags: Array<string>,
};

const HottestTagList = (props: Props) => {
  const { hotTags } = props;
  return (
    <div className="HottestTagList">
      {hotTags.map((tag, key) => (
        <li key={key}>
          <Tag key={key} color="#108ee9">
            <Link to={`/tags/${tag}`}>{tag}</Link>
          </Tag>
        </li>
      ))}
    </div>
  );
};
export default HottestTagList;
