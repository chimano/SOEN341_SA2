import React from "react";
import { TagPage } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<TagPage />", () => {
  let component;
  let location = { search: "/tags/?q=newtag" };

  beforeEach(() => {
    component = shallow(<TagPage location={location} />);
  });

  it("renders 1 <TagPage /> component", () => {
    expect(component).toHaveLength(1);
  });
});
