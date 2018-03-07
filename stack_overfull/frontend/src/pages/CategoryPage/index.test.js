import React from "react";
import { CategoryPage } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<CategoryPage />", () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <CategoryPage
        match={{
          params: { category: "software engineering" },
          path: "",
          url: ""
        }}
      />
    );
  });

  it("renders 1 <CategoryPage /> component", () => {
    expect(component).toHaveLength(1);
  });
});
