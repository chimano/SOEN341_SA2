// @flow
import React from 'react';
import { JobBox } from '../../components';
import './index.css';

type Props = {
  jobList: Array<Object>,
  hasJobApplication: boolean,
  hideApplyButton: boolean,
};

const JobList = (props: Props) => {
  const { jobList, hasJobApplication, hideApplyButton } = props;

  const jobListBox = jobList.map((job, key) => (
    <JobBox
      key={key}
      job_id={job.job_id}
      job_company={job.company}
      job_position={job.position}
      job_location={job.location}
      job_type={job.job_type}
      job_category={job.category}
      job_description={job.description}
      date_created={job.date_posted.replace('T', ' at ').substring(0, 19)}
      hasJobApplication={hasJobApplication}
      hideApplyButton={hideApplyButton}
    />
  ));

  return (
    <div className="job-list-wrapper">
      <div className="job-list">{jobListBox}</div>
    </div>
  );
};
export default JobList;
