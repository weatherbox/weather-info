import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

export default class Map extends Component {
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
  }

  render() {
    return null;
  }
}

