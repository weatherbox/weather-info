import React, { Component } from 'react';

import Header from './Header';
import AccordionList from './AccordionList';


export default class Region extends Component {
  render() {
    const regionTitle = this.props.name ? this.props.name + '気象情報' :
      this.props.info[0].title.split('に関する')[1];
    console.log(this.props.code);
    const jmaCode = jmaCodeTable[this.props.code];

    return (
      <div className="info-pref">
        <Header jmaCode={jmaCode}
          bread={[
            { title: 'Home', onClick: () => this.props.navigate('index') },
          ]}
        >
          {regionTitle}
        </Header>
        {this.props.info ? this.renderContent(regionTitle) : this.renderNone()}
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

const jmaCodeTable = {
  // regions
  '010100': '101',
  '010200': '102',
  '010300': '103',
  '010400': '105',
  '010500': '104',
  '010600': '106',
  '010700': '107',
  '010800': '108',
  '010900': '109',
  '011000': '110',
  '011100': '111',
};
