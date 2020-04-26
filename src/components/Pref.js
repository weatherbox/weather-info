import React, { Component } from 'react';
import { Header, Breadcrumb } from 'semantic-ui-react';

import AccordionList from './AccordionList';
import prefRegion from './pref-region.json';

export default class Pref extends Component {
  render() {
    const prefTitle = this.props.info[0].title.split('に関する')[1];

    return (
      <div className="info-pref">
        {this.renderBreadcrumb()}
        <Header as='h3'>{prefTitle}</Header>
        <AccordionList info={this.props.info} key={prefTitle} />
      </div>
    );
  }

  renderBreadcrumb() {
    const region = prefRegion[this.props.code];
    console.log(region);
    return (
      <Breadcrumb className="pref-breadcrumb">
        <Breadcrumb.Section link>Top</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section link>{region.name}</Breadcrumb.Section>
      </Breadcrumb>
    );
  }
}
