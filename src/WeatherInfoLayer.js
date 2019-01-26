import React, { Component } from 'react';

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
    if (!this.map || !this.weatherInfo) return;

    const now = Date.now();
    var stops = [];

    for (let code in this.weatherInfo.prefs){
      const pref = this.weatherInfo.prefs[code];
      const time = new Date(pref.time);

      // last 24h
      if ((now - time) <= 24 * 3600 * 1000){
        console.log(pref);
        stops.push([code, 'rgba(0, 49, 73, 0.5)']);
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

  render() {
    return null;
  }
}

