import React, { Component } from 'react';
import { Header, List } from 'semantic-ui-react';

import { reportTime } from '../util'

export default class General extends Component {

  render() {
    return (
      <div className="info-general">
        <Header as='h3'>全般</Header>
        <List inverted relaxed>
          {this.renderInfo()}
        </List>
      </div>
    );
  }
  
  renderInfo() {
    const info = this.props.info[0];
    const time = new Date(info.datetime);

    if ((Date.now() - time) <= this.props.period * 3600 * 1000){
      const title = info.title;
      const time_str = reportTime(time) + " 第" + parseInt(info.id.slice(-3)) + "号";
      return (
        <List.Item onClick={this.props.onClick} >
          <List.Content>
            <List.Header>{title}</List.Header>
            <List.Description>{time_str}</List.Description>
            <p className="info-list-headline">{info.headline}</p>
          </List.Content>
        </List.Item>
      );
    } else {
      return null;
    }
  }
}

