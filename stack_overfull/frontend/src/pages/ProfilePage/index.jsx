// @flow
import React from 'react';
import {
  getApiUserMe,
  postApiUserMe,
  getApiUserQuestionsAndAnsweredQuestions,
  getApiUserNameJobs,
} from '../../utils/api';
import './index.css';
import {
  UserInfo,
  UserQuestionList,
  JobList,
  ProfileTabs,
} from '../../components';

type Props = {
  currentUsername: string,
}

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
  isEditing: boolean,
  isSavingMyInfo: boolean,
  isEmployer: boolean,
  currentTab: string,
}

export default class ProfilePage extends React.Component<Props, State> {
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
    isEditing: false, // make user info fields editable
    isSavingMyInfo: false, // loading indicator for the edit button
    isEmployer: false,
    currentTab: '',
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
    const { isEditing } = this.state;

    // save the info if the user was editing it
    if (isEditing) {
      this.saveMyInfo();
    }

    // toggle the button between Save and Edit
    this.setState({ isEditing: !isEditing });
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

  getMyInfo = ():Promise<string> => new Promise((resolve) => {
    getApiUserMe()
      .then((response) => {
        this.setState({
          username: response.data.username,
          email: response.data.email,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          aboutMe: response.data.profile.about_me,
          reputation: response.data.profile.reputation,
          github: response.data.profile.github,
          linkedin: response.data.profile.linkedin,
          lastLogin: response.data.last_login,
          isEmployer: response.data.profile.is_employer,
        });
        resolve(response.data.username);
      })
      .catch(error => console.log(error));
  });

  saveMyInfo = () => {
    const {
      email, firstName, lastName, aboutMe, github, linkedin,
    } = this.state;

    this.setState({ isSavingMyInfo: true });

    postApiUserMe(email, firstName, lastName, aboutMe, github, linkedin)
      .then(() => {
        this.setState({ isSavingMyInfo: false });
      })
      .catch(error => console.log(error));
  };

  handleTabsChange = (key:number) => {
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
      firstName,
      lastName,
      aboutMe,
      reputation,
      github,
      linkedin,
      lastLogin,
      downvotedQuestions,
      upvotedQuestions,
      questionsAsked,
      questionsAnswered,
      isEditing,
      isSavingMyInfo,
      isEmployer,
      currentTab,
      jobPostList,
    } = this.state;

    const { currentUsername } = this.props;

    let showTabPage;
    if (currentTab === '' || currentTab === 'profile') {
      showTabPage = (
        <div className="showTabPage_div" style={{ width: '70%' }}>
          <UserInfo
            isEditing={isEditing}
            onInputChange={this.onInputChange}
            onEditButtonClick={this.onEditButtonClick}
            isSavingMyInfo={isSavingMyInfo}
            username={username}
            email={email}
            firstName={firstName}
            lastName={lastName}
            aboutMe={aboutMe}
            reputation={reputation}
            github={github}
            linkedin={linkedin}
            lastLogin={lastLogin}
            currentUsername={currentUsername}
            isEditable
          />
        </div>
      );
    } else {
      showTabPage = (
        <div className="showTabPage_div" >
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
          <div>
            {showTabPage}
          </div>
          {isEmployer ? (
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
