import React from "react";
import { Modal, Button, Divider } from "antd";
import { Link } from "react-router-dom";

export class ApplicantsPopupButton extends React.Component {
  state = { visible: false };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };
  render() {
    const { applicantList } = this.props;

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          View Applicants
        </Button>
        <Modal
          title="Job Applicants"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {applicantList.map((applicant, key) => (
            <div key={key}>
              <Link to={`/user/${applicant.user_id.username}`}>
                {applicant.user_id.username}
              </Link>
              <div>Reputation: {applicant.user_id.profile.reputation}</div>
              <div>LinkedIn: {applicant.user_id.profile.linkedin}</div>
              <div>Github: {applicant.user_id.profile.github}</div>
              <Divider />
            </div>
          ))}
        </Modal>
      </div>
    );
  }
}
