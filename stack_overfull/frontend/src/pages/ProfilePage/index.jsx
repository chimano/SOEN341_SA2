import React from "react";
import { getApiUserMe, getApiQuestionById, getApiUserQuestionsAndAnsweredQuestions } from "../../utils/api";
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
      upvoted_questions: [],
      questions_asked: [],
      questions_answered: []
    };
  }

  componentWillMount() {
    this.getMyInfo();
    setTimeout(() => this.getQuestionsRelatedToUser(), 2500);
  }

  getQuestionsRelatedToUser = () => {
    getApiUserQuestionsAndAnsweredQuestions(this.state.username)
      .then(response => {
        console.log("response of getApiUserQuestionsAndAnsweredQuestions(): ", response);
        console.log("asked of getApiUserQuestionsAndAnsweredQuestions(): ", response.data.asked_questions.map(function(askedQuestions){askedQuestions.id}));
        console.log("answered of getApiUserQuestionsAndAnsweredQuestions(): ", response.data.answered_questions);

        //////////// THIS RETURNS 2 arrays of IDS
        var questionsType = Object.keys(response.data);
        var allIds = questionsType.map((t) => response.data[t].map((e) => e.id))
        console.log("ALLIDS ", allIds);
        console.log("ALLIDSASKED ", allIds[0]);
        console.log("ALLIDSANSWERED ", allIds[1]);
        //////////////////////////////////////////////
        
        this.setState({
          // questions_asked_id: response.data.asked_questions.map(function(askedQuestions){askedQuestions.id})
          questions_asked_id: allIds[0],//response.data.asked_questions.filter(function(value){ return value.id})
          questions_answered_id: allIds[1]
        });
    })
    .then(() => {
      this.getQuestionsFromIdListAndSetStateOfQuestionList(
        this.state.questions_asked_id
      ).then(list => this.setState({ questions_asked: list })
    )}).then(() => {
      this.getQuestionsFromIdListAndSetStateOfQuestionList(
        this.state.questions_answered_id
      ).then(list => this.setState({ questions_answered: list })
    )});console.log("HEEEEEELLLLLLO"); console.log("STATE " + this.state.questions_asked);
  };

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
      // .then(() => {
      //   this.getQuestionsRelatedToUser();
      // }) 
      .then(() => {
        setTimeout(() => this.forceUpdate(), 500);
      })
      .catch(error => console.log(error));

      console.log("UPQUESTION2 " + this.state.upvoted_questions_id);
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
    console.log("The state of ProfilPage: ", this.state);
    const {
      username,
      email,
      aboutMe,
      reputation,
      downvoted_questions,
      upvoted_questions,
      questions_asked,
      questions_answered
    } = this.state;

    console.log("QUESTION UPDVOTED ARE " + upvoted_questions);
    console.log("QUESTION ASKED ARE " + questions_asked);

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
        <div className="question_related_to_user">
          <div> 
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
        </div>
      </div>
    );
  }
}
