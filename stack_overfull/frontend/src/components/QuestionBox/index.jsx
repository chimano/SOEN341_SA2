import React from 'react';
import './index.css';
import axios from "axios";

export class QuestionBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            answer: '',
            answerList: []

        };
      }

    handleReplyButton = (q_id) => {
        console.log("ID IS : " + q_id);
        const {answerQuestion} = this.props;
        answerQuestion(this.state.answer, q_id);
    }

    handleChange = (event) => {
        this.setState({answer: event.target.value});
      }

    getAnswerList = (q_id) => {
        var parsedQ_id = parseInt(q_id)+1;
        var id = q_id + 1;
        axios
        .get("/api/answer/q_id="+id+"/order=asc/limit=10/")
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
        const {date_created,question_text,user,q_id} = this.props;
        
        this.getAnswerList(q_id);
        
        // var answers = []
        // for (var i = 0; i < this.state.answer_list.length; i++) {
        //     answer = this.state.answer_list[i].answer_text;
        // }
        // console.log("ANSWERS:" + this.state.answerList);

        return (
            <div className="question-wrapper">
                <div className="question">
                    <div className="question-extra-info">
                        <div className="question-title">{question_text}</div>
                        {/* <a className="question-user">{user}</a> */}
                        <div className="question-count">
                            {/* <div>{date_created}</div>
                            <div>Votes</div> */}
                        </div>
                    </div>
                    <div className="line"></div>
                    <div className="answer-list"> 
                    {/* {this.state.answerList} */}
                        {this.state.answerList.map((x) => (
                            <div
                            // date_created={x.date_created}
                            answer_text={x.answer_text}
                            />
                        ))}
                    </div>
                    <textarea className="answer" onChange={(e) => this.handleChange(e)}/>
                    {/* <div className="question-title">{question_text}</div> */}
                    {/* <button className="replyButton" onClick={() => this.handleReplyButton(boxId)} value={this.boxId}>Reply</button> */}
                    <button className="replyButton" onClick={() => this.handleReplyButton(q_id)}>Reply</button>
                </div>
            </div>
        );
    }
}