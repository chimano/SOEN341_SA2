import React from "react";
import {
  getApiQuestionById,
  getApiUserQuestionsAndAnsweredQuestions,
  getApiUserNameInfo,
  getApiJob
} from "../../utils/api";
import "./index.css";
import { QuestionBox } from "../../components/QuestionBox/index";
import { JobBox } from "../../components/JobBox/index";

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

  componentWillMount() {
    const username = this.props.match.params.username;
    this.getUserInfo(username);
    setTimeout(() => this.getQuestionsRelatedToUser(), 2500);
  }

  getQuestionsRelatedToUser = () => {
    if(this.props.match.params.username){
      console.log("asjkdhakjsdjkhasdkjasdhjkah")
    }
    const username = this.props.match.params.username;
    getApiUserQuestionsAndAnsweredQuestions(this.state.username).then(
      response => {
        console.log("getApiUserQuestionsAndAnsweredQuestions(this.state.username)",response);
        this.setState({ questions_asked: response.data.asked_questions });
        this.setState({ questions_answered: response.data.answered_questions });
        this.setState({ upvoted_questions: response.data.upvoted_questions });
        this.setState({ downvoted_questions: response.data.downvoted_questions });
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
          <div className="Userpage" style={{ minWidth: "300px" }}>
            <h3>Username</h3>
            <div>{username}</div>
            <h3>Email</h3>
            <div>{email}</div>
            <h3>First Name</h3>
            <div>{first_name}</div>
            <h3>Last Name</h3>
            <div>{last_name}</div>
            <h3>About Me</h3>
            <div>{aboutMe}</div>
            <h3>Reputation</h3>
            <div>{reputation} points</div>
          </div>
          <div style={{ width: "100%" }}>
            <h3 className="Userpage__question-list-title">Upvoted Questions</h3>
            <div>
              {upvoted_questions.map((question, key) => (
                <QuestionBox
                  key={key}
                  date_created={question.date_created
                    .replace("T", " at ")
                    .substring(0, 19)}
                  question_head={question.question_head}
                  q_id={question.id}
                  username={question.user_id.username}
                  points={question.points}
                  showButtons={false}
                  tags={question.tags}
                />
              ))}
            </div>
            <h3 className="Userpage__question-list-title">
              Downvoted Questions
            </h3>
            <div>
              {downvoted_questions.map((question, key) => (
                <QuestionBox
                  key={key}
                  date_created={question.date_created
                    .replace("T", " at ")
                    .substring(0, 19)}
                  question_head={question.question_head}
                  q_id={question.id}
                  username={question.user_id.username}
                  points={question.points}
                  showButtons={false}
                  tags={question.tags}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="UserPage__question_related_to_user">
          <div className="Userpage__div_question_asked">
            <h3> Questions Asked </h3>
            {questions_asked.map((question, key) => (
              <QuestionBox
                key={key}
                date_created={question.date_created
                  .replace("T", " at ")
                  .substring(0, 19)}
                question_head={question.question_head}
                q_id={question.id}
                username={question.user_id.username}
                points={question.points}
                showButtons={false}
                tags={question.tags}
              />
            ))}
          </div>
          <div className="Userpage__div_question_answered">
            <h3> Questions Answered </h3>
            {questions_answered.map((question, key) => (
              <QuestionBox
                key={key}
                date_created={question.date_created
                  .replace("T", " at ")
                  .substring(0, 19)}
                question_head={question.question_head}
                q_id={question.id}
                username={question.user_id.username}
                points={question.points}
                showButtons={false}
                tags={question.tags}
              />
            ))}
          </div>
          <div className="Userpage__div_job_posted">
            <h3>Job posted</h3>
            {job_posted.map((job, key) => (
              <JobBox
                key={key}
                job_id={job.id}
                job_company={job.company}
                job_position={job.position}
                job_location={job.location}
                job_type={job.job_type}
                job_category={job.category}
                job_description={job.description}
                date_created={job.date_posted
                  .replace("T", " at ")
                  .substring(0, 19)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
