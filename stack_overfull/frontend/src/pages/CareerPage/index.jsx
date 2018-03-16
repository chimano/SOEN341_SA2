import React from "react";
import "./index.css";
import { getApiJob, postApiJob } from "../../utils/api";
import { SideBar, PostJobButton, JobList } from "../../components";
import { Card } from "antd";

export class CareerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobList: [],
      category: "computer_science"
    };
  }

  componentDidMount = () => {
    this.getJobList();
  };

  getJobList = category => {
    getApiJob(category)
      .then(response => {
        console.log("response of getApiJob(category)", response);
        this.setState({
          jobList: response.data.job_list
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { jobList } = this.state;

    return (
      <div className="body-wrapper">
        <div className="page-width CareerPage">
          <PostJobButton />

          <SideBar
            handleCategory={this.handleCategory}
            getJobList={this.getJobList}
          />
          <div className="CareerPage__list">
            <JobList jobList={jobList} />
          </div>
        </div>
      </div>
    );
  }
}
