import React from "react";
import { HomePage } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<HomePage />", () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <HomePage />
    );
  });

  it("renders 1 <HomePage /> component", () => {
    expect(component).toHaveLength(1);
  });
});
