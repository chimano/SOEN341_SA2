import React from "react";
import { Input, Button } from "antd";
import "./index.css";

export class UserInfo extends React.Component {
  render() {
    const {
      onInputChange,
      onEditButtonClick,
      is_editing,
      is_saving_myinfo,
      email,
      first_name,
      last_name,
      aboutMe,
      reputation,
      username,
      no_edit
    } = this.props;

    let editButtonElement;
    if (no_edit) {
      editButtonElement = "";
    } else {
      editButtonElement = (
        <Button
          type="primary"
          size="small"
          onClick={onEditButtonClick}
          loading={is_saving_myinfo}
        >
          {is_editing ? "Save" : "Edit"}
        </Button>
      );
    }

    let emailElement = (is_editing) ? (
      <Input value={email} onChange={e => onInputChange("email", e)} />
    ) : (
      <div>{email}</div>
    );

    let firstNameElement = is_editing ? (
      <Input
        value={first_name}
        onChange={e => onInputChange("first_name", e)}
      />
    ) : (
      <div>{first_name}</div>
    );

    let lastNameElement = is_editing ? (
      <Input value={last_name} onChange={e => onInputChange("last_name", e)} />
    ) : (
      <div>{last_name}</div>
    );

    let aboutMeElement = is_editing ? (
      <Input.TextArea
        value={aboutMe}
        onChange={e => onInputChange("aboutMe", e)}
      />
    ) : (
      <div>{aboutMe}</div>
    );
    return (
      <div className="UserInfo">
        <h3>Username</h3>
        <div>{username}</div>
        <h3>Email</h3>
        {emailElement}
        <h3>First Name</h3>
        {firstNameElement}
        <h3>Last Name</h3>
        {lastNameElement}
        <h3>About Me</h3>
        {aboutMeElement}
        <h3>Reputation</h3>
        <div>{reputation} points</div>
        {editButtonElement}
      </div>
    );
  }
}
