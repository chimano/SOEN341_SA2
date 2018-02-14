import axios from "axios";
import qs from "qs";

//get single question by id
export function getApiQuestionById(id) {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/question/",{
        params: {
            id: id
        }
      })
      .then(response => {
        console.log("get question: ", response);
        resolve(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}

//get the list of questions
export function getApiQuestion() {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/question/order=desc/limit=10/")
      .then(response => {
        console.log("get question list: ", response);
        resolve(response.data.question_list);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}

//get answer by id of the question
export function getApiAnswerById(q_id) {
  var id = q_id;
  return new Promise((resolve, reject) => {
    axios
      .get("/api/answer/", {
        params: {
          q_id: id,
          order: "asc",
          limit: 100
        }
      }) //q_id=" + id + "/order=asc/limit=100/")
      .then(response => {
        console.log("get answer response: ", response);
        resolve(response.data.answer_list);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}

//get user info and check whether user is logged in or not
export function getApiUserMe() {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/user/me")
      .then(response => {
        console.log("Get my info: ", response);
        resolve(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}

//post question
export function postApiQuestion(question) {
  axios
    .post("/api/question/", qs.stringify({ question: question }))
    .then(function(response) {
      console.log("post question response: ", response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

//post answer
export function postApiAnswer(answer, q_id) {
  axios
    .post("/api/answer/", {answer: answer, q_id: q_id})
    .then(function(response) {
      console.log("post answer response: ", response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

//vote on answer
export function voteAnswer(vote_type, a_id) {
  axios
    .post("/api/answer/vote/", {vote_type: vote_type, a_id: a_id})
    .then(function(response){
      console.log("post vote response: ", response);
    })
    .catch(function(error){
      console.log(error);
    });
}

//login the user
export function postApiUserLogin(username, password) {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/user/login/", {
        username: username,
        password: password
      })
      .then(response => {
        console.log("login response: ", response);
        resolve(response);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

//logout the user
export function postApiUserLogout() {
  axios
    .post("/api/user/logout/")
    .then(function(response) {
      console.log("logout response: ", response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

//register user
export function postApiUserRegister(username, password) {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/user/register/", {
        username: username,
        password: password
      })
      .then(function(response) {
        console.log("register response: ", response);
        resolve(response);
      })
      .catch(function(error) {
        console.log(error);
        reject(error);
      });
  });
}
