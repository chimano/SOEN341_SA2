import React from "react";
import { JobBox } from "../JobBox";
import "./index.css";

export class JobList extends React.Component {
  render() {
    const { jobList, hasJobApplication, hideApplyButton } = this.props;

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
        date_created={job.date_posted.replace("T", " at ").substring(0, 19)}
        hasJobApplication={hasJobApplication}
        hideApplyButton={hideApplyButton}
      />
    ));

    return (
      <div className="job-list-wrapper">
        <div className="job-list">{jobListBox}</div>
      </div>
    );
  }
}
