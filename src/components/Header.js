import React, { Component } from 'react';
import { Header, Button } from 'semantic-ui-react';


export default class InfoHeader extends Component {
  onClick = () => {
    const code = this.props.code;
    const jmaCode = code === 'index' ? '' : jmaCodeTable[code] + '_';
    const url = `https://www.jma.go.jp/jp/kishojoho/${jmaCode}index.html`;
    window.open(url, '_blank', 'noopener');
  }

  render() {
    return (
      <div className="info-header">
        <Header as='h3'>
          {this.props.children}
          <Button className="info-header-link" icon='linkify' inverted size='mini' onClick={this.onClick} />
        </Header>
      </div>
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

  // prefs
};
