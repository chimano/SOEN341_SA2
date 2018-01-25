import React, {Component} from 'react';

export class NavigationBar extends Component {
    render() {
        return (
            <div className="navbar">
                <div className="navbar__title">Stack Overfull</div>
                <div className="navbar__search">
                    <input
                        className="navbar__search"
                        type="text"
                        placeholder="Search..."
                        ref="filterTextInput"/>
                </div>
                <button className = "navbar__button">Log In</button>
                <button className = "navbar__button">Sign Up</button>
            </div>
        );
    }
}