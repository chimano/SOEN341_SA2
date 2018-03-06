import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

export class CategoryListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [
        "business",
        "cooking",
        "entertainment",
        "fashion",
        "programming",
        "social",
        "technology"
      ]
    };
  }
  render() {
    const { categoryList } = this.state;
    return (
      <header>
        <nav>
          <div>
            <h1 className="welcomeTitle1">
              Welcome to the Questions Categories tab!
            </h1>
            <h3 className="welcomeTitle2">
              Here you can find all the questions divided into different
              categories.
            </h3>
          </div>

          <div className="categoryBox">
            <ul className="bubbles">
              {categoryList.map((category, key) => (
                <li key={key}>
                  <Link
                    to={`/categories/${category}`}
                    style={{ color: "black" }}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
