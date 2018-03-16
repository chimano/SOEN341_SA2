import React from "react";
import { JobBox } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<JobBox />", () => {
  let component;
  const description = "Hello this is a job.";
  const id = "4";
  const company = "Apple";
  const position = "Front-End Developer";
  const type = "Internship";
  const location = "Montreal";
  const category = "software_engineering";
  const date_created = "2018-03-03T21:07:58.897193Z";

  beforeEach(() => {
    component = shallow(
      <JobBox
        description={description}
        id={id}
        company={company}
        position={position}
        type={type}
        location={location}
        category={category}
        date_created={date_created}
      />
    );
  });

  //Checks if the component renders without errors
  it("renders 1 <JobBox /> component", () => {
    expect(component).toHaveLength(1);
  });
});
