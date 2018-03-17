import React from "react";
import { JobList } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<JobList />", () => {
  const jobList = [];
  const component = shallow(<JobList jobList={jobList} />);
  it("renders 1 <JobList /> component", () => {
    expect(component).toHaveLength(1);
  });
});
