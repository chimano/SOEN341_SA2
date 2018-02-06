import React, {Component} from 'react';

export class QuestionEdit extends Component {

    constructor(props) {
        super(props);
        
        this.handleSubmitQuestionButton = this.handleSubmitQuestionButton.bind(this)
    }

    handleSubmitQuestionButton() {
        window.location.reload();
    }

    render() {

        var user = this.props.user;

        return(
            <div className="questionEdit-wrapper">
                <div className="questionEdit">
                    <div className="question-extra-info">
                        <a className="question-user">{user}</a>
                    </div>
                    <div className="line"></div>
                    <div className="questionEdit-title">Question : <textarea className="questionTitle"/></div>
                </div>
                <button className="questionEdit-button" onClick={this.handleSubmitQuestionButton} style={{color: '#ffffff'}}>Submit question</button>
            </div>
        );
    }
}