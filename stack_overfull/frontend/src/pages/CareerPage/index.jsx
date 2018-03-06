import React from 'react';
import './index.css';
import axios from 'axios';

export class CareerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentWillMount() {
    this.setState({
      list: list1
    });
  }

  handleCategory = v => {
    if ((v = 4)) {
      this.setState({
        list: list1
      });
    } else {
      this.setState({
        list: list2
      });
    }
  };

  render() {
    console.log("state of CareerPage: ", this.state);

    const { list } = this.state;

    return (
      <div className="body-wrapper">
        <div className="page-width CareerPage">
          <SideBar handleCategory={this.handleCategory} />
          <div className="CareerPage__list">
            {list.map((job, key) => (
              <div className="CareerPage__list__card" key={key}>
                <Card
                  title={job.title}
                  bordered={false}
                  style={{ width: "100%" }}
                >
                  <div>{job.category}</div>
                  <div>{job.city}</div>
                  <div>{job.province}</div>
                  <div>{job.type}</div>
                  <div>{job.date_posted}</div>
                </Card>
              </div>
            ))}
          </div>
        </div>
        )
    }
}