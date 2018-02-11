import React from "react";
import { SearchBar } from "../SearchBar";
import "./index.css";
import { Link } from "react-router-dom";

export class NavigationBar extends React.Component {
  render() {
    const {
      handle_signup_button,
      handle_signin_button,
      handle_career_button,
      handle_questions_button,
      handle_logout,
      logged_in,
      username
    } = this.props;

    return (
      <div className="navbar-wrapper">
        <div className="navbar">
          <div className="navbar__title">
            <Link to="/" style={{ color: "white" }}>
              Stack Overfull
            </Link>
          </div>
          <div className="navbar__search">
            <SearchBar />
          </div>
          {logged_in ? (
            <div className="navbar__logged-in">
              <div className="navbar__welcome">Welcome {username} !</div>
              <button
                className="navbar__button"
                onClick={() => handle_logout()}
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="navbar__auth">
              <button
                className="navbar__button"
                onClick={() => handle_signin_button()}
              >
                Sign In
              </button>
              <button
                className="navbar__button"
                onClick={() => handle_signup_button()}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
        <div className="navbar">
          <div className="navbar__auth">
            <button
              className="navbar__button"
              // onClick={() => handle_career_button()}
            >
              Careers
            </button>
            <button
              className="navbar__button"
              // onClick={() => handle_questions_button()}
            >
              Questions
            </button>
          </div>
        </div>
      </div>
    );
  }
}
