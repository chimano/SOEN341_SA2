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
  JobList,
  ProfileTabs
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
      github: "",
      linkedin: "",
      last_login: "",
      downvoted_questions: [],
      upvoted_questions: [],
      questions_asked: [],
      questions_answered: [],
      jobPostList: [],
      is_editing: false, // make user info fields editable
      is_saving_myinfo: false, // loading indicator for the edit button
      is_employer: false,
      currentTab: ""
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
            github: response.data.profile.github,
            linkedin: response.data.profile.linkedin,
            last_login: response.data.last_login,
            is_employer: response.data.profile.is_employer
          });
          resolve(response.data.username);
        })
        .catch(error => console.log(error));
    });
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

  handleTabsChange = key => {
    new Promise(resolve => {
      switch (key) {
        case "1":
          this.setState({
            currentTab: "profile"
          });
          break;
        case "2":
          this.setState({
            currentTab: "questionasked"
          });
          break;
        case "3":
          this.setState({
            currentTab: "questionanswered"
          });
          break;
        case "4":
          this.setState({
            currentTab: "upvotedquestion"
          });
          break;
        case "5":
          this.setState({
            currentTab: "downvotedquestion"
          });
          break;        
      }
      resolve();
    })
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
      is_saving_myinfo,
      is_employer,
      currentTab,
      jobPostList
    } = this.state;

    let showTabPage;
    if(currentTab == "" || currentTab == "profile") {
      showTabPage = (
        <div className="showTabPage_div" style={{width:"70%"}}>
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
            github={github}
            linkedin={linkedin}
            last_login={last_login}
          />
        </div>
      );
    } else {
      showTabPage = (
        <div className="showTabPage_div" style={{width:"90%"}}>
          <UserQuestionList
            upvoted_questions={upvoted_questions}
            downvoted_questions={downvoted_questions}
            questions_asked={questions_asked}
            questions_answered={questions_answered}
            current_tab={currentTab}
          />
        </div>
      );
    }

    return (
      <div className="body-wrapper grey-background">
        <div className="page-width">
        <ProfileTabs handleTabsChange={this.handleTabsChange} />
          <div>
            {showTabPage}
          </div>
          {/* <div style={{ display: "flex" }}>
            <div style={{width:"30%", marginRight:"10px"}}>
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
                github={github}
                linkedin={linkedin}
                last_login={last_login}
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
          </div> */}
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
