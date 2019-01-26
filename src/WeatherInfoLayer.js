import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

export default class Map extends Component {
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
    if (!this.map || this.weatherInfo) return;


  }

  render() {
    return null;
  }
}

