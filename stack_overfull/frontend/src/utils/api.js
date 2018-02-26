import axios from "axios";

//get single question by id
export function getApiQuestionById(id) {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/question/", {
        params: {
          id: id
        }
      })
      .then(response => {
        console.log("get single question: ", response);
        resolve(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}

//get the list of questions
export function getApiQuestion(order, limit, sort) {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/question/", {
        params: {
          order: order,
          limit: limit,
          sort: sort
        }
      })
      .then(response => {
        console.log("get question list: ", response);
        resolve(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}

//get answer by id of the question
export function getApiAnswerById(id, order, limit) {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/answer/", {
        params: {
          q_id: id,
          order: order,
          limit: limit
        }
      })
      .then(response => {
        console.log("get answer by id: ", response);
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
        console.log("get my info: ", response);
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
    .post("/api/question/", 
    { question_head: question.question_head,
      question_text: question.question_text}
    ).then(function(response) {
      console.log("post question response: ", response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

//post answer
export function postApiAnswer(answer, q_id) {
  axios
    .post("/api/answer/", { answer: answer, q_id: q_id })
    .then(function(response) {
      console.log("post answer response: ", response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

//vote on answer, return updated value of points
export function voteAnswer(vote_type, a_id) {
  return new Promise((resolve, reject) => {
    axios
    .post("/api/answer/vote/", {
      vote_type: vote_type, 
      a_id: a_id
    })
    .then(response => {
      console.log("voting response: ", response);
      resolve(response);
    })
    .catch(error => {
      console.log(error);
      reject(error);
    });
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
export function postApiUserRegister(username, password, email) {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/user/register/", {
        username: username,
        password: password,
        email: email
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

//Accept answer
export function postApiAnswerIdAccept(id) {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/answer/"+id+"/accept/")
      .then(function(response) {
        console.log("Accept answer: ", response);
        resolve(response);
      })
      .catch(function(error) {
        console.log(error);
        reject(error);
      });
  });
}

//Reject answer
export function postApiAnswerIdReject(id) {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/answer/"+id+"/reject/")
      .then(function(response) {
        console.log("reject answer: ", response);
        resolve(response);
      })
      .catch(function(error) {
        console.log(error);
        reject(error);
      });
  });
}

//Undo accept answer
export function postApiAnswerIdAcceptUndo(id) {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/answer/"+id+"/accept/undo/")
      .then(function(response) {
        console.log("undo accept answer: ", response);
        resolve(response);
      })
      .catch(function(error) {
        console.log(error);
        reject(error);
      });
  });
}

//Undo reject answer
export function postApiAnswerIdRejectUndo(id) {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/answer/"+id+"/reject/undo/")
      .then(function(response) {
        console.log("undo reject answer: ", response);
        resolve(response);
      })
      .catch(function(error) {
        console.log(error);
        reject(error);
      });
  });
}
