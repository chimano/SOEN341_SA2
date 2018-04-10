import React from "react";
import { ProfilePage } from "../../pages";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<ProfilePage />", () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <ProfilePage />
    );
  });

  it("renders 1 <ProfilePage /> component", () => {
    expect(component).toHaveLength(1);
  });
});
