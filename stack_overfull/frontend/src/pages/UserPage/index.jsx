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
      aboutMe: "",
      reputation: "",
      downvoted_questions_id: [],
      upvoted_questions_id: [],
      downvoted_questions: [],
      upvoted_questions: [],
      questions_asked: [],
      questions_answered: [],
      job_posted:[]
      // doRender: false
    };
  }

  componentWillMount() {
    const username = this.props.match.params.username;
    this.getUserInfo(username);
    setTimeout(() => this.getQuestionsRelatedToUser(), 2500);
  }

  getQuestionsRelatedToUser = () => {
    const username = this.props.match.params.username;
    getApiUserQuestionsAndAnsweredQuestions(username)
      .then(response => {
        //Return 2 arrays (question_asked and question_answered)
        var questionsType = Object.keys(response.data);
        var allIds = questionsType.map(t => response.data[t].map(e => e.id));

        this.setState({
          questions_asked_id: allIds[0],
          questions_answered_id: allIds[1]
        });
      })
      .then(() => {
        this.getQuestionsFromIdListAndSetStateOfQuestionList(
          this.state.questions_asked_id
        ).then(list => this.setState({ questions_asked: list }));
      })
      .then(() => {
        this.getQuestionsFromIdListAndSetStateOfQuestionList(
          this.state.questions_answered_id
        ).then(list => this.setState({ questions_answered: list }));
      })
      .then(() => {
        setTimeout(() => this.forceUpdate(), 600);
      });
  };

  getJobRelatedToUser = () => {
    const username = this.props.match.params.username;
    getApiJob(username)
      .then(response => {
        //Return 2 arrays (question_asked and question_answered)
        console.log(response.data);
        var questionsType = Object.keys(response.data);
        var allIds = questionsType.map(t => response.data[t].map(e => e.id));

        this.setState({
          questions_asked_id: allIds[0],
          questions_answered_id: allIds[1]
        });
      })
      .then(() => {
        this.getQuestionsFromIdListAndSetStateOfQuestionList(
          this.state.questions_asked_id
        ).then(list => this.setState({ questions_asked: list }));
      })
      .then(() => {
        this.getQuestionsFromIdListAndSetStateOfQuestionList(
          this.state.questions_answered_id
        ).then(list => this.setState({ questions_answered: list }));
      })
      .then(() => {
        setTimeout(() => this.forceUpdate(), 600);
      });
  };


  getUserInfo = username => {
    getApiUserNameInfo(username)
      .then(response => {
        console.log("response of getApiUserNameInfo(username): ", response);
        this.setState({
          username: response.data.username,
          email: response.data.email,
          aboutMe: response.data.profile.about_me,
          reputation: response.data.profile.reputation,
          downvoted_questions_id: response.data.profile.downvoted_questions,
          upvoted_questions_id: response.data.profile.upvoted_questions
        });
        console.log("UPVOTEDQUESTIONS " + this.state.upvoted_questions_id);
      })
      .then(() => {
        this.getQuestionsFromIdListAndSetStateOfQuestionList(
          this.state.upvoted_questions_id
        ).then(list => this.setState({ upvoted_questions: list }));
        this.getQuestionsFromIdListAndSetStateOfQuestionList(
          this.state.downvoted_questions_id
        ).then(list => this.setState({ downvoted_questions: list }));
      })
      .then(() => {
        setTimeout(() => this.forceUpdate(), 500);
      })
      .catch(error => console.log(error));
  };

  getQuestionsFromIdListAndSetStateOfQuestionList = idList => {
    return new Promise((resolve, reject) => {
      let tempQuestionList = [];
      idList.forEach(id => {
        getApiQuestionById(id)
          .then(response => {
            console.log("response of getApiQuestionById(id): ", response);
            tempQuestionList.push(response.data);
          })
          .catch(error => {
            console.log(error);
          });
      });
      console.log("tempQuestionList", tempQuestionList);
      resolve(tempQuestionList);
    });
  };

  render() {
    const {
      username,
      email,
      aboutMe,
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
            <h3>About Me</h3>
            <div>{aboutMe}</div>
            <h3>Reputation</h3>
            <div>{reputation} points</div>
          </div>
          <div style={{ width: "100%" }}>
            <h3 className="Userpage__question-list-title">
              Upvoted Questions
            </h3>
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
