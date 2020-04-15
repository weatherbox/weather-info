import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'

import WeatherInfo from './WeatherInfo';

mapboxgl.accessToken = 'pk.eyJ1IjoidGF0dGlpIiwiYSI6ImNqZWZ4eWM3NTI2cGszM2xpYXEyZndpd3IifQ.ifzbR45HecVGxChbdR2hiw';


export default class Map extends Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/tattii/cj1bob6hw003t2rr5s2svi3iq',
      zoom: 5,
      center: [136.6, 35.5],
      hash: true,
      attributionControl: false
    });

    this.map.on('load', () => {
      this.child.onload(this.map);
    });
  }

  render() {
    return (
      <div className="app">
        <div ref={el => this.mapContainer = el} id="map" />
        <WeatherInfo
          ref={ref => this.child = ref}
          period={48}
        />
      </div>
    )
  }
}
