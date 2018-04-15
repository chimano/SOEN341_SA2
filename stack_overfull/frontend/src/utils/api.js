import axios from 'axios';

// get single question by id
export function getApiQuestionById(id) {
  return axios.get('/api/question/', {
    params: {
      id,
    },
  });
}

// get the list of questions
export function getApiQuestion(order, limit, sort, tags = []) {
  return axios.get('/api/question/', {
    params: {
      order,
      limit,
      sort,
      tags,
    },
  });
}

// get the list of asked/answered questions
export function getApiUserQuestionsAndAnsweredQuestions(username) {
  return axios.get(`/api/user/name/${username}/questions`);
}

// get the list of jobs given the category and subcategory
export function getApiJob(category) {
  return axios.get('/api/job/', {
    params: {
      category,
    },
  });
}

// apply to job
export function postApiJobApplication(job_id) {
  return axios.post('/api/job/application/', {
    job_id,
  });
}

// get list of applicants based on job_id
export function getApiJobApplication(job_id) {
  return axios.get('/api/job/application/', {
    params: {
      job_id,
    },
  });
}

// get a list of jobs posted by a certain employer
export function getApiUserNameJobs(username) {
  return axios.get(`/api/user/name/${username}/jobs`);
}

// post a job
export function postApiJob(position, job_type, category, company, location, description) {
  return axios.post('/api/job/', {
    position,
    job_type,
    category,
    company,
    location,
    description,
  });
}

export function monthToText(monthRaw) {
  switch (monthRaw) {
    case '01':
      return 'January';
    case '02':
      return 'February';
    case '03':
      return 'March';
    case '04':
      return 'April';
    case '05':
      return 'May';
    case '06':
      return 'June';
    case '07':
      return 'July';
    case '08':
      return 'August';
    case '09':
      return 'September';
    case '10':
      return 'October';
    case '11':
      return 'November';
    case '12':
      return 'December';
    default:
      return 'error';
  }
}

export function dayFormat(dayRaw) {
  switch (dayRaw) {
    case '01':
      return 'st';
    case '02':
      return 'nd';
    case '03':
      return 'rd';
    default:
      return 'th';
  }
}

export function formatDate(dateRaw) {
  /** Extracts year, month, day and time from the dateRaw */
  const year = dateRaw.substring(0, 4);
  const monthRaw = dateRaw.substring(5, 7);
  const dayRaw = dateRaw.substring(8, 10);
  const time = dateRaw.substring(11, 19);

  /** The following variables will call their respective method
   *  For month, it will convert the month number to a text
   *  For day, it will get the appropriate suffix
   */
  const month = monthToText(monthRaw);
  const daySuffix = dayFormat(dayRaw);

  /** If month does not return "error", then date will have the
   *  date format in a specific order with suffix and converted month.
   *
   *  If month returns "error", then show the raw date
   */
  if (month !== 'error') {
    return `${month} ${dayRaw}${daySuffix} ${year} ${time}`;
  }
  return dateRaw;
}

// get answer by id of the question
export function getApiAnswerById(id, order, limit) {
  return axios.get('/api/answer/', {
    params: {
      q_id: id,
      order,
      limit,
    },
  });
}

// get user info and check whether user is logged in or not
export function getApiUserMe() {
  return axios.get('/api/user/me');
}

// get user information
export function getApiUserNameInfo(username) {
  return axios.get(`/api/user/name/${username}`);
}

// edit info of the currently logged in user
// sending null doesn't modify the field
export function postApiUserMe(
  email = null,
  first_name = null,
  last_name = null,
  about_me = null,
  github = null,
  linkedin = null,
) {
  return axios.post('/api/user/me/', {
    email,
    first_name,
    last_name,
    about_me,
    github,
    linkedin,
  });
}

// post question
export function postApiQuestion(question) {
  return axios.post('/api/question/', {
    question_head: question.question_head,
    question_text: question.question_text,
    tags: question.tags ? question.tags : [],
  });
}

// post answer
export function postApiAnswer(answer, q_id) {
  return axios.post('/api/answer/', { answer, q_id });
}

// vote on answer, return updated value of points
// vote_type either "UP" or "DOWN"
export function voteAnswer(vote_type, a_id) {
  return axios.post('/api/answer/vote/', {
    vote_type,
    a_id,
  });
}

// vote on question, return updated value of points
// vote_type either "UP" or "DOWN"
export function voteQuestion(vote_type, q_id) {
  return axios.post('/api/question/vote/', {
    vote_type,
    q_id,
  });
}

// login the user
export function postApiUserLogin(username, password) {
  return axios.post('/api/user/login/', {
    username,
    password,
  });
}

// logout the user
export function postApiUserLogout() {
  return axios.post('/api/user/logout/');
}

// register user
export function postApiUserRegister(username, password, email, is_employer) {
  return axios.post('/api/user/register/', {
    username,
    password,
    email,
    is_employer,
  });
}

// edit an answer in the database
export function putAnswer(answer_text, q_id) {
  return axios.put('/api/answer/', {
    answer_text,
    q_id,
  });
}

// edit a question in the database
export function putQuestion(q_id, question_head, question_text) {
  return axios.put('/api/question/', {
    q_id,
    question_head,
    question_text,
  });
}

// delete a question from the database
export function deleteQuestion(q_id) {
  return axios.delete('/api/question/', {
    data: {
      q_id,
    },
  });
}

// delete an answer in the database
export function deleteAnswer(a_id) {
  return axios.delete('/api/answer/', {
    data: {
      a_id,
    },
  });
}

// Accept answer
export function postApiAnswerIdAccept(id) {
  return axios.post(`/api/answer/${id}/accept/`);
}

// Reject answer
export function postApiAnswerIdReject(id) {
  return axios.post(`/api/answer/${id}/reject/`);
}

// Undo accept answer
export function postApiAnswerIdAcceptUndo(id) {
  return axios.post(`/api/answer/${id}/accept/undo/`);
}

// Undo reject answer
export function postApiAnswerIdRejectUndo(id) {
  return axios.post(`/api/answer/${id}/reject/undo/`);
}

// get the list of questions matching the query ('q')
// returns a question_list in response.data
export function getApiSearch(
  q = null,
  order = 'desc',
  limit = 10,
  sort = 'date_created',
  filters = [],
  page = 1,
) {
  return axios.get('/api/search/', {
    params: {
      q, // the query string
      order,
      limit,
      sort,
      filters,
      page,
    },
  });
}

// get the list of tags
export function getApiTags(order = 'desc', limit = '10', sort = 'question_count') {
  return axios.get('/api/tag/', {
    params: {
      order,
      limit,
      sort,
    },
  });
}

// get the tags information by tagname
export function getApiTagInfo(tagname) {
  return axios.get(`/api/tag/name/${tagname}/`);
}
