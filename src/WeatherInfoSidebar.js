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
          {regionList(this.props.regions)}
        </div>
      </Sidebar>
    );
  }
}

const regionList = (regions) => {
  const keys = Object.keys(regions).sort();
  if (keys.length <= 0) return null;
  const now = Date.now();

  return (
    <List>
      {keys.map(code => {
        const region = regions[code];
        const time = new Date(region.time);

        // last 24h
        if ((now - time) <= 24 * 3600 * 1000){
          return (<List.Item key={code}>{region.title}</List.Item>);
        }
      })}
    </List>
  );
};


