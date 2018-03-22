import React from "react";
import {
  getApiUserMe,
  postApiUserMe,
  getApiQuestionById,
  getApiUserQuestionsAndAnsweredQuestions,
  getApiUserNameInfo,
  getApiUserNameJobs
} from "../../utils/api";
import "./index.css";
import {
  QuestionList,
  UserInfo,
  UserQuestionList,
  JobList
} from "../../components";
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
      downvoted_questions: [],
      upvoted_questions: [],
      questions_asked: [],
      questions_answered: [],
      jobPostList: [],
      is_editing: false, // make user info fields editable
      is_saving_myinfo: false, // loading indicator for the edit button
      is_employer: false
    };
  }

  componentDidMount() {
    this.getMyInfo().then(username => {
      this.getQuestionsRelatedToUser(username);
      this.getListOfJobsPostedByEmployer(username);
    });
  }

  getListOfJobsPostedByEmployer = username => {
    getApiUserNameJobs(username).then(response => {
      this.setState({
        jobPostList: response.data.posted_positions
      });
    });
  };

  getQuestionsRelatedToUser = username => {
    getApiUserQuestionsAndAnsweredQuestions(username)
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
    return new Promise(resolve => {
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
            is_employer: response.data.profile.is_employer
          });
          resolve(response.data.username);
        })
        .catch(error => console.log(error));
    });
  };

  saveMyInfo = () => {
    const { email, first_name, last_name, aboutMe } = this.state;

    this.setState({ is_saving_myinfo: true });

    postApiUserMe(email, first_name, last_name, aboutMe)
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
      downvoted_questions,
      upvoted_questions,
      questions_asked,
      questions_answered,
      is_editing,
      is_saving_myinfo,
      is_employer,
      jobPostList
    } = this.state;

    return (
      <div className="body-wrapper grey-background">
        <div className="page-width">
          <div style={{ display: "flex" }}>
            <div style={{ width: "30%" }}>
              <UserInfo
                is_editing={is_editing}
                onInputChange={this.onInputChange}
                onEditButtonClick={this.onEditButtonClick}
                is_saving_myinfo={is_saving_myinfo}
                username={username}
                email={email}
                first_name={first_name}
                last_name={last_name}
                aboutMe={aboutMe}
                reputation={reputation}
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
          {is_employer ? (
            <div>
              <h3 style={{ paddingTop: "20px" }}> Job Posted</h3>
              <JobList jobList={jobPostList} hasJobApplication hideApplyButton />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
