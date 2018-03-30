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

type Props = {
  jobId: number,
  jobCompany: string,
  jobPosition: string,
  jobLocation: string,
  jobType: string,
  jobCategory: string,
  jobDescription: string,
  dateCreated: string,
  hasJobApplication: () => {},
  hideApplyButton: boolean,
};

type State = {
  applicantList: Array<Object>,
};

export default class JobBox extends React.Component<Props, State> {
  state = {
    applicantList: [],
  };

  componentDidMount() {
    const { jobId } = this.props;
    this.getListOfApplicantsForJob(jobId);
  }

  getListOfApplicantsForJob = (jobId: number) => {
    getApiJobApplication(jobId)
      .then((response) => {
        this.setState({
          applicantList: response.data.application_list,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleApplyButton = (jobId: number) => {
    postApiJobApplication(jobId)
      .then((response) => {
        alert(response.data.success);
      })
      .catch(error => console.log(error));
  };

  render() {
    const {
      jobId,
      jobCompany,
      jobPosition,
      jobLocation,
      jobType,
      jobCategory,
      jobDescription,
      dateCreated,
      hasJobApplication,
      hideApplyButton,
    } = this.props;

    const date = formatDate(dateCreated);

    return (
      <div>
        <div className="JobBox grey-border">
          <div className="JobBox__position">{jobPosition}</div>
          <div className="JobBox__company">Position posted by {jobCompany}</div>
          <Divider />
          <div className="JobBox__description">
            <p>{jobDescription}</p>
          </div>
          <div className="JobBox__generalinfo">
            {humanize(jobCategory)} <br />
            {jobType} <br />
            {jobLocation} <br />
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
            <Button type="primary" onClick={() => this.handleApplyButton(jobId)}>
              Apply
            </Button>
          )}
        </div>
      </div>
    );
  }
}
