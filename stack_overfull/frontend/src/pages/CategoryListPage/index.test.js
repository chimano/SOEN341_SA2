import React from "react";
import { CategoryPage } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<CategoryPage />", () => {
  let component;

  beforeEach(() => {
    component = mount(
      <CategoryPage />
    );
  });

  it("renders 1 <CategoryPage /> component", () => {
    expect(component).toHaveLength(1);
  });
});
