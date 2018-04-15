// @flow
import React from 'react';
import { Input, Button, Icon } from 'antd';
import './index.css';

type Props = {
  onInputChange: (string, Object) => {},
  onEditButtonClick: () => {},
  isEditing: boolean,
  isSavingMyInfo: boolean,
  email: string,
  firstName: string,
  lastName: string,
  aboutMe: string,
  reputation: string,
  username: string,
  github: string,
  linkedin: string,
  lastLogin: string,
  isEditable: boolean,
  currentUsername: string,
};

const UserInfo = (props: Props) => {
  const {
    onInputChange,
    onEditButtonClick,
    isEditing,
    isSavingMyInfo,
    email,
    firstName,
    lastName,
    aboutMe,
    reputation,
    username,
    github,
    linkedin,
    lastLogin,
    isEditable,
    currentUsername,
  } = props;

  let divContent;

  if (username !== '') {
    let editButtonElement;
    if (isEditable) {
      editButtonElement = (
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" size="small" onClick={onEditButtonClick} loading={isSavingMyInfo}>
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      );
    } else {
      editButtonElement = '';
    }

    const emailElement = isEditing ? (
      <div>
        <h3>Email</h3>
        <Input value={email} onChange={e => onInputChange('email', e)} />
      </div>
    ) : (
      <div>
        <h3>Email</h3>
        <div>{email}</div>
      </div>
    );

    const firstNameElement = isEditing ? (
      <div>
        <h3>First Name</h3>
        <Input value={firstName} onChange={e => onInputChange('firstName', e)} />
      </div>
    ) : (
      <div>
        <h3>First Name</h3>
        <div>{firstName}</div>
      </div>
    );

    const lastNameElement = isEditing ? (
      <div>
        <h3>Last Name</h3>
        <Input value={lastName} onChange={e => onInputChange('lastName', e)} />
      </div>
    ) : (
      <div>
        <h3>Last Name</h3>
        <div>{lastName}</div>
      </div>
    );

    const aboutMeElement = isEditing ? (
      <Input.TextArea value={aboutMe} onChange={e => onInputChange('aboutMe', e)} />
    ) : (
      <div>{aboutMe}</div>
    );

    const githubElement = isEditing ? (
      <div>
        <h3>Github</h3>
        <Input
          value={github}
          placeholder="github.com/username"
          onChange={e => onInputChange('github', e)}
        />
      </div>
    ) : (
      <div>
        <h3>Github</h3>
        <a href={`https://github.com/${github}`}>
          <Icon type="github" style={{ fontSize: 14 }} />
          {` ${github}`}
        </a>
      </div>
    );

    const linkedinElement = isEditing ? (
      <div>
        <h3>Linkedin</h3>
        <Input
          value={linkedin}
          placeholder="linkedin.com/in/username"
          onChange={e => onInputChange('linkedin', e)}
        />
      </div>
    ) : (
      <div>
        <h3>Linkedin</h3>
        <a href={`https://www.linkedin.com/in/${linkedin}`}>
          <Icon type="linkedin" style={{ fontSize: 14 }} />
          {` ${linkedin}`}
        </a>
      </div>
    );
    const hoursSinceLastLogin = (Date.now() - Date.parse(lastLogin)) / 3600000;
    divContent = (
      <div>
        <h2>{`${username}'s profile `}</h2>
        <div className="UserInfo" style={{ display: 'flex' }}>
          <div className="LeftDiv" style={{ width: '50%', marginRight: '10px' }}>
            <h3>Username</h3>
            <div>
              {hoursSinceLastLogin < 1 ? (
                <Icon type="user" style={{ fontSize: 14, color: 'lime' }} />
              ) : (
                <Icon type="user" style={{ fontSize: 14, color: 'red' }} />
              )}
              {` ${username}`}
            </div>

            {email || isEditing ? emailElement : ''}
            {firstName || isEditing ? firstNameElement : ''}
            {lastName || isEditing ? lastNameElement : ''}
          </div>
          <div className="RightDiv" style={{ width: '50%', marginLeft: '10px' }}>
            <h3>About Me</h3>
            {aboutMeElement}
            {github || isEditing ? githubElement : ''}
            {linkedin || isEditing ? linkedinElement : ''}
            <h3>Reputation</h3>
            <div>{reputation} points</div>
          </div>
        </div>
        {currentUsername === username && editButtonElement}
      </div>
    );
  } else {
    divContent = <h2> Please login to view your profile details </h2>;
  }

  return <div className="UserInfo_div">{divContent}</div>;
};
export default UserInfo;
