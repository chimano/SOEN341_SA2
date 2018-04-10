// @flow
import React from 'react';
import {
  getApiUserQuestionsAndAnsweredQuestions,
  getApiUserNameInfo,
  getApiUserNameJobs,
} from '../../utils/api';
import './index.css';
import { UserInfo, UserQuestionList, JobList } from '../../components';

type Props = {
  match: Object,
  user: Object,
  location: Object,
};

type State = {
  user: Object,
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
};

export default class UserPage extends React.Component<Props, State> {
  state = {
    user: {},
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
  };

  componentDidMount() {
    const { username } = this.props.match.params;
    this.getUserInfo(username).then(() => {
      this.getQuestionsRelatedToUser(username);
      this.getListOfJobsPostedByEmployer(username);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const username = this.props.match.params.username;
    if (prevProps.location !== this.props.location) {
      console.log(prevProps.location);
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
        upvotedQuestions: response.data.upvotedQuestions,
        downvotedQuestions: response.data.downvotedQuestions,
      });
    });
  };

  getUserInfo = (username: string): Promise<void> =>
    new Promise((resolve) => {
      getApiUserNameInfo(username).then((response) => {
        this.setState({
          user: response.data,
          username: response.data.username,
          email: response.data.email,
          aboutMe: response.data.profile.about_me,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          reputation: response.data.profile.reputation,
          github: response.data.profile.github,
          linkedin: response.data.profile.linkedin,
          lastLogin: response.data.lastLogin,
          isEmployer: response.data.profile.isEmployer,
        });
        resolve();
      });
      // .catch(error => console.log(error));
    });

  render() {
    const {
      user,
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
    } = this.state;

    return (
      <div className="body-wrapper grey-background">
        <div className="page-width">
          <div style={{ display: 'flex' }}>
            <div style={{ width: '30%', marginRight: '10px' }}>
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
                no_edit
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
          </div>
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
