import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "antd";
import "./index.css";

export class HottestTagList extends React.Component {
  render() {
    const { hotTags } = this.props;
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
  }
}


