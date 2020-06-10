import React, { Component } from 'react';
import { Header, Breadcrumb } from 'semantic-ui-react';

import AccordionList from './AccordionList';
import prefRegion from './pref-region.json';

export default class Pref extends Component {
  render() {
    return (
      <div className="info-pref">
        {this.renderBreadcrumb()}
        {this.props.info ? this.renderContent() : this.renderNone()}
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

  renderContent() {
    const prefTitle = this.props.info[0].title.split('に関する')[1];
    return (
      <>
        <Header as='h3'>{prefTitle}</Header>
        <AccordionList info={this.props.info} key={prefTitle} />
      </>
    );
  }
  
  renderNone() {
    const prefTitle = this.props.prefName + '気象情報';
    return (
      <>
        <Header as='h3'>{prefTitle}</Header>
        <p>過去{this.props.period}時間に発表された情報はありません</p>
      </>
    );
  }
}
