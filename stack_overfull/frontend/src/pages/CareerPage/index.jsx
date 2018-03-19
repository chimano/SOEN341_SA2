import React from "react";
import "./index.css";
import { getApiJob, postApiJob } from "../../utils/api";
import { SideBar, PostJobButton, JobList } from "../../components";
import { Card } from "antd";

function humanize(str) {
  var frags = str.split("_");
  for (let i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(" ");
}

export class CareerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobList: [],
      category: "computer_science",
      title: "Computer Science"
    };
  }

  componentDidMount = () => {
    this.getJobList();
  };

  getJobList = category => {
    getApiJob(category)
      .then(response => {
        console.log("response of getApiJob(category)", response);
        let categoryName = humanize(category);
        this.setState({
          jobList: response.data.job_list,
          title: categoryName
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { jobList, title } = this.state;

    return (
      <div className="body-wrapper">
        <div className="page-width CareerPage">
          <SideBar
            getJobList={this.getJobList}
          />
          <div className="CareerPage__list">
            <div className="CareerPage__title-button">
              <h3 className="CareerPage__title">{title}</h3>
              <PostJobButton />
            </div>
            <JobList jobList={jobList} />
          </div>
        </div>
      </div>
    );
  }
}
