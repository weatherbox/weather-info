import React, { Component } from 'react';

import WeatherInfoSidebar from './WeatherInfoSidebar';

const hokkaidoPrefCodes = {
  "011000": ["011000"], // 宗谷地方
  "012000": [
    "012010", // 上川地方
    "012020"  // 留萌地方
  ],
  "013000": ["013000"], // 網走・北見・紋別地方
  "014100": [
    "014020", // 釧路地方
    "014010"  // 根室地方
  ],
  "014030": ["014030"], // 十勝地方
  "015000": [
    "015010", // 胆振地方
    "015020"  // 日高地方
  ],
  "016000": [
    "016010", // 石狩地方
    "016020", // 空知地方
    "016030"  // 後志地方
  ],
  "017000": [
    "017010", // 渡島地方
    "017020"  // 檜山地方
  ]
};


export default class WeatherInfoLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regions: {}
    };
  }

  componentDidMount() {
    this.loadWeatherInfo();
  }

  onload(map) {
    this.map = map;

    this.map.addSource("pref-vt", {
      "type": "vector",
      "minzoom": 0,
      "maxzoom": 10,
      "tiles": ["https://weatherbox.github.io/warning-area-vt/pref/{z}/{x}/{y}.pbf"]
    });

    this.map.addLayer({
      "id": "pref-line",
      "type": "line",
      "source": "pref-vt",
      "source-layer": "prefallgeojson",
      "paint": {
        "line-color": "rgba(123, 124, 125, 0.7)"
      }
    });

    this.renderWeatherInfo();
  }

  loadWeatherInfo() {
    const timestamp = new Date().getTime();
    fetch('https://storage.googleapis.com/weather-info/weather-info-all.json?' + timestamp, {mode: 'cors'})
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.weatherInfo = data;
        this.renderWeatherInfo();
      });
  }

  renderWeatherInfo() {
    if (!this.map || !this.weatherInfo) return;

    this.renderWeatherInfoPrefs();
    this.renderWeatherInfoRegions();

    this.setState({
      regions: this.weatherInfo.regions
    });
  }

  renderWeatherInfoPrefs() {
    const now = Date.now();
    var stops = [];

    for (let code in this.weatherInfo.prefs){
      const pref = this.weatherInfo.prefs[code];
      const time = new Date(pref.time);

      // last 24h
      if ((now - time) <= 24 * 3600 * 1000){
        if (code in hokkaidoPrefCodes){
          for (let c of hokkaidoPrefCodes[code]){
            stops.push([c, 'rgba(0, 49, 73, 0.5)']);
          }

        }else{
          stops.push([code, 'rgba(0, 49, 73, 0.5)']);
        }
      }
    }

    this.map.addLayer({
      "id": "warning-info-pref",
      "type": "fill",
      "source": "pref-vt",
      "source-layer": "prefallgeojson",
      "paint": {
        "fill-color": {
          "property": "prefCode",
          "type": "categorical",
          "stops": stops,
          "default": "rgba(0, 0, 0, 0)"
        },
        "fill-outline-color": "rgba(123, 124, 125, 0.7)"
      }
    });
  }
  
  renderWeatherInfoRegions() {
    const now = Date.now();
    var stops = [];

    for (let code in this.weatherInfo.regions){
      const region = this.weatherInfo.regions[code];
      const time = new Date(region.time);

      // last 24
      if ((now - time) <= 24 * 3600 * 1000){
        console.log(region);
      }
    }
  }

  render() {
    return (
      <WeatherInfoSidebar
        regions={this.state.regions}
      />
    );
  }
}


