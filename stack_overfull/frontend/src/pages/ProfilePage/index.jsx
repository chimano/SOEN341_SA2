// @flow
import React from 'react';
import {
  getApiUserMe,
  postApiUserMe,
  getApiUserQuestionsAndAnsweredQuestions,
  getApiUserNameJobs,
} from '../../utils/api';
import { Input, Button } from "antd";
import './index.css';
import {
  UserInfo,
  UserQuestionList,
  JobList,
  ProfileTabs
} from '../../components';

type State = {
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  aboutMe: string,
  reputation: string,
  github: string,
  linkedin: string,
  last_login: string,
  downvotedQuestions: Array<Object>,
  upvotedQuestions: Array<Object>,
  questionsAsked: Array<Object>,
  questionsAnswered: Array<Object>,
  jobPostList: Array<Object>,
  is_editing: boolean,
  is_saving_myinfo: boolean,
  is_employer: boolean,
  currentTab: string,
}

export default class ProfilePage extends React.Component<{}, State> {
  state = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    aboutMe: '',
    reputation: '',
    github: '',
    linkedin: '',
    last_login: '',
    downvotedQuestions: [],
    upvotedQuestions: [],
    questionsAsked: [],
    questionsAnswered: [],
    jobPostList: [],
    is_editing: false, // make user info fields editable
    is_saving_myinfo: false, // loading indicator for the edit button
    is_employer: false,
    currentTab: ""
  }

  componentDidMount() {
    this.getMyInfo().then((username) => {
      this.getQuestionsRelatedToUser(username);
      this.getListOfJobsPostedByEmployer(username);
    });
  }

  onInputChange = (field: any, event: any) => {
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

  getQuestionsRelatedToUser = (username:string) => {
    getApiUserQuestionsAndAnsweredQuestions(username)
      .then((response) => {
        this.setState({
          questionsAsked: response.data.asked_questions,
          questionsAnswered: response.data.answered_questions,
          upvotedQuestions: response.data.upvoted_questions,
          downvotedQuestions: response.data.downvoted_questions,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getListOfJobsPostedByEmployer = (username:string) => {
    getApiUserNameJobs(username).then((response) => {
      this.setState({
        jobPostList: response.data.posted_positions,
      });
    });
  };

  getMyInfo = () => new Promise((resolve) => {
    getApiUserMe()
      .then((response) => {
        console.log('response of getApiUserMe(): ', response);
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
          is_employer: response.data.profile.is_employer,
        });
        resolve(response.data.username);
      })
      .catch(error => console.log(error));
  });

  saveMyInfo = () => {
    const {
      email, first_name, last_name, aboutMe, github, linkedin,
    } = this.state;

    this.setState({ is_saving_myinfo: true });

    postApiUserMe(email, first_name, last_name, aboutMe, github, linkedin)
      .then((response) => {
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
      downvotedQuestions,
      upvotedQuestions,
      questionsAsked,
      questionsAnswered,
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
            upvotedQuestions={upvotedQuestions}
            downvotedQuestions={downvotedQuestions}
            questionsAsked={questionsAsked}
            questionsAnswered={questionsAnswered}
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
            <div style={{ width: '70%', paddingLeft: '10px' }}>
              <UserQuestionList
                upvotedQuestions={upvotedQuestions}
                downvotedQuestions={downvotedQuestions}
                questionsAsked={questionsAsked}
                questionsAnswered={questionsAnswered}
              />
            </div>
          </div> */}
          {is_employer ? (
            <div>
              <h3 style={{ paddingTop: '20px' }}> Job Posted</h3>
              <JobList jobList={jobPostList} hasJobApplication hideApplyButton />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
