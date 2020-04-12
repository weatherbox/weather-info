import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

import AccordionList from './AccordionList';


export default class Pref extends Component {
  render() {
    const prefTitle = this.props.info[0].title.split('に関する')[1];

    return (
      <div className="info-pref">
        <Header as='h3'>{prefTitle}</Header>
        <AccordionList info={this.props.info} key={prefTitle} />
      </div>
    );
  }
}
