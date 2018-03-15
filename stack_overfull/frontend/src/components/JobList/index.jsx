import React from "react";
import { JobBox } from "../JobBox";
import "./index.css";

export class JobList extends React.Component {
    
    render() {
      const { jobList } = this.props;
  
      return (
        <div className="job-list-wrapper">
          <div className="job-list">
            {jobList.map((job, key) => (
              <JobBox
                key={key}
                job_id={job.id}
                job_company={job.company}
                job_position={job.position}
                job_location={job.location}
                job_type={job.type}
                job_category={job.category}
                job_description={job.job_description}
                date_created={job.date_created
                  .replace("T", " at ")
                  .substring(0, 19)}
              />
            ))}
          </div>
        </div>
      );
    }
  }
  