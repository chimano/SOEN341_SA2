import React, {Component} from 'react';
import { QuestionList, handleAskQuestionButton } from '../components/questionList.component'

export class Question extends Component {

    constructor(props) {
        super(props);

        this.handleReplyButton = this.handleReplyButton.bind(this);
    }

    state = {
        title: "TOP QUESTIONS",
        showTopQuestions: true
    }

    handleReplyButton(boxId) {
        console.log("ID IS : " + boxId);
    }

    render() {

        var questionTitle = this.props.questionTitle;
        var numVotes = this.props.numVotes;
        var numAnswers = this.props.numAnswers;
        var user = this.props.user;
        var boxId = this.props.boxId;

        return(
            <div className="question-wrapper">
                <div className="question">
                    <div className="question-extra-info">
                        <a className="question-user">{user}</a>
                        <div className="question-count">
                            <div>{numVotes}</div>
                            <div>Votes</div>
                        </div>
                        <div className="question-count">
                            <div>{numAnswers}</div>
                            <div>Answers</div>
                        </div>
                        <div></div>
                    </div>
                    <div className="line"></div>
                    <div className="question-title">{questionTitle}</div>
                    {/* <button className="replyButton" onClick={() => this.handleReplyButton(boxId)} value={this.boxId}>Reply</button> */}
                    <button className="replyButton" onClick={this.props.onClick}>Reply</button>
                </div>
            </div>
        );
    }
}