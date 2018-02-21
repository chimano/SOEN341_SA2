import React from "react";
import { Footer } from "./index.jsx";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount, render } from "enzyme";

configure({ adapter: new Adapter() });

describe("<Footer />", () => {

  it("renders 1 <Footer /> component", () => {
    const component = shallow(<Footer />);
    expect(component).toHaveLength(1);
  });

  it("has 4 unordered list", () => {
    const component = shallow(<Footer />);
    expect(component.find('.footer').children()).toHaveLength(4);
  })
});
