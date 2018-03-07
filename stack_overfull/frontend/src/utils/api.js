import axios from "axios";

//get single question by id
export function getApiQuestionById(id) {
  return axios.get("/api/question/", {
    params: {
      id: id
    }
  });
}

//get the list of questions
export function getApiQuestion(order, limit, sort) {
  return axios.get("/api/question/", {
    params: {
      order: order,
      limit: limit,
      sort: sort
    }
  });
}

//get answer by id of the question
export function getApiAnswerById(id, order, limit) {
  return axios.get("/api/answer/", {
    params: {
      q_id: id,
      order: order,
      limit: limit
    }
  });
}

//get user info and check whether user is logged in or not
export function getApiUserMe() {
  return axios.get("/api/user/me");
}

//post question
export function postApiQuestion(question) {
  return axios.post("/api/question/", {
    question_head: question.question_head,
    question_text: question.question_text,
    tags: question.tags ? question.tags : []
  });
}

//post answer
export function postApiAnswer(answer, q_id) {
  return axios.post("/api/answer/", { answer: answer, q_id: q_id });
}

//vote on answer, return updated value of points
export function voteAnswer(vote_type, a_id) {
  return axios.post("/api/answer/vote/", {
    vote_type: vote_type,
    a_id: a_id
  });
}

//login the user
export function postApiUserLogin(username, password) {
  return axios.post("/api/user/login/", {
    username: username,
    password: password
  });
}

//logout the user
export function postApiUserLogout() {
  return axios.post("/api/user/logout/");
}

//register user
export function postApiUserRegister(username, password, email) {
  return axios.post("/api/user/register/", {
    username: username,
    password: password,
    email: email
  });
}

//Accept answer
export function postApiAnswerIdAccept(id) {
  return axios.post("/api/answer/" + id + "/accept/");
}

//Reject answer
export function postApiAnswerIdReject(id) {
  return axios.post("/api/answer/" + id + "/reject/");
}

//Undo accept answer
export function postApiAnswerIdAcceptUndo(id) {
  return axios.post("/api/answer/" + id + "/accept/undo/");
}

//Undo reject answer
export function postApiAnswerIdRejectUndo(id) {
  return axios.post("/api/answer/" + id + "/reject/undo/");
}

//get the list of questions matching the query ('q')
//returns a question_list in response.data
export function getApiSearch(
  q = null,
  order = "desc",
  limit = 10,
  sort = "date_created"
) {
  return axios.get("/api/search/", {
    params: {
      q: q, // the query string
      order: order,
      limit: limit,
      sort: sort
    }
  });
}
