import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "antd";
import "./index.css";
import {
  QuestionList,
  HottestTagList,
} from "../../components";
import {
  getApiTags,
} from "../../utils/api";
import qs from "qs";


export class CategoryListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionList: [],
      order: "desc",
      title: "All",
      filters: [""],
      tagInfo: {},
      mostUsedTagsList: [],

      categoryList: [
        "business",
        "cooking",
        "entertainment",
        "fashion",
        "programming",
        "social",
        "technology"
      ],
    };
  }

  componentWillMount = () => {
    this.getMostUsedTagsList();
  };

  getMostUsedTagsList = () => {

    getApiTags("desc", "10", "question_count")
      .then(response => {
        console.log(
          'response of getApiTags("desc", 10, "question_count")',
          response
        );

        let mostUsedTagsList = []
        //collect tag names from the api response
        response.data.tag_list.forEach(tagInfo => {
            mostUsedTagsList.push(tagInfo.tag_text)
        })

        this.setState({
          mostUsedTagsList: mostUsedTagsList
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    console.log("CategoryListPage state: ", this.state);

    const { categoryList, filters, tagname = this.props.match.params.tags, mostUsedTagsList} = this.state;

    let hottestTags = "";
    if (mostUsedTagsList) {
      hottestTags = <HottestTagList hotTags={mostUsedTagsList} />;
    }

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
                  <Tag key={key} color="#108ee9">
                    <Link to={`/tags/${category}`}>{category}</Link>
                  </Tag>
                </li>
              ))}
            </ul>
          </div>

            <h3 className="welcomeTitle2">
            <br />
              HOTTEST TAGS
            </h3>

          <div className="categoryBox">
            <ul className="bubbles">
            {hottestTags}
            </ul>
          </div>
   
        <br />
        </nav>
      </header>
    );
  }
}
