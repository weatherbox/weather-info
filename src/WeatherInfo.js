import React, { Component } from 'react';

import WeatherInfoSidebar from './WeatherInfoSidebar';
import WeatherInfoLayer from './WeatherInfoLayer';

const url = 'https://storage.googleapis.com/weather-info/weather-info-all.json';

export default class WeatherInfo extends Component {
  state = { info: null };

  componentDidMount() {
    this.loadWeatherInfo();
  }

  onload(map) {
    this.map = map;
    this.addLayer();
  }
  
  loadWeatherInfo() {
    const timestamp = new Date().getTime();
    fetch(url + '?' + timestamp, {mode: 'cors'})
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ info: data });
        this.weatherInfo = data;
        this.addLayer();
      });
  }

  addLayer() {
    if (!this.map || !this.weatherInfo) return;
    this.layer = new WeatherInfoLayer(this.map, this.weatherInfo, this.props.period, this.onSelected);
  }

  render() {
    return (
      <WeatherInfoSidebar
        data={this.state.info}
        period={this.props.period}
      />
    );
  }

  onSelected = (code) => {
    console.log(this.weatherInfo.prefs[code]);
  }
}
