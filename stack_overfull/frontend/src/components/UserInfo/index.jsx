import React from "react";
import { Input, Button, Icon } from "antd";
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
      github,
      linkedin,
      last_login,
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

    let emailElement = is_editing ? (
      <div>
        <h3>Email</h3>
        <Input value={email} onChange={e => onInputChange("email", e)} />
      </div>
      ) : (
        <div>
          <h3>Email</h3>
          <div>{email}</div>
        </div>
      )

    let firstNameElement = is_editing ? (
      <div>
        <h3>First Name</h3>
        <Input
          value={first_name}
          onChange={e => onInputChange("first_name", e)}
        />
      </div>
    ) : (
      <div>
        <h3>First Name</h3>
        <div>{first_name}</div>
      </div>
    );

    let lastNameElement = is_editing ? (
      <div>
        <h3>Last Name</h3>
        <Input value={last_name} onChange={e => onInputChange("last_name", e)} />
      </div>
    ) : (
      <div>
        <h3>Last Name</h3>
        <div>{last_name}</div>
      </div>
    );

    let aboutMeElement = is_editing ? (
      <Input.TextArea
        value={aboutMe}
        onChange={e => onInputChange("aboutMe", e)}
      />
    ) : (
      <div>{aboutMe}</div>
    );

    let githubElement = is_editing ? (
      <div>
        <h3>Github</h3>
        <Input
          value={github}
          placeholder={"github.com/username"}
          onChange={e => onInputChange("github", e)}
        />
      </div>
    ) : (
      <div>
        <h3>Github</h3>
        <a href={"https://github.com/"+github}>
          <Icon type="github" style={{ fontSize: 14 }} />
          {" " + github}
        </a>
      </div>
    );

    let linkedinElement = is_editing ? (
      <div>
        <h3>Linkedin</h3>
        <Input
          value={linkedin}
          placeholder={"linkedin.com/in/username"}
          onChange={e => onInputChange("linkedin", e)}
        />
      </div>
    ) : (
      <div>
        <h3>Linkedin</h3>
        <a href={"https://www.linkedin.com/in/"+linkedin}>
          <Icon type="linkedin" style={{ fontSize: 14 }} />
          {" " + linkedin}
        </a>
      </div>
    );

    let hoursSinceLastLogin = (Date.now() - Date.parse(last_login)) / 3600000;

    return (
      <div className="UserInfo">
        <h3>Username</h3>
        <div>
          {username}
          {( hoursSinceLastLogin < 1) ? (
            <Icon type="user" style={{ fontSize: 14, color: 'lime' }} />
          ) : (
            <Icon type="user" style={{ fontSize: 14, color: 'red' }} />
          )}
        </div>

        {(email || is_editing) ? (
          emailElement
        ) : (
          ""
        )}
        {(first_name || is_editing) ? (
          firstNameElement
        ) : (
          ""
        )}
        {(last_name || is_editing) ? (
          lastNameElement
        ) : (
          ""
        )}
        <h3>About Me</h3>
        {aboutMeElement}
        {(github || is_editing) ? (
          githubElement
        ) : (
          ""
        )}
        {(linkedin || is_editing) ? (
          linkedinElement
        ) : (
          ""
        )}
        <h3>Reputation</h3>
        <div>{reputation} points</div>
        {editButtonElement}
      </div>
    );
  }
}
