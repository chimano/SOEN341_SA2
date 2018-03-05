import React from "react";
import { CategoryListPage } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<CategoryListPage />", () => {
  let component;

  beforeEach(() => {
    component = shallow(<CategoryListPage />);
  });

  it("renders 1 <CategoryListPage /> component", () => {
    expect(component).toHaveLength(1);
  });
});