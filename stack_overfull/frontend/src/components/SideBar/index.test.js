import React from "react";
import { SideBar } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<SideBar />", () => {
  it("renders 1 <SideBar /> component", () => {
    const component = shallow(<SideBar />);
    expect(component).toHaveLength(1);
  });
});
