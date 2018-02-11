import React from "react";
import "./index.css";
import {
  NavigationBar,
  SignUpFormWindow,
  SignInFormWindow,
  QuestionList,
  Footer
} from "../../components";
import {
  getApiQuestion,
  postApiQuestion,
  postApiAnswer,
  postApiUserLogout,
  getApiUserMe
} from "../../utils/api";

export class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open_signin: false,
      open_signup: false,
      logged_in: false,
      showCreateQuestionBox: false,
      username: "",
      questionList: [],
      answerList: []
    };

    this.getQuestionList();
    this.handle_login();
  }

  getQuestionList = () => {
    axios
      .get("/api/question/", {
          params: {
              order: 'desc',
              limit: 10
          }
      })
      .then(response => {
        console.log(response);
        this.setState({
          questionList: response.data.question_list
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  createQuestion = question => {
    axios
      .post("/api/question/", { question: question })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    setTimeout(() => this.getQuestionList(), 100);
  };

  answerQuestion(answer, q_id) {
    var parsedQ_id = parseInt(q_id);
    console.log("parsed_q_id", parsedQ_id);
    console.log("answer:", answer);
    axios
      .post("/api/answer/", { answer: answer, q_id: parsedQ_id })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  handle_signup_button = () => {
    this.setState({ open_signup: true, open_signin: false });
  };

  handle_signin_button = () => {
    this.setState({ open_signin: true, open_signup: false });
  };

  handle_close_button = () => {
    this.setState({ open_signin: false, open_signup: false });
  };
  handle_login = username => {
    getApiUserMe().then((response)=>{
      if(!response.error){
        this.setState({ logged_in: true, username: response.data.username });        
      }
    })
  };
  handle_logout = () => {
    postApiUserLogout()
    this.setState({ logged_in: false, username: "" });
  };
  handleAskQuestionButton = () => {
    if (this.state.username === "") {
      this.handle_signin_button();
    } else {
      this.openCreateQuestionBox();
    }
  };
  openCreateQuestionBox = () => {
    this.setState({ showCreateQuestionBox: true });
  };
  closeCreateQuestionBox = () => {
    this.setState({ showCreateQuestionBox: false });
  };

  render() {
    console.log(this.state);

    var login_box;
    if (this.state.open_signin === true) {
      login_box = (
        <div className="login-wrap">
          <SignInFormWindow
            handle_close_button={this.handle_close_button}
            handle_login={this.handle_login}
          />
        </div>
      );
    } else if (this.state.open_signup === true) {
      login_box = (
        <div className="login-wrap">
          <SignUpFormWindow
            handle_close_button={this.handle_close_button}
            handle_login={this.handle_login}
          />
        </div>
      );
    } else {
      login_box = "";
    }

    return (
      <div>
        <NavigationBar
          handle_signup_button={this.handle_signup_button}
          handle_signin_button={this.handle_signin_button}
          handle_logout={this.handle_logout}
          logged_in={this.state.logged_in}
          username={this.state.username}
        />
        {login_box}
        <div className="main">
          <QuestionList
            handleAskQuestionButton={this.handleAskQuestionButton}
            showTopQuestions={this.state.showTopQuestions}
            title={this.state.title}
            username={this.state.username}
            questionList={this.state.questionList}
            createQuestion={this.createQuestion}
            answerQuestion={this.answerQuestion}
            handleShowTopQuestions={this.handleShowTopQuestions}
            showCreateQuestionBox={this.state.showCreateQuestionBox}
            closeCreateQuestionBox={this.closeCreateQuestionBox}
          />
        </div>
        <div className="footer-area">
          <Footer handle />
        </div>
      </div>
    );
  }
}
