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
      <div className="JobBox">
        <div className="JobBox__position">{job_position}</div>
        <div className="JobBox__companylocation">
          Position posted by {job_company}, {job_location}
        </div>
        <Divider />
        <div className="JobBox__description">{job_description}</div>
        <div className="JobBox__generalinfo">
          <div>Career Field: {job_category}</div>
          <div>Type: {job_type}</div>
          <div>Location: {job_location}</div>
          <div>Position posted on {date}{" "}</div>
        </div>
      </div>
    );
  }
}
