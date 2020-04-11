import React, { Component } from 'react';
import { Sidebar, Header, List } from 'semantic-ui-react';

import './Sidebar.css';

import General from './components/General';
import RegionList from './components/RegionList';

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
          {this.props.data ?
            <>
              <General info={this.props.data.general} period={this.props.period} />
              <RegionList regions={this.props.data.regions} period={this.props.period} />
            </>
          : null}
        </div>
      </Sidebar>
    );
  }
}


