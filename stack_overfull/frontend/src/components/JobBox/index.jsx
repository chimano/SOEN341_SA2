import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/api";
import { Divider } from "antd";

export class JobBox extends React.Component {
  render() {
    const {
      job_id,
      job_company,
      job_position,
      job_location,
      job_type,
      job_category,
      job_description,
      date_created
    } = this.props;

    let date = formatDate(date_created);

    return (
      <div className="JobBox grey-border">
        <div className="JobBox__position">{job_position}</div>
        <div className="JobBox__company">Position posted by {job_company}</div>
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
      </div>
    );
  }
}
