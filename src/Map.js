import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoidGF0dGlpIiwiYSI6ImNqZWZ4eWM3NTI2cGszM2xpYXEyZndpd3IifQ.ifzbR45HecVGxChbdR2hiw';

export default class Map extends Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/tattii/cj3jrmgsp002i2rt50tobxo27',
      zoom: 5,
      center: [136.6, 35.5],
      hash: true
    });
  }


  render() {
    return (
      <div ref={el => this.mapContainer = el} id="map" />
    );
  }
}
