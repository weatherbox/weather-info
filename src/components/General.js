import React, { Component } from 'react';

import Header from './Header';
import AccordionList from './AccordionList';


export default class General extends Component {
  render() {
    return (
      <div className="info-pref">
        <Header jmaCode="index">全般気象情報</Header>
        <AccordionList info={this.props.info} />
      </div>
    );
  }
}
