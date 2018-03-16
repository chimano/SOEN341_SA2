import React from "react";
import { getApiUserMe, getApiQuestionById } from "../../utils/api";
import "./index.css";
import { QuestionBox } from "../../components/QuestionBox/index";

export class ProfilePage extends React.Component {
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
      upvoted_questions: []
    };
  }

  componentWillMount() {
    this.getMyInfo();
  }

  getMyInfo = () => {
    getApiUserMe()
      .then(response => {
        console.log("response of getApiUserMe(): ", response);
        this.setState({
          username: response.data.username,
          email: response.data.email,
          aboutMe: response.data.profile.about_me,
          reputation: response.data.profile.reputation,
          downvoted_questions_id: response.data.profile.downvoted_questions,
          upvoted_questions_id: response.data.profile.upvoted_questions
        });
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
      upvoted_questions
    } = this.state;

    return (
      <div className="body-wrapper grey-background">
        <div className="page-width" style={{ display: "flex" }}>
          <div className="ProfilePage" style={{ minWidth: "300px" }}>
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
      </div>
    );
  }
}
