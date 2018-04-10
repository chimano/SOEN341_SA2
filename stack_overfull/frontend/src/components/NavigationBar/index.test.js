import React from "react";
import { NavigationBar } from "../../components";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<NavigationBar />", () => {
  it("renders 1 <NavigationBar /> component", () => {
    const component = shallow(<NavigationBar />);
    expect(component).toHaveLength(1);
  });
});
