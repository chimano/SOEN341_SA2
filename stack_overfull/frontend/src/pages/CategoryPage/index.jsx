import React from "react";

export class CategoryPage extends React.Component {
  render() {
    const category = this.props.match.params.category;
    return (
      <div>
        <ul>
          <li>{category} Questions</li>
        </ul>
      </div>
    );
  }
}
