import React, { Component } from 'react';
import { Sidebar, Header, List } from 'semantic-ui-react';

import './Sidebar.css';


export default class WeatherInfoSidebar extends Component {

  render() {
    return (
      <Sidebar
        animation='overlay'
        direction='right'
        className='sidebar-dark'
        inverted='true'
        vertical='true'
        visible>
        <div>
          <Header as='h2'>気象情報</Header>
          <Header as='h3'>全般</Header>
          <Header as='h3'>地方</Header>
          {regionList(this.props.regions, this.props.period)}
        </div>
      </Sidebar>
    );
  }
}

const regionList = (regions, period) => {
  const keys = Object.keys(regions).sort();
  if (keys.length <= 0) return null;
  const now = Date.now();

  return (
    <List inverted relaxed>
      {keys.map(code => {
        const region = regions[code];
        const time = new Date(region.datetime);

        if ((now - time) <= period * 3600 * 1000){
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
      })}
    </List>
  );
};

function reportTime(t) {
    var date = pad(t.getMonth() + 1) + '/' + pad(t.getDate());
    var time = pad(t.getHours()) + ':' + pad(t.getMinutes());
    return date + ' ' + time;
}

function pad(x) {
  return ('0' + x).slice(-2);
}

