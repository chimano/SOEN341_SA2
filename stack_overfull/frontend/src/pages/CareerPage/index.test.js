import React from "react";
import { CareerPage } from "../../pages";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<CareerPage />", () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <CareerPage />
    );
    component.setState({
      list:[
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
      ]
    })
  });

  it("renders 1 <CareerPage /> component", () => {
    expect(component).toHaveLength(1);
  });
});
