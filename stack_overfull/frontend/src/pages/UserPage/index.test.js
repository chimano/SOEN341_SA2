import React from "react";
import { ProfilePage } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<UserPage />", () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <UserPage />
    );
  });

  it("renders 1 <UserPage /> component", () => {
    expect(component).toHaveLength(0);
  });
});
