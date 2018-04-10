import React from 'react';
import { VotingButtons } from '../../components';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<VotingButtons />', () => {
  const points = 10;
  const upvotedArray = [1, 4, 6];
  const downvotedArray = [3, 7, 9];

  it('renders 1 <VotingButtons /> component', () => {
    const component = shallow(<VotingButtons points={points} upvotedArray={upvotedArray} downvotedArray={downvotedArray} />);
    expect(component).toHaveLength(1);
  });
});
