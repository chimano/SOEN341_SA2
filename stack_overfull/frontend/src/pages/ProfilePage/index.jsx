import React from "react";
import {
  getApiUserMe,
  postApiUserMe,
  getApiQuestionById,
  getApiUserQuestionsAndAnsweredQuestions,
  getApiUserNameInfo
} from "../../utils/api";
import "./index.css";
import { QuestionList, UserInfo } from "../../components";
import { Input, Button } from "antd";

export class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      aboutMe: "",
      reputation: "",
      github: "",
      linkedin: "",
      last_login: "",
      downvoted_questions: [],
      upvoted_questions: [],
      questions_asked: [],
      questions_answered: [],
      is_editing: false, // make user info fields editable
      is_saving_myinfo: false // loading indicator for the edit button
    };
  }

  componentDidMount() {
    this.getMyInfo();
    setTimeout(() => this.getQuestionsRelatedToUser(), 1000);
  }

  getQuestionsRelatedToUser = () => {
    getApiUserQuestionsAndAnsweredQuestions(this.state.username)
      .then(response => {
        this.setState({
          questions_asked: response.data.asked_questions,
          questions_answered: response.data.answered_questions,
          upvoted_questions: response.data.upvoted_questions,
          downvoted_questions: response.data.downvoted_questions
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onInputChange = (field, event) => {
    this.setState({ [field]: event.target.value });
  };

  onEditButtonClick = () => {
    const { is_editing } = this.state;

    // save the info if the user was editing it
    if (is_editing) {
      this.saveMyInfo();
    }

    // toggle the button between Save and Edit
    this.setState({ is_editing: !is_editing });
  };

  getMyInfo = () => {
    getApiUserMe()
      .then(response => {
        console.log("response of getApiUserMe(): ", response);
        this.setState({
          username: response.data.username,
          email: response.data.email,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          aboutMe: response.data.profile.about_me,
          reputation: response.data.profile.reputation,
          github: response.data.profile.github,
          linkedin: response.data.profile.linkedin,
          last_login: response.data.last_login
        });
      })
      .catch(error => console.log(error));
  };

  saveMyInfo = () => {
    const { email, first_name, last_name, aboutMe, github, linkedin } = this.state;

    this.setState({ is_saving_myinfo: true });

    postApiUserMe(email, first_name, last_name, aboutMe, github, linkedin)
      .then(response => {
        console.log("response of postApiUserMe(): ", response);
        this.setState({ is_saving_myinfo: false });
      })
      .catch(error => console.log(error));
  };

  render() {
    console.log("my state", this.state);
    const {
      username,
      email,
      first_name,
      last_name,
      aboutMe,
      reputation,
      github,
      linkedin,
      last_login,
      downvoted_questions,
      upvoted_questions,
      questions_asked,
      questions_answered,
      is_editing,
      is_saving_myinfo
    } = this.state;

    return (
      <div className="body-wrapper grey-background">
        <div className="page-width" style={{ display: "flex" }}>
          <div style={{minWidth:"15%", marginRight:"15px"}}>
            <UserInfo
              is_editing={is_editing}
              onInputChange={this.onInputChange}
              onEditButtonClick = {this.onEditButtonClick}
              is_saving_myinfo={is_saving_myinfo}
              username = {username}
              email = {email}
              first_name = {first_name}
              last_name = {last_name}
              aboutMe = {aboutMe}
              reputation = {reputation}
              github={github}
              linkedin={linkedin}
              last_login={last_login}
          />
          </div>

          <div style={{ width: "100%" }}>
            <h3 className="ProfilePage__question-list-title">
              Upvoted Questions
            </h3>
            <QuestionList questionList={upvoted_questions} />
            <h3 className="ProfilePage__question-list-title">
              Downvoted Questions
            </h3>
            <QuestionList questionList={downvoted_questions} />
            <h3 className="ProfilePage__question-list-title">
              Questions Asked
            </h3>
            <QuestionList questionList={questions_asked} />
            <h3 className="ProfilePage__question-list-title">
              Questions Answered
            </h3>
            <QuestionList questionList={questions_answered} />
          </div>
        </div>
      </div>
    );
  }
}
