import React from "react";
import {
  SearchBar,
  SignInFormWindow,
  SignUpFormWindow
} from "../../components";
import "./index.css";
import { Link } from "react-router-dom";
import { Icon } from "antd";

export class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open_signin: false,
      open_signup: false
    };
  }

  handle_signup_button = () => {
    this.setState({ open_signup: true, open_signin: false });
  };

  handle_signin_button = () => {
    this.setState({ open_signin: true, open_signup: false });
  };

  handle_close_button = () => {
    this.setState({ open_signin: false, open_signup: false });
  };

  render() {
    const {
      handle_logout,
      logged_in,
      handle_login
    } = this.props;

    const { open_signin, open_signup } = this.state;

    let login_box;
    if (open_signin === true) {
      login_box = (
        <div className="login-wrap">
          <SignInFormWindow
            handle_close_button={this.handle_close_button}
            handle_login={handle_login}
          />
        </div>
      );
    } else if (open_signup === true) {
      login_box = (
        <div className="login-wrap">
          <SignUpFormWindow
            handle_close_button={this.handle_close_button}
            handle_login={handle_login}
          />
        </div>
      );
    } else {
      login_box = "";
    }

    return (
      <div className="navbar-wrapper">
        <div className="navbar page-width">
          <div className="navbar__title">
            <Link to="/" style={{ color: "black" }}>
              Stack Overfull
            </Link>
          </div>
          <div className="navbar__search">
            <SearchBar />
          </div>
          {logged_in ? (
            <div className="navbar__logged-in">
              <Link
                to="/profile"
                style={{ width: "50px", padding: "12px" }}
                className="navbar__profile-button"
              >
                <Icon
                  type="user"
                  style={{ fontSize: 20, color: "white", paddingBottom: "2px" }}
                />
              </Link>
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
                onClick={() => this.handle_signin_button()}
              >
                Sign In
              </button>
              <button
                className="navbar__button"
                onClick={() => this.handle_signup_button()}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
        <div className="navbar page-width navbar__secondrow">
          <div className="navbar__buttons">
            <Link
              to="/careers"
              style={{ marginLeft: "-10%" }}
              className="navbar__button navbar__button--link"
            >
              Careers
            </Link>
            <Link
              to="/categories"
              className="navbar__button navbar__button--link"
            >
              Questions
            </Link>
          </div>
        </div>
        {login_box}
      </div>
    );
  }
}
