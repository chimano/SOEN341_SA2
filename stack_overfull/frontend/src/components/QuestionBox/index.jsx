import React from 'react';
import './index.css';

export class QuestionBox extends React.Component {

    render() {

        var questionTitle = this.props.questionTitle;
        var numVotes = this.props.numVotes;
        var numAnswers = this.props.numAnswers;
        var user = this.props.user;

        return (
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
                </div>
            </div>
        );
    }
}