import React, { Component } from 'react';
import { Header, List } from 'semantic-ui-react';

import { reportTime } from '../util'


export default class RegionList extends Component {

  render() {
    const keys = Object.keys(this.props.regions).sort();
    const now = Date.now();

    return (
      <div>
        <Header as='h3'>地方</Header>
        <List inverted relaxed>
          {keys.map(code => {
            const region = this.props.regions[code][0];
            const time = new Date(region.datetime);

            if ((now - time) <= this.props.period * 3600 * 1000){
              const title = region.title + " 第" + parseInt(region.id.slice(-3)) + "号";
              const time_str = reportTime(time);
              return (
                <List.Item key={code}>
                  <List.Content>
                    <List.Header>{title}</List.Header>
                    <List.Description>{time_str}</List.Description>
                  </List.Content>
                </List.Item>
              );
            }
            return null;
          })}
        </List>
      </div>
    );
  }
}


