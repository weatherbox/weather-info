import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

import AccordionList from './AccordionList';


export default class GeneralList extends Component {
  render() {
    return (
      <div className="info-pref">
        <Header as='h3'>全般気象情報</Header>
        <AccordionList info={this.props.info} />
      </div>
    );
  }
}
