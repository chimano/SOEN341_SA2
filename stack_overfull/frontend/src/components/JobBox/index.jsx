// @flow
import React from 'react';
import { Divider, Button } from 'antd';
import './index.css';
import { formatDate, postApiJobApplication, getApiJobApplication } from '../../utils/api';
import { ApplicantsPopupButton } from '../../components';

function humanize(str) {
  const frags = str.split('_');
  for (let i = 0; i < frags.length; i += 1) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

export default class JobBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicantList: [],
    };
  }

  componentDidMount() {
    const { job_id } = this.props;
    this.getListOfApplicantsForJob(job_id);
  }

  getListOfApplicantsForJob = (job_id) => {
    getApiJobApplication(job_id)
      .then((response) => {
        this.setState({
          applicantList: response.data.application_list,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleApplyButton = (job_id) => {
    postApiJobApplication(job_id)
      .then((response) => {
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
      hideApplyButton,
    } = this.props;

    const date = formatDate(date_created);

    return (
      <div>
        <div className="JobBox grey-border">
          <div className="JobBox__position">{job_position}</div>
          <div className="JobBox__company">Position posted by {job_company}</div>
          <Divider />
          <div className="JobBox__description">
            <p>{job_description}</p>
          </div>
          <div className="JobBox__generalinfo">
            {humanize(job_category)} <br />
            {job_type} <br />
            {job_location} <br />
            Position posted on {date}{' '}
          </div>

          {hasJobApplication ? (
            <ApplicantsPopupButton applicantList={this.state.applicantList} />
          ) : (
            ''
          )}

          {hideApplyButton ? (
            ''
          ) : (
            <Button type="primary" onClick={() => this.handleApplyButton(job_id)}>
              Apply
            </Button>
          )}
        </div>
      </div>
    );
  }
}
