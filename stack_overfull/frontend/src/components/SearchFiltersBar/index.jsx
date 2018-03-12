import React from "react";
import {Tag} from "antd"
//import "./index.css";

const CheckableTag = Tag.CheckableTag;

const filterNames = ['head', 'text', 'username', 'tags', 'answered', 'accepted']
const filterDisplayNames = ['Header', 'Text', 'Usernames', 'Tags', 'Answered', 'Accepted'];

export class SearchFiltersBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFilters: [],
    };

    if (this.props.defaultFilters)
      this.state.selectedFilters = [...this.props.defaultFilters];
  }


  handleChange(filterName, checked) {
    const { selectedFilters } = this.state;
    const nextSelectedFilters = checked ?
            [...selectedFilters, filterName] :
            selectedFilters.filter(item => item !== filterName);

    console.log('Selected Filters ', nextSelectedFilters);

    // if present execute onFiltersChange callback
    if (this.props.onFiltersChange)
      this.props.onFiltersChange(nextSelectedFilters);

    this.setState({ selectedFilters: nextSelectedFilters });
  }


  render() {
    const { selectedFilters } = this.state;

    let filterElementsList = filterNames.map( filterName => (
      <CheckableTag
        key={filterName}
        checked={selectedFilters.includes(filterName)}
        onChange={checked => this.handleChange(filterName, checked)}
      >
        {filterDisplayNames[filterNames.indexOf(filterName)]}
      </CheckableTag>
    ));

    return (
      <div style={{display: 'inline-block'}}>
        <h6 style={{ marginRight: 8, display: 'inline' }}>Search by:</h6>
        {filterElementsList}
      </div>
    );
  }
}
