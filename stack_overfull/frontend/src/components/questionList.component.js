import React, {Component} from 'react';
import {Question} from '../components/question.component'
import {QuestionEdit} from '../components/questionEdit.component'

var questionListSample = [
    {
        question_title:"Add button to perform an action prior to sending to view page",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"How to reference active document in Solidworks when there are multiple instances",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"Should I use Bonjour or Salut to a clerk in France?",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"Why isn't stealing cookies enough to authenticate?",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"A visa to visit the island that switches countries every six months?",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"How to balance the Zealot in a setting without resurrection?",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"Upset by male classmates openly comparing female students according to physical appearance",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"I want to do -Back to the future- like flame stripes",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"How to balance the Zealot in a setting without resurrection?",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"Upset by male classmates openly comparing female students according to physical appearance",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"I want to do -Back to the future- like flame stripes",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"How to balance the Zealot in a setting without resurrection?",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"Upset by male classmates openly comparing female students according to physical appearance",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    },
    {
        question_title:"I want to do -Back to the future- like flame stripes",
        num_votes:20,
        num_answers:3,
        user:' Ivan Sanz'
    }
]

export class QuestionList extends Component {

    constructor(props) {
        super(props);
        
        this.handleAskQuestionButton = this.handleAskQuestionButton.bind(this)
    }

    state = {
        title: "TOP QUESTIONS",
        showTopQuestions: true
    }

    handleAskQuestionButton() {
        this.setState({ 
            title: "Ask a question to the community",
            showTopQuestions: false
        });
    }

    render() {

        var page
        if(this.state.showTopQuestions === true) {
            page = 
            <div className="question-list">
                {
                    questionListSample.map( (x) => 
                    <Question 
                        questionTitle = {x.question_title}
                        numVotes = {x.num_votes}
                        numAnswers = {x.num_answers}
                        user = {x.user} />)
                }
            </div>
        } else if(this.state.showTopQuestions === false) {
            page = 
            <div className="question-list">
                {
                    <QuestionEdit 
                        user = "USER" />
                }
            </div>
        }

        var pageTitle
        if(this.state.showTopQuestions === true) {
            pageTitle = 
            <div className="question-list-title"> {this.state.title}
                <button onClick={this.handleAskQuestionButton} style={{color: '#ffffff'}}>Ask a question</button>
            </div>
        } else if(this.state.showTopQuestions === false) {
            pageTitle = 
            <div className="questionEdit-list-title"> {this.state.title} </div>
        }

        return (
            <div className="question-list-wrapper">
                {pageTitle}
                {page}
            </div> 
        );
    }
}