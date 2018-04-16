// @flow
import React from 'react';
import {
  getApiUserQuestionsAndAnsweredQuestions,
  getApiUserNameInfo,
  getApiUserNameJobs,
} from '../../utils/api';
import './index.css';
import { UserInfo, UserQuestionList, JobList, ProfileTabs } from '../../components';

type Props = {
  match: Object,
  location: Object,
};

type State = {
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  aboutMe: string,
  reputation: string,
  github: string,
  linkedin: string,
  lastLogin: string,
  downvotedQuestions: Array<Object>,
  upvotedQuestions: Array<Object>,
  questionsAsked: Array<Object>,
  questionsAnswered: Array<Object>,
  jobPostList: Array<Object>,
  isEmployer: boolean,
  currentTab: string,
};

export default class UserPage extends React.Component<Props, State> {
  state = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    aboutMe: '',
    reputation: '',
    github: '',
    linkedin: '',
    lastLogin: '',
    downvotedQuestions: [],
    upvotedQuestions: [],
    questionsAsked: [],
    questionsAnswered: [],
    jobPostList: [],
    isEmployer: false,
    currentTab: 'profile',
  };

  componentDidMount() {
    const { username } = this.props.match.params;
    this.getUserInfo(username).then(() => {
      this.getQuestionsRelatedToUser(username);
      this.getListOfJobsPostedByEmployer(username);
    });
  }

  componentDidUpdate(prevProps: Object) {
    const { username } = this.props.match.params;
    if (prevProps.location !== this.props.location) {
      this.getUserInfo(username).then(() => {
        this.getQuestionsRelatedToUser(username);
        this.getListOfJobsPostedByEmployer(username);
      });
    }
  }

  getListOfJobsPostedByEmployer = (username: string) => {
    getApiUserNameJobs(username).then((response) => {
      this.setState({
        jobPostList: response.data.posted_positions,
      });
    });
  };

  getQuestionsRelatedToUser = (username: string) => {
    getApiUserQuestionsAndAnsweredQuestions(username).then((response) => {
      this.setState({
        questionsAsked: response.data.asked_questions,
        questionsAnswered: response.data.answered_questions,
        upvotedQuestions: response.data.upvoted_questions,
        downvotedQuestions: response.data.downvoted_questions,
      });
    });
  };

  getUserInfo = (username: string): Promise<void> =>
    new Promise((resolve) => {
      getApiUserNameInfo(username).then((response) => {
        this.setState({
          username: response.data.username,
          email: response.data.email,
          aboutMe: response.data.profile.about_me,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          reputation: response.data.profile.reputation,
          github: response.data.profile.github,
          linkedin: response.data.profile.linkedin,
          lastLogin: response.data.last_login,
          isEmployer: response.data.profile.is_employer,
        });
        resolve();
      });
      // .catch(error => console.log(error));
    });

  handleTabsChange = (key: number) => {
    /* eslint-disable no-new */
    new Promise((resolve) => {
      switch (key) {
        case '1':
          this.setState({
            currentTab: 'profile',
          });
          break;
        case '2':
          this.setState({
            currentTab: 'questionasked',
          });
          break;
        case '3':
          this.setState({
            currentTab: 'questionanswered',
          });
          break;
        case '4':
          this.setState({
            currentTab: 'upvotedquestion',
          });
          break;
        case '5':
          this.setState({
            currentTab: 'downvotedquestion',
          });
          break;
        default:
          this.setState({
            currentTab: 'profile',
          });
      }
      resolve();
    });
  };

  render() {
    const {
      username,
      email,
      aboutMe,
      firstName,
      lastName,
      reputation,
      github,
      linkedin,
      lastLogin,
      downvotedQuestions,
      upvotedQuestions,
      questionsAsked,
      questionsAnswered,
      jobPostList,
      isEmployer,
      currentTab,
    } = this.state;
    let showTabPage;
    if (currentTab === '' || currentTab === 'profile') {
      showTabPage = (
        <div className="showTabPage_div" style={{ width: '70%' }}>
          <UserInfo
            username={username}
            email={email}
            firstName={firstName}
            lastName={lastName}
            aboutMe={aboutMe}
            reputation={reputation}
            github={github}
            linkedin={linkedin}
            lastLogin={lastLogin}
          />
        </div>
      );
    } else {
      showTabPage = (
        <div className="showTabPage_div" style={{ width: '90%' }}>
          <UserQuestionList
            upvotedQuestions={upvotedQuestions}
            downvotedQuestions={downvotedQuestions}
            questionsAsked={questionsAsked}
            questionsAnswered={questionsAnswered}
            currentTab={currentTab}
          />
        </div>
      );
    }

    return (
      <div className="body-wrapper grey-background">
        <div className="page-width">
          <ProfileTabs handleTabsChange={this.handleTabsChange} />
          <div>{showTabPage}</div>
          {isEmployer ? (
            <div>
              <h3 style={{ paddingTop: '20px' }}> Job Posted</h3>
              <JobList jobList={jobPostList} />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
