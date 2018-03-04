import React from "react";
import { getApiUserMe } from "../../utils/api";
import "./index.css";

export class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      aboutMe: "",
      reputation: ""
    };
  }

  componentWillMount() {
    this.getMyInfo();
  }

  getMyInfo() {
    getApiUserMe().then(response => {
      console.log("response of getApiUserMe(): ", response);
      this.setState({
        username: response.data.username,
        email: response.data.email,
        aboutMe: response.data.profile.about_me,
        reputation: response.data.profile.reputation
      });
    });
  }

  render() {
    console.log("The state of ProfilPage: ", this.state);
    const { username, email, aboutMe, reputation } = this.state;
    return (
      <div className="body-wrapper">
        <div className="page-width">
          <div className="ProfilePage">
              <h3>Username</h3>
              <div>{username}</div>
              <h3>Email</h3>
              <div>{email}</div>
              <h3>About Me</h3>
              <div>{aboutMe}</div>
              <h3>Reputation</h3>
              <div>{reputation} points</div>
          </div>
        </div>
      </div>
    );
  }
}
