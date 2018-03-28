// @flow
import React from 'react';
import './index.css';
import { getApiJob } from '../../utils/api';
import { SideBar, PostJobButton, JobList } from '../../components';

function humanize(str) {
  const frags = str.split('_');
  for (let i = 0; i < frags.length; i += 1) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

type Props = {
  is_employer: boolean,
};

type State = {
  jobList: Array<Object>,
  category: string,
  title: string,
};

export default class CareerPage extends React.Component<Props, State> {
  state = {
    jobList: [],
    category: 'computer_science',
    title: 'Computer Science',
  };

  componentDidMount = () => {
    const { category } = this.state;
    this.getJobList(category);
  };

  getJobList = (category: string) => {
    getApiJob(category).then((response) => {
      const categoryName = humanize(category);
      this.setState({
        jobList: response.data.job_list,
        title: categoryName,
      });
    });
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  render() {
    const { jobList, title } = this.state;
    const { is_employer } = this.props;

    return (
      <div className="body-wrapper">
        <div className="page-width CareerPage">
          <SideBar getJobList={this.getJobList} />
          <div className="CareerPage__list">
            <div className="CareerPage__title-button">
              <h2 className="CareerPage__title">{title}</h2>
              {is_employer ? <PostJobButton /> : ''}
            </div>

            {is_employer ? (
              <JobList jobList={jobList} hideApplyButton />
            ) : (
              <JobList jobList={jobList} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
