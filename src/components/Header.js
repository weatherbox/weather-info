import React, { Component } from 'react';
import { Header, Button } from 'semantic-ui-react';


export default class InfoHeader extends Component {
  onClick = () => {
    const code = this.props.jmaCode;
    const page = code === 'index' ? '' : code + '_';
    const url = `https://www.jma.go.jp/jp/kishojoho/${page}index.html`;
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

