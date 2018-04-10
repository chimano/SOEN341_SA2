import React from "react";
import { SignInFormWindow } from "../../components";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<SignInFormWindow />", () => {
  it("renders 1 <SignInFormWindow /> component", () => {
    const component = shallow(<SignInFormWindow />);
    expect(component).toHaveLength(1);
  });
});
