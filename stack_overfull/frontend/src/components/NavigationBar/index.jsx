import React from 'react';
import {SearchBar} from '../SearchBar';
import { QuestionsPage } from '/src/pages/QuestionsPage';
import './index.css';

export class NavigationBar extends React.Component {

    render() {

        var handle_questions_button = this.props.handle_questions_button
        var handle_signup_button = this.props.handle_signup_button
        var handle_signin_button = this.props.handle_signin_button

        return (
            <div className="navbar-wrapper">
                <div className="navbar">
                    <div className="navbar__title">Stack Overfull</div>
                    <div className="navbar__search">
                        <SearchBar/>
                    </div>
                    <button className="navbar__button" onClick={() => handle_questions_button()}>
                        <li><a href="/pages/QuestionsPage/QuestionsPage">Questions</a></li>
                    </button>
                    <button className="navbar__button" onClick={() => handle_signin_button()}>Sign In</button>
                    <button className="navbar__button" onClick={() => handle_signup_button()}>Sign Up</button>
                </div>
            </div>
        );
    }
}