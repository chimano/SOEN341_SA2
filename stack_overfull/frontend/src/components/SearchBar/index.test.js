import React from "react";
import { SearchBar } from "../../components";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<SearchBar />", () => {
  it("SideBar", () => {
    const component = shallow(<SearchBar />);
    expect(component).toHaveLength(1);
  });
});
