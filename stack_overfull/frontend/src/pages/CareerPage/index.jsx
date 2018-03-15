import React from "react";
import "./index.css";
import { SideBar } from "../../components";
import { Card } from "antd";

const jobCategories = [
  {
    field: "Arts",
    category: ["Photography", "Architechture", "Music", "Theatre"]
  },
  {
    field: "Administration",
    category: ["Receptionist", "Coordinator", "Payroll Administrator"]
  },
  {
    field: "Commerce",
    category: ["Sales Representative", "Accountant", "Marketing"]
  },
  {
    field: "Engineering",
    category: [
      "Computer Science",
      "Software Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Industrial Engineering"
    ]
  },
  {
    field: "Education",
    category: [
      "Tutor",
      "Elementary School Teacher",
      "Highschool Teacher",
      "Cegep Teacher",
      "University Teacher"
    ]
  },
  {
    field: "Science",
    category: ["Biology", "Chemistry", "Physics", "Sociology", "Geoscience"]
  }
];

const list1 = [
  {
    title: "Front-end Developper",
    category: "Sofware Engineering and Computer Science",
    city: "Montreal",
    province: "QC",
    type: "Part-time",
    date_posted: "25 days ago"
  },
  {
    title: "Back-end Developper",
    category: "Software Engineering and Computer Science",
    city: "Toronto",
    province: "ON",
    type: "Full-time",
    date_posted: "2 days ago"
  },
  {
    title: "Financial Assistant",
    category: "Finance",
    city: "Ottawa",
    province: "ON",
    type: "Internship",
    date_posted: "13 days ago"
  },
  {
    title: "English Tutor",
    category: "English Literature",
    city: "Montreal",
    province: "QC",
    type: "Internship",
    date_posted: "17 days ago"
  },
  {
    title: "Mechanical Designer",
    category: "Mechanical Engineering",
    city: "Laval",
    province: "QC",
    type: "Full-time",
    date_posted: "10 days ago"
  }
];

const list2 = [
  {
    title: "Front-end Developper",
    category: "Sofware Engineering and Computer Science",
    city: "Montreal",
    province: "QC",
    type: "Part-time",
    date_posted: "25 days ago"
  },
  {
    title: "Back-end Developper",
    category: "Software Engineering and Computer Science",
    city: "Toronto",
    province: "ON",
    type: "Full-time",
    date_posted: "2 days ago"
  },
  {
    title: "Financial Assistant",
    category: "Finance",
    city: "Ottawa",
    province: "ON",
    type: "Internship",
    date_posted: "13 days ago"
  },
  {
    title: "English Tutor",
    category: "English Literature",
    city: "Montreal",
    province: "QC",
    type: "Internship",
    date_posted: "17 days ago"
  },
  {
    title: "Mechanical Designer",
    category: "Mechanical Engineering",
    city: "Laval",
    province: "QC",
    type: "Full-time",
    date_posted: "10 days ago"
  }
];
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
      </div>
    );
  }
}
