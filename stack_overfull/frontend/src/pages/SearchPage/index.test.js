import React from "react";
import { SearchPage } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<SearchPage />", () => {
  let component;
  let location = { search: "/search/?q=sadas" };

  beforeEach(() => {
    component = shallow(<SearchPage location={location} />);
  });

  it("renders 1 <SearchPage /> component", () => {
    expect(component).toHaveLength(1);
  });
});
