import React, {Component} from 'react';
import {SearchBar} from '../components/searchBar.component';

export class NavigationBar extends Component {

    render() {

        var handle_signup_button = this.props.handle_signup_button
        var handle_signin_button = this.props.handle_signin_button

        return (
            <div className="navbar-wrapper">
                <div className="navbar">
                    <div className="navbar__title">Stack Overfull</div>
                    <div className="navbar__search">
                        <SearchBar/>
                    </div>
                    <button className="navbar__button" onClick={() => handle_signin_button()}>Sign In</button>
                    <button className="navbar__button" onClick={() => handle_signup_button()}>Sign Up</button>
                </div>
            </div>
        );
    }
}