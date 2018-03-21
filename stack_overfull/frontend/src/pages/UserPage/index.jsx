import React from "react";
import {
  getApiQuestionById,
  getApiUserQuestionsAndAnsweredQuestions,
  getApiUserNameInfo,
  getApiJob
} from "../../utils/api";
import "./index.css";
import {
  QuestionList,
  UserInfo,
  JobBox,
  UserQuestionList
} from "../../components";

export class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      aboutMe: "",
      reputation: "",
      downvoted_questions: [],
      upvoted_questions: [],
      questions_asked: [],
      questions_answered: [],
      job_posted: []
      // doRender: false
    };
  }

  componentDidMount() {
    const username = this.props.match.params.username;
    this.getUserInfo(username);
    setTimeout(() => this.getQuestionsRelatedToUser(), 1000);
  }

  getQuestionsRelatedToUser = () => {
    if (this.props.match.params.username) {
      console.log("asjkdhakjsdjkhasdkjasdhjkah");
    }
    const username = this.props.match.params.username;
    getApiUserQuestionsAndAnsweredQuestions(this.state.username).then(
      response => {
        console.log(
          "getApiUserQuestionsAndAnsweredQuestions(this.state.username)",
          response
        );
        this.setState({
          questions_asked: response.data.asked_questions,
          questions_answered: response.data.answered_questions,
          upvoted_questions: response.data.upvoted_questions,
          downvoted_questions: response.data.downvoted_questions
        });
      }
    );
  };

  getJobRelatedToUser = () => {
    const username = this.props.match.params.username;
  };

  getUserInfo = username => {
    getApiUserNameInfo(username)
      .then(response => {
        console.log("response of getApiUserNameInfo(username): ", response);
        this.setState({
          username: response.data.username,
          email: response.data.email,
          aboutMe: response.data.profile.about_me,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          reputation: response.data.profile.reputation,
          downvoted_questions_id: response.data.profile.downvoted_questions,
          upvoted_questions_id: response.data.profile.upvoted_questions
        });
        console.log("UPVOTEDQUESTIONS " + this.state.upvoted_questions_id);
      })
      .then(() => {
        setTimeout(() => this.forceUpdate(), 500);
      })
      .catch(error => console.log(error));
  };

  render() {
    const {
      username,
      email,
      aboutMe,
      first_name,
      last_name,
      reputation,
      downvoted_questions,
      upvoted_questions,
      questions_asked,
      questions_answered,
      job_posted
    } = this.state;

    return (
      <div className="body-wrapper grey-background">
        <div className="page-width" style={{ display: "flex" }}>
          <div style={{ width: "30%" }}>
            <UserInfo
              username={username}
              email={email}
              first_name={first_name}
              last_name={last_name}
              aboutMe={aboutMe}
              reputation={reputation}
              no_edit
            />
          </div>

          <div style={{ width: "70%", paddingLeft: "10px" }}>
            <UserQuestionList
              upvoted_questions={upvoted_questions}
              downvoted_questions={downvoted_questions}
              questions_asked={questions_asked}
              questions_answered={questions_answered}
            />
          </div>
        </div>
      </div>
    );
  }
}
