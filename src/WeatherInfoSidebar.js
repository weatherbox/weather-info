import React, { Component } from 'react';
import { Sidebar, Header } from 'semantic-ui-react';

import './Sidebar.css';

import GeneralIndex from './components/GeneralIndex';
import RegionList from './components/RegionList';

import General from './components/General';
import Region from './components/Region';
import Pref from './components/Pref';

export default class WeatherInfoSidebar extends Component {
  state = { show: null }; // { type, code }

  render() {
    return (
      <Sidebar
        animation='overlay'
        direction='right'
        className='sidebar-dark'
        inverted='true'
        vertical='true'
        visible>
        {this.state.show ? this.renderShow() : this.renderIndex()}
      </Sidebar>
    );
  }

  renderIndex() {
    return (
      <div>
        <Header as='h2'>気象情報</Header>
        {this.props.data ?
          <>
            <GeneralIndex
              info={this.props.data.general}
              period={this.props.period}
              onClick={() => this.setState({ show: { type: 'general' } })}
            />
            <RegionList
              regions={this.props.data.regions}
              period={this.props.period}
              onClick={this.selectRegion}
            />
          </>
        : null}
      </div>
    );
  }

  navigate = (type, area) => {
    if (type === 'index') {
      this.setState({ show: null });

    } else if (type === 'region') {
      this.selectRegion(area.code, area.name);
    } 
  }

  selectRegion = (code, name) => {
    this.setState({ show: { type: 'region', code, name } });
    this.props.onSelectRegion(code);
  }

  showPref(code, prefName) {
    this.setState({ show: { type: 'pref', code, prefName } });
  }

  renderShow() {
    const show = this.state.show;
    console.log(show);
    if (show.type === 'general') {
      return this.renderGeneral();

    } else if (show.type === 'region') {
      return this.renderRegion(show.code, show.name);

    } else if (show.type === 'pref') {
      return this.renderPref(show.code, show.prefName);
    }
  }
  
  renderGeneral() {
    if (this.props.data && this.props.data.general) {
      return (
        <General
          info={this.props.data.general}
          navigate={this.navigate}
        />
      );
    }
  }
  
  renderRegion(code, name) {
    if (this.props.data) {
      return (
        <Region
          code={code}
          info={this.props.data.regions[code]}
          name={name}
          period={this.props.period}
          navigate={this.navigate}
        />
      );
    }
  }

  renderPref(code, prefName) {
    if (this.props.data) {
      return (
        <Pref
          code={code}
          info={this.props.data.prefs[code]}
          prefName={prefName}
          period={this.props.period}
          navigate={this.navigate}
        />
      );
    }
  }
}


