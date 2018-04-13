// @flow
import React from "react";
import { JobBox } from "../../components";
import "./index.css";

type Props = {
  jobList: Array<Object>,
  hasJobApplication: boolean,
  hideApplyButton: boolean
};

const JobList = (props: Props) => {
  const { jobList, hasJobApplication, hideApplyButton } = props;

  const jobListBox = jobList.map((job, key) => (
    <JobBox
      key={key}
      jobId={job.job_id}
      jobCompany={job.company}
      jobPosition={job.position}
      jobLocation={job.location}
      jobType={job.job_type}
      jobCategory={job.category}
      jobDescription={job.description}
      dateCreated={job.date_posted.replace("T", " at ").substring(0, 19)}
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
