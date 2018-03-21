import React from "react";
import {
  getApiUserMe,
  postApiUserMe,
  getApiQuestionById,
  getApiUserQuestionsAndAnsweredQuestions,
  getApiUserNameInfo
} from "../../utils/api";
import "./index.css";
import { QuestionBox } from "../../components/QuestionBox/index";
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
      is_editing: false, // make user info fields editable
      is_saving_myinfo: false // loading indicator for the edit button
      // doRender: false
    };
  }

  componentWillMount() {
    this.getMyInfo();
    setTimeout(() => this.getQuestionsRelatedToUser(), 2500);
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
          reputation: response.data.profile.reputation
        });
      })
      .catch(error => console.log(error));
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
      is_saving_myinfo
    } = this.state;

    let editButtonElement = (
      <Button
        type="primary"
        size="small"
        onClick={this.onEditButtonClick}
        loading={is_saving_myinfo}
      >
        {is_editing ? "Save" : "Edit"}
      </Button>
    );

    let emailElement = is_editing ? (
      <Input value={email} onChange={e => this.onInputChange("email", e)} />
    ) : (
      <div>{email}</div>
    );

    let firstNameElement = is_editing ? (
      <Input
        value={first_name}
        onChange={e => this.onInputChange("first_name", e)}
      />
    ) : (
      <div>{first_name}</div>
    );

    let lastNameElement = is_editing ? (
      <Input
        value={last_name}
        onChange={e => this.onInputChange("last_name", e)}
      />
    ) : (
      <div>{last_name}</div>
    );

    let aboutMeElement = is_editing ? (
      <Input.TextArea
        value={aboutMe}
        onChange={e => this.onInputChange("aboutMe", e)}
      />
    ) : (
      <div>{aboutMe}</div>
    );

    return (
      <div className="body-wrapper grey-background">
        <div className="page-width" style={{ display: "flex" }}>
          <div className="ProfilePage" style={{ minWidth: "300px" }}>
            <h3>Username</h3>
            <div>{username}</div>
            <h3>Email</h3>
            {emailElement}
            <h3>First Name</h3>
            {firstNameElement}
            <h3>Last Name</h3>
            {lastNameElement}
            <h3>About Me</h3>
            {aboutMeElement}
            <h3>Reputation</h3>
            <div>{reputation} points</div>

            {editButtonElement}
          </div>
          <div style={{ width: "100%" }}>
            <h3 className="ProfilePage__question-list-title">
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
            <h3 className="ProfilePage__question-list-title">
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
        <div className="ProfilePage__question_related_to_user">
          <div className="div_question_asked">
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
          <div className="div_question_answered">
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
        </div>
      </div>
    );
  }
}
