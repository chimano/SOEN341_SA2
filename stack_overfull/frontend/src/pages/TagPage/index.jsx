import React from "react";
import "./index.css";
import {
  QuestionList,
  SearchFiltersBar,
  SearchBar
} from "../../components";
import {
  getApiQuestion,
  getApiTags,
  getApiTagInfo
} from "../../utils/api";

export class TagPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionList: [],
      order: "desc",
      title: "All",
      filters: [""],
      tagInfo: {},
      mostUsedTagsList: [],
    };
  }

  componentDidMount = () => {
    this.getQuestionList();
    this.getTagInfo();
    this.getMostUsedTagsList();
  };

  getQuestionList = () => {
    // get tagname from url match
    const tagname = this.props.match.params.tags

    getApiQuestion("desc", 36, "date_created", [tagname])
      .then(response => {
        console.log(
          'response of getQuestion(desc",36,"date_created", ["<tagname>"])',
          response
        );
        this.setState({
          questionList: response.data.question_list
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getTagInfo = () => {
    // get tagname from url match
    const tagname = this.props.match.params.tags

    getApiTagInfo(tagname)
      .then(response => {
        console.log(
          "response of getApiTagInfo(tagname)",
          response
        );
        this.setState({
          tagInfo: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
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
    console.log("TagPage state: ", this.state);

    const { questionList, filters } = this.state;

    let resultsHeaderText = questionList.length
    ? "Here are the questions found with the selected tag"
    : "No questions found with the selected tag";

    return (
        <div className="TagPage-wrapper">
          <div className="TagPage page-width">
            <h2 className="TagPage__question-list-title">Search</h2>
            <div style={{ paddingBottom: "15px" }}>
              <SearchBar />
            </div>
            <div className="TagPage__search-filters-bar">
              <SearchFiltersBar
                defaultFilters={filters}
                onFiltersChange={this.handleFiltersChange}
              />
            </div>
            <h3 className="TagPage__results">{resultsHeaderText}</h3>

            <QuestionList
            questionList={questionList}
            getQuestionList={this.getQuestionList}
            />
          </div>
        </div>
      );
  }
}
