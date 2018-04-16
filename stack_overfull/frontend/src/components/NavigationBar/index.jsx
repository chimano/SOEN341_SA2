// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { SearchBar, SignInFormWindow, SignUpFormWindow } from '../../components';
import './index.css';

type Props = {
  handleLogout: () => {},
  loggedIn: boolean,
  handleLogin: () => {},
};

type State = {
  openSignin: boolean,
  openSignup: boolean,
};

export default class NavigationBar extends React.Component<Props, State> {
  state = {
    openSignin: false,
    openSignup: false,
  };

  handleSignupButton = () => {
    this.setState({ openSignup: true, openSignin: false });
  };

  handleSigninButton = () => {
    this.setState({ openSignin: true, openSignup: false });
  };

  handleCloseButton = () => {
    this.setState({ openSignin: false, openSignup: false });
  };

  render() {
    const { handleLogout, loggedIn, handleLogin } = this.props;
    const { openSignin, openSignup } = this.state;

    let loginBox;
    if (openSignin === true) {
      loginBox = (
        <div className="login-wrap">
          <SignInFormWindow handleCloseButton={this.handleCloseButton} handleLogin={handleLogin} />
        </div>
      );
    } else if (openSignup === true) {
      loginBox = (
        <div className="login-wrap">
          <SignUpFormWindow handleCloseButton={this.handleCloseButton} handleLogin={handleLogin} />
        </div>
      );
    } else {
      loginBox = '';
    }

    return (
      <div className="navbar-wrapper shadow">
        <div className="navbar page-width">
          <div className="navbar__title">
            <Link to="/" style={{ color: 'white' }}>
              Stack Overfull
            </Link>
          </div>
          <div className="navbar__search">
            <SearchBar />
          </div>
          {loggedIn ? (
            <div className="navbar__logged-in">
              <Link
                to="/profile"
                style={{ width: '50px', padding: '12px' }}
                className="navbar__profile-button"
              >
                <Icon type="user" style={{ fontSize: 20, color: 'white', paddingBottom: '2px' }} />
              </Link>
              <button className="navbar__button" onClick={() => handleLogout()}>
                Log out
              </button>
            </div>
          ) : (
            <div className="navbar__auth">
              <button className="navbar__button" onClick={() => this.handleSigninButton()}>
                Sign In
              </button>
              <button className="navbar__button" onClick={() => this.handleSignupButton()}>
                Sign Up
              </button>
            </div>
          )}
        </div>
        <div className="navbar page-width navbar__secondrow">
          <div className="navbar__buttons">
            <Link
              to="/careers"
              style={{ marginLeft: '-10%' }}
              className="navbar__button navbar__button--link"
            >
              Careers
            </Link>
            <Link to="/categories" className="navbar__button navbar__button--link">
              Questions
            </Link>
          </div>
        </div>
        {loginBox}
      </div>
    );
  }
}
