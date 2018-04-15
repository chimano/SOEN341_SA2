// @flow
import React from 'react';
import { Tag } from 'antd';
// import "./index.css";

const { CheckableTag } = Tag;

/* All filters supported by backend
  'head', 'text', 'username', 'tags','answered', 'notanswered', 'accepted', 'notaccepted'
*/

// Filters that can be selected by users
const filterNames = ['head', 'text', 'username', 'tags', 'answered', 'accepted'];

// Names for filters that are displayed for users
const filterDisplayNames = ['Header', 'Text', 'Usernames', 'Tags', 'Answered', 'Accepted'];

type Props = {
  defaultFilters: Array<string>,
  onFiltersChange: (string) => {},
};

type State = { selectedFilters: Array<string> };

export default class SearchFiltersBar extends React.Component<Props, State> {
  state = {
    selectedFilters: [],
  };

  componentDidMount() {
    if (this.props.defaultFilters) this.state.selectedFilters = [...this.props.defaultFilters];
  }

  handleChange(filterName:string, checked:string) {
    const { selectedFilters } = this.state;
    const nextSelectedFilters = checked
      ? [...selectedFilters, filterName]
      : selectedFilters.filter(item => item !== filterName);

    // if present execute onFiltersChange callback
    if (this.props.onFiltersChange) this.props.onFiltersChange(nextSelectedFilters);

    this.setState({ selectedFilters: nextSelectedFilters });
  }

  render() {
    const { selectedFilters } = this.state;

    const filterElementsList = filterNames.map(filterName => (
      <CheckableTag
        key={filterName}
        checked={selectedFilters.includes(filterName)}
        onChange={checked => this.handleChange(filterName, checked)}
      >
        {filterDisplayNames[filterNames.indexOf(filterName)]}
      </CheckableTag>
    ));

    return (
      <div style={{ display: 'inline-block' }}>
        <h6 style={{ marginRight: 8, display: 'inline' }}>Search by:</h6>
        {filterElementsList}
      </div>
    );
  }
}
