import React, {Component} from 'react';
import {Question} from '../components/question.component'

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

    render() {

        return (
            <div className="question-list-wrapper">
                <div className="question-list-title">TOP QUESTIONS</div>
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
            </div> 
        );
    }
}