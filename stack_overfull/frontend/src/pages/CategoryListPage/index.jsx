// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import './index.css';
import { HottestTagList } from '../../components';
import { getApiTags } from '../../utils/api';

type State = {
  mostUsedTagsList: Array<string>,
  categoryList: Array<string>,
};

export default class CategoryListPage extends React.Component<{}, State> {
  state = {
    mostUsedTagsList: [],

    categoryList: [
      'business',
      'cooking',
      'entertainment',
      'fashion',
      'programming',
      'social',
      'technology',
    ],
  };

  componentWillMount = () => {
    this.getMostUsedTagsList();
  };

  getMostUsedTagsList = () => {
    getApiTags('desc', '10', 'question_count').then((response) => {
      const mostUsedTagsList = [];
      // collect tag names from the api response
      response.data.tag_list.forEach((tagInfo) => {
        mostUsedTagsList.push(tagInfo.tag_text);
      });
      this.setState({
        mostUsedTagsList,
      });
    });
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  render() {
    const { categoryList, mostUsedTagsList } = this.state;

    let hottestTags = '';
    if (mostUsedTagsList) {
      hottestTags = <HottestTagList hotTags={mostUsedTagsList} />;
    }

    return (
      <header className="body-wrapper">
        <nav>
          <div>
            <h1 className="CategoryListPage__welcomeTitle1">QUESTION CATEGORIES AND TAGS</h1>

            <h3 className="CategoryListPage__welcomeTitle2">
              <br />
              MAIN CATEGORIES
            </h3>
          </div>

          <div className="CategoryListPage__categoryBox">
            <ul className="CategoryListPage__bubbles">
              {categoryList.map((category, key) => (
                <li key={key}>
                  <Tag color="#108ee9">
                    <Link to={`/tags/${category}`}>{category}</Link>
                  </Tag>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="CategoryListPage__welcomeTitle2">
            <br />
            HOTTEST TAGS
          </h3>

          <div className="CategoryListPage__categoryBox">
            <ul className="CategoryListPage__bubbles">{hottestTags}</ul>
          </div>

          <br />
        </nav>
      </header>
    );
  }
}
