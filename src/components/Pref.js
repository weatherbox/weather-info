import React, { Component } from 'react';
import { Breadcrumb } from 'semantic-ui-react';

import Header from './Header';
import AccordionList from './AccordionList';
import prefRegion from './pref-region.json';

export default class Pref extends Component {
  render() {
    const prefTitle = this.props.prefName + '気象情報';
    const jmaCode = prefRegion[this.props.code].jmaCode;

    return (
      <div className="info-pref">
        {this.renderBreadcrumb()}
        <Header jmaCode={jmaCode}>{prefTitle}</Header>
        {this.props.info ? this.renderContent(prefTitle) : this.renderNone()}
      </div>
    );
  }

  renderBreadcrumb() {
    const region = prefRegion[this.props.code].region;
    console.log(region);
    return (
      <Breadcrumb className="pref-breadcrumb">
        <Breadcrumb.Section link>Home</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section link onClick={() => this.props.navigate('region', region)}>
          {region.name}
        </Breadcrumb.Section>
      </Breadcrumb>
    );
  }

  renderContent(key) {
    return (
      <AccordionList info={this.props.info} key={key} />
    );
  }
  
  renderNone() {
    return (
      <p>過去{this.props.period}時間に発表された情報はありません</p>
    );
  }
}
