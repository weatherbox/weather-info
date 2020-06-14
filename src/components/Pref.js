import React, { Component } from 'react';

import Header from './Header';
import AccordionList from './AccordionList';
import prefRegion from './pref-region.json';

export default class Pref extends Component {
  render() {
    const prefTitle = this.props.prefName + '気象情報';
    const jmaCode = prefRegion[this.props.code].jmaCode;
    const region = prefRegion[this.props.code].region;

    return (
      <div className="info-pref">
        <Header
          jmaCode={jmaCode}
          bread={[
            { title: 'Home', onClick: () => this.props.navigate('index') },
            { title: region.name, onClick: () => this.props.navigate('region', region) },
          ]}
        >
          {prefTitle}
        </Header>
        {this.props.info ? this.renderContent(prefTitle) : this.renderNone()}
      </div>
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
