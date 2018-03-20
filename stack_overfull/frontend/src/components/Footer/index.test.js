import React from "react";
import { Footer } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<Footer />", () => {
  it("renders 1 <Footer /> component", () => {
    const component = shallow(<Footer />);
    expect(component).toHaveLength(1);
  });

  it("has 1 unordered list", () => {
    const component = shallow(<Footer />);
    expect(component.find(".footer").children()).toHaveLength(1);
  });

  it("has a list with h3 title equal \"Questions\"", () => {
    const component = shallow(<Footer />);
    expect(component.contains(<h3>Questions</h3>)).toEqual(false);
  });
});
