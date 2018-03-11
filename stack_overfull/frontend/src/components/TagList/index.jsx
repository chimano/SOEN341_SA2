import React from "react";
import { Tag } from "antd";
import "./index.css";

export class TagList extends React.Component {
  render() {
    const { tags } = this.props;
    return (
      <div className="TagList">
        {tags.map((tag, key) => (
          <Tag key={key} color="#108ee9">
            {tag}
          </Tag>
        ))}
      </div>
    );
  }
}
