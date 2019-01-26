import React, { Component } from 'react';
import { Sidebar, Header } from 'semantic-ui-react';

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
        </div>
      </Sidebar>
    );
  }
}

