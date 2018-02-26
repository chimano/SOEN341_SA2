import React from "react";
import { SearchBar } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<SearchBar />", () => {
  it("renders 1 <SearchBar /> component", () => {
    const component = shallow(<SearchBar />);
    expect(component).toHaveLength(1);
  });
});
