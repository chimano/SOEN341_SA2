// @flow
import React from 'react';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import './index.css';
import { QuestionList } from '../../components';
import { getApiQuestion } from '../../utils/api';

type Props = {
  location: Object,
  match: Object,
};

type State = {
  questionList: Array<Object>,
  filters: Array<string>,
};

export default class TagPage extends React.Component<Props, State> {
  state = {
    questionList: [],
    filters: [''],
  };

  componentDidMount = () => {
    this.getQuestionList();
    // this.getTagInfo();
    // this.getMostUsedTagsList();
  };

  componentDidUpdate = (prevProps: any, prevState: any) => {
    // check if the current url has changed
    if (prevProps.location !== this.props.location) {
      this.getQuestionList();
      // this.getTagInfo();
      // this.getMostUsedTagsList();
    }

    // check if the current filters have changed
    if (prevState.filters.length !== this.state.filters.length) {
      this.getQuestionList();
      // this.getTagInfo();
      // this.getMostUsedTagsList();
    }
  };

  getQuestionList = () => {
    // get tagname from url match
    const tagname = this.props.match.params.tags;

    getApiQuestion('desc', 36, 'date_created', [tagname]).then((response) => {
      this.setState({
        questionList: response.data.question_list,
      });
    });
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  // getTagInfo = () => {
  //   // get tagname from url match
  //   const tagname = this.props.match.params.tags;

  //   getApiTagInfo(tagname)
  //     .then((response) => {
  //       this.setState({
  //         tagInfo: response.data,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // getMostUsedTagsList = () => {
  //   getApiTags('desc', '10', 'question_count').then((response) => {
  //     const mostUsedTagsList = [];
  //     // collect tag names from the api response
  //     response.data.tag_list.forEach((tagInfo) => {
  //       mostUsedTagsList.push(tagInfo.tag_text);
  //     });

  //     this.setState({
  //       mostUsedTagsList,
  //     });
  //   });
  // .catch((error) => {
  //   console.log(error);
  // });
  // };

  render() {
    const { questionList } = this.state;
    const { match } = this.props;
    const tagname = match.params.tags;

    const resultsHeaderText = questionList.length
      ? 'Here are the questions found with the selected tag'
      : 'No questions found with the selected tag';

    return (
      <div className="TagPage__wrapper">
        <div div className="TagPage page-width">
          <h3 className="TagPage__question-list-title">
            <div className="TagPage__question-list-title">
              <Tag className="TagPage__tag" color="#108ee9">
                <Link to={`/tags/${tagname}`}>{tagname}</Link>
              </Tag>
              TAG PAGE
            </div>
          </h3>
          <h3 className="TagPage__results">{resultsHeaderText}</h3>
          <QuestionList questionList={questionList} getQuestionList={this.getQuestionList} />
        </div>
      </div>
    );
  }
}
