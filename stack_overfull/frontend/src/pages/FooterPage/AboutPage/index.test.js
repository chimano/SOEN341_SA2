import React from "react";
import { AboutPage } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<AboutPage />", () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <AboutPage />
    );
  });

  it("renders 1 <AboutPage /> component", () => {
    expect(component).toHaveLength(1);
  });
});
