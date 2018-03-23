import React from "react";
import { Popover, Button } from "antd";
import { Link } from "react-router-dom";

export class ApplicantsPopoverButton extends React.Component {
  state = {
    visible: false
  };
  hide = () => {
    this.setState({
      visible: false
    });
  };
  handleVisibleChange = visible => {
    this.setState({ visible });
  };
  render() {
    const { applicantList } = this.props;

    const content = (
      <div>
        {applicantList.map((applicant, key) => (
          <div key={key}>
            <Link to={`/user/${applicant.user_id.username}`}>
              {applicant.user_id.username}
            </Link>
          </div>
        ))}
        <a onClick={this.hide}>Close</a>
      </div>
    );

    return (
      <Popover
        content={content}
        title="Applicants"
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button type="primary">View Applicants</Button>
      </Popover>
    );
  }
}
