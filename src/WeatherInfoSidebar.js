import React, { Component } from 'react';
import { Sidebar, Header } from 'semantic-ui-react';

import './Sidebar.css';

import General from './components/General';
import RegionList from './components/RegionList';
import Pref from './components/Pref';

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
        {this.props.showPref ? this.renderPref() : this.renderIndex()}
      </Sidebar>
    );
  }

  renderIndex() {
    return (
      <div>
        <Header as='h2'>気象情報</Header>
        {this.props.data ?
          <>
            <General info={this.props.data.general} period={this.props.period} />
            <RegionList regions={this.props.data.regions} period={this.props.period} />
          </>
        : null}
      </div>
    );
  }

  renderPref() {
    const code = this.props.showPref;
    if (this.props.data && this.props.data.prefs[code]) {
      return (
        <Pref info={this.props.data.prefs[code]} />
      );
    }
  }
}


