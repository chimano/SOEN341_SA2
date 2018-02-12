import React from "react";
import "./index.css";
import {Link} from "react-router-dom";

export class QuestionBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: "",
      answerList: []
    };
    this.getAnswerList(this.props.q_id);
  }
  handleReplyButton = q_id => {
    console.log("ID IS : " + q_id);
    const { answerQuestion } = this.props;
    answerQuestion(this.state.answer, q_id);
    setTimeout(() => this.getAnswerList(q_id), 100);
    this.refs.answer_text.value='';
  };

  handleChange = event => {
    this.setState({ answer: event.target.value });
  };

  getAnswerList = q_id => {
    var id = q_id;
    axios
      .get("/api/answer/",{
        params: {
            q_id: id,
            order: 'asc',
            limit: 100
            }
        })
      .then(response => {
        console.log(response);
        this.setState({
          answerList: response.data.answer_list
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    const { date_created, question_text, user, q_id } = this.props;

    return (
      <div className="question-wrapper">
        <div className="question">
          <div className="question-extra-info">
            <Link to={"/question/"+q_id}>
              <div className="question-text">{question_text}</div>
              {/* <a className="question-user">{user}</a> */}
              <div className="question-count">
                {/* <div>{date_created}</div>
                              <div>Votes</div> */}
              </div>
        </Link>
          </div>
          <div className="question-date">{date_created}</div>
          <div className="line" />
        </div>
      </div>
    );
  }
}
