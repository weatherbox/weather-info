import React, { Component } from 'react';

import Header from './Header';
import AccordionList from './AccordionList';


export default class Region extends Component {
  render() {
    const regionTitle = this.props.info[0].title.split('に関する')[1];

    return (
      <div className="info-pref">
        <Header code={this.props.code}>{regionTitle}</Header>
        <AccordionList info={this.props.info} key={regionTitle} />
      </div>
    );
  }
}
