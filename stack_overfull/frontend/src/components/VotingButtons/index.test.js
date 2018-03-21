import React from "react";
import { VotingButtons } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<VotingButtons />", () => {
  const points = 10;
  const upvoted_array = [1, 4, 6];
  const downvoted_array = [3, 7, 9];

  it("renders 1 <VotingButtons /> component", () => {
    const component = shallow(
      <VotingButtons
        points={points}
        upvoted_array={upvoted_array}
        downvoted_array={downvoted_array}
      />
    );
    expect(component).toHaveLength(1);
  });
});
