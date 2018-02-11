import axios from "axios";
import qs from "qs";

//get single question by id
export function getApiQuestionById(id) {
  return new Promise((resolve, reject) => {
    axios
<<<<<<< HEAD
      .get("/api/question/" + id)
      .then(response => {
        console.log("get question: ", response);
=======
      .get("/api/question/"+id)
      .then(response => {
        console.log("get question: ",response);
>>>>>>> Issue #19
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
<<<<<<< HEAD
        console.log("get question list: ", response);
=======
        console.log("get question list: ",response);
>>>>>>> Issue #19
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
      .get("/api/answer/q_id=" + id + "/order=asc/limit=100/")
      .then(response => {
<<<<<<< HEAD
        console.log("get answer response: ", response);
=======
        console.log("get answer response: ",response);
>>>>>>> Issue #19
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
<<<<<<< HEAD
        console.log("Get my info: ", response);
=======
        console.log("Get my info: ",response);
>>>>>>> Issue #19
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
<<<<<<< HEAD
      console.log("post question response: ", response);
=======
      console.log("post question response: ",response);
>>>>>>> Issue #19
    })
    .catch(function(error) {
      console.log(error);
    });
}

//post answer
export function postApiAnswer(answer, q_id) {
  var parsedQ_id = parseInt(q_id, 10);
  axios
    .post("/api/answer/", qs.stringify({ answer: answer, q_id: parsedQ_id }))
    .then(function(response) {
<<<<<<< HEAD
      console.log("post answer response: ", response);
=======
      console.log("post answer response: ",response);
>>>>>>> Issue #19
    })
    .catch(function(error) {
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
<<<<<<< HEAD
        console.log("login response: ", response);
=======
        console.log("login response: ",response);
>>>>>>> Issue #19
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
<<<<<<< HEAD
      console.log("logout response: ", response);
=======
      console.log("logout response: ",response);
>>>>>>> Issue #19
    })
    .catch(function(error) {
      console.log(error);
    });
}
<<<<<<< HEAD

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
=======
>>>>>>> Issue #19
