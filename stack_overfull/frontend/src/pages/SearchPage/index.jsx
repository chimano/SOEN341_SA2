import React from "react";

import {
  QuestionList,
  Footer,
} from "../../components";

import {
  getApiSearch,
  getApiUserMe,
  postApiUserLogout,
} from "../../utils/api";

import "./index.css";
import qs from "qs"

export class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questionList: [],
      username: ""
    };
  }

  componentDidMount = () => {
    this.getSearchQuestionList();
  };

  componentDidUpdate = (prevProps, prevState) => {

    // check if the current url has changed
    if ( prevProps.location.search != this.props.location.search ) {
      console.log('Fetching new SeachPage question list')

      // get a new question list
      this.getSearchQuestionList();
    }

  }

  getSearchQuestionList = () => {

    // get the query string from url (react includes '?' in the query string)
    const query_string = this.props.location.search

    // get the 'q' url parameter from the current url ie /search/?q=<search text>
    const query_parsed = qs.parse( query_string, { ignoreQueryPrefix: true })
    const q = query_parsed.q

    console.log("Search query('q=') captured as url parameter:", q)

    // do api call
    getApiSearch(q, "desc", 36, "date_created").then(response => {
      this.setState({
        questionList: response.data.question_list
      });
    });

  };

  handle_signup_button = () => {
    this.setState({ open_signup: true, open_signin: false });
  };

  handle_signin_button = () => {
    this.setState({ open_signin: true, open_signup: false });
  };

  handle_close_button = () => {
    this.setState({ open_signin: false, open_signup: false });
  };
  handle_login = username => {
    getApiUserMe().then(response => {
      if (!response.error) {
        this.setState({ logged_in: true, username: response.data.username });
      }
    });
  };
  handle_logout = () => {
    postApiUserLogout();
    this.setState({ logged_in: false, username: "" });
  };

  render() {
    console.log("SearchPage state: ", this.state);

    const { questionList, username } = this.state;

    return (
      <div className="seachpage-wrapper">
        <div className="seachpage-box">
          <div>
            <h2 className="question-list-title">Search</h2>
            { questionList.length
              ? (<h3 className="results">Here are the results found</h3>)
              : (<h3 className="results">No results found</h3>)}
          </div>
          <QuestionList questionList={questionList} />
        </div>
      </div>
    );
  }
}
