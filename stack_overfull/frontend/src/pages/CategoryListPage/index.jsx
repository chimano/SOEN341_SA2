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
      ],

      hottestTags: [
        "python",
        "react",
        "django",
        "school",
        "concordia",
        "internship",
      ],

    };
  }
  render() {
    const { categoryList, hottestTags } = this.state;
    return (
      <header>
        <nav>
          <div>
            <h1 className="welcomeTitle1">
             QUESTION CATEGORIES AND TAGS
            </h1>
          
            <h3 className="welcomeTitle2">
            <br />
              MAIN CATEGORIES
            </h3>
          </div>

          <div className="categoryBox">
            <ul className="bubbles">
              {categoryList.map((category, key) => (
                <li key={key}>
                  <Link
                    to={`/tags/${category}`}
                    style={{ color: "rgb(38, 18, 155)" }}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
   
        <br />
        </nav>
      </header>
    );
  }
}
