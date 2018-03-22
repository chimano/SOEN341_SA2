import React from "react";
import {
  getApiQuestionById,
  getApiUserQuestionsAndAnsweredQuestions,
  getApiUserNameInfo,
  getApiJob,
  getApiUserNameJobs
} from "../../utils/api";
import "./index.css";
import {
  QuestionList,
  UserInfo,
  JobBox,
  UserQuestionList,
  JobList
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
      github: "",
      linkedin: "",
      last_login: "",
      downvoted_questions: [],
      upvoted_questions: [],
      questions_asked: [],
      questions_answered: [],
      jobPostList: [],
      is_employer: false
      // doRender: false
    };
  }

  componentDidMount() {
    const username = this.props.match.params.username;
    this.getUserInfo(username).then(username => {
      this.getQuestionsRelatedToUser(username);
      this.getListOfJobsPostedByEmployer(username);
    });
  }

  getListOfJobsPostedByEmployer = username => {
    getApiUserNameJobs(username).then(response => {
      console.log("getApiUserNameJobs(username): ", response);
      this.setState({
        jobPostList: response.data.posted_positions
      });
    });
  };

  getQuestionsRelatedToUser = username => {
    getApiUserQuestionsAndAnsweredQuestions(username).then(response => {
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
    });
  };

  getJobRelatedToUser = () => {
    const username = this.props.match.params.username;
  };

  getUserInfo = username => {
    return new Promise(resolve => {
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
            github: response.data.profile.github,
            linkedin: response.data.profile.linkedin,
            last_login: response.data.last_login,
            downvoted_questions_id: response.data.profile.downvoted_questions,
            upvoted_questions_id: response.data.profile.upvoted_questions,
            is_employer: response.data.profile.is_employer
          });
          resolve(response.data.username);
        })
        .catch(error => console.log(error));
    });
  };

  render() {
    console.log(this.state);
    const {
      username,
      email,
      aboutMe,
      first_name,
      last_name,
      reputation,
      github,
      linkedin,
      last_login,
      downvoted_questions,
      upvoted_questions,
      questions_asked,
      questions_answered,
      jobPostList,
      is_employer
    } = this.state;

    return (
      <div className="body-wrapper grey-background">
        <div className="page-width">
          <div style={{ display: "flex" }}>
            <div style={{minWidth:"15%", marginRight:"15px"}}>
              <UserInfo
                username={username}
                email={email}
                first_name={first_name}
                last_name={last_name}
                aboutMe={aboutMe}
                reputation={reputation}
                github={github}
                linkedin={linkedin}
                last_login={last_login}
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
          {is_employer ? (
            <div>
              <h3 style={{ paddingTop: "20px" }}> Job Posted</h3>
              <JobList jobList={jobPostList} />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
