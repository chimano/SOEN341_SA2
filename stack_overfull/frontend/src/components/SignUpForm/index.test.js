import React from "react";
import { SignUpFormWindow } from "../../components";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<SignUpFormWindow />", () => {
  it("renders 1 <SignUpFormWindow /> component", () => {
    const component = shallow(<SignUpFormWindow />);
    expect(component).toHaveLength(1);
  });
});
