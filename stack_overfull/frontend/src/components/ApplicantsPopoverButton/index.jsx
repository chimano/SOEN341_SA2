import React from "react";
import { Popover, Button } from "antd";

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
    const {applicantList} = this.props;

    const content = (
      <div>
        {applicantList.map((applicant, key)=>(
            <div>{applicant.user_id.username}</div>
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
