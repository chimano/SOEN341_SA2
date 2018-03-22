import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import {
  formatDate,
  postApiJobApplication,
  getApiJobApplication
} from "../../utils/api";
import { Divider, Button } from "antd";

export class JobBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicantList: []
    };
  }

  componentDidMount() {
    const { job_id } = this.props;
    this.getListOfApplicantsForJob(job_id);
  }

  getListOfApplicantsForJob = job_id => {
    getApiJobApplication(job_id)
      .then(response => {
        console.log(response);
        this.setState({
          applicantList: response.data.application_list
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleApplyButton = job_id => {
    postApiJobApplication(job_id)
      .then(response => {
        console.log(response);
        alert(response.data.success);
      })
      .catch(error => console.log(error));
  };

  render() {
    const {
      job_id,
      job_company,
      job_position,
      job_location,
      job_type,
      job_category,
      job_description,
      date_created,
      hasJobApplication,
      hideApplyButton
    } = this.props;

    let date = formatDate(date_created);

    let applicants = "";
    if (hasJobApplication) {
      applicants = this.state.applicantList.map((value, key) => (
        <div key={key}>{value.user_id.username}</div>
      ));
    }

    return (
      <div>
        <div className="JobBox grey-border">
          <div className="JobBox__position">{job_position}</div>
          <div className="JobBox__company">
            Position posted by {job_company}
          </div>
          <Divider />
          <div className="JobBox__description">
            <p>{job_description}</p>
          </div>
          <div className="JobBox__generalinfo">
            {job_category} <br />
            {job_type} <br />
            {job_location} <br />
            Position posted on {date}{" "}
          </div>
          {hideApplyButton ? (
            ""
          ) : (
            <Button
              type="primary"
              onClick={() => this.handleApplyButton(job_id)}
            >
              Apply
            </Button>
          )}
        </div>
        {applicants}
      </div>
    );
  }
}
