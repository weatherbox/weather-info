import mapboxgl from 'mapbox-gl';
import SelectedLayer from './SelectedLayer';
import { hokkaidoPrefCodes, izuOgasawara } from './code';


export default class WeatherInfoLayer {
  constructor(map, data, period, onSelected) {
    this.map = map;
    this.weatherInfo = data;
    this.period = period;

    this.map.addSource("vt", {
      "type": "vector",
      "minzoom": 0,
      "maxzoom": 10,
      "tiles": ["https://weatherbox.github.io/warning-area-vt/v2/{z}/{x}/{y}.pbf"]
    });

    this.map.addLayer({
      "id": "pref-line",
      "type": "line",
      "source": "vt",
      "source-layer": "pref",
      "paint": {
        "line-color": "rgba(55, 55, 55, 0.4)"
      }
    });
    this.renderWeatherInfoPrefs();
 
    this.addRegion();
    this.selectedLayer =  new SelectedLayer(map, onSelected);

    this.popup = new mapboxgl.Popup({
      closeButton: false
	  });
    this.map.on('mousemove', this.hover);
  }

  selectRegion(code) {
    this.selectedLayer.selectRegion(code);
  }

  addRegion() {
    this.map.addSource("region-vt", {
      "type": "vector",
      "minzoom": 0,
      "maxzoom": 8,
      "tiles": ["https://weatherbox.github.io/warning-area-vt/region/{z}/{x}/{y}.pbf"]
    });
  }


  renderWeatherInfoPrefs() {
    const now = Date.now();
    var stops = [];
    let tokyo;

    for (let code in this.weatherInfo.prefs){
      const pref = this.weatherInfo.prefs[code];
      const time = new Date(pref[0].datetime);

      if ((now - time) <= this.period * 3600 * 1000){
        if (code in hokkaidoPrefCodes){
          for (let c of hokkaidoPrefCodes[code]){
            stops.push([c, this.getColor(pref.length)]);
          }

        } else if (code === '130100') {
          tokyo = this.getColor(pref.length);

        } else {
          stops.push([code, this.getColor(pref.length)]);
        }
      }
    }

    this.map.addLayer({
      "id": "weather-info-pref",
      "type": "fill",
      "source": "vt",
      "source-layer": "pref",
      "paint": {
        "fill-color": {
          "property": "code",
          "type": "categorical",
          "stops": stops,
          "default": "rgba(0, 0, 0, 0)"
        },
      }
    });
    this.renderTokyo(tokyo);
  }

  renderTokyo(color = 'rgba(0, 0, 0, 0)') {
    this.map.addLayer({
      "id": "weather-info-tokyo",
      "type": "fill",
      "source": "vt",
      "source-layer": "distlict",
      "paint": {
        "fill-color": color,
      },
      "filter": ["in", "code"].concat(izuOgasawara)
    });
  }

  getColor(count) {
    const opacity = Math.min(0.1 + 0.05 * count, 0.8);
    return `rgba(70, 171, 199, ${opacity})`;
  }

  hover = (e) => {
    const features = this.map.queryRenderedFeatures(e.point, { layers: ['weather-info-pref', 'weather-info-tokyo'] });
    this.map.getCanvas().style.cursor = (features.length) ? 'crosshair' : '';

    let html;
    if (features.length) {
      const code = this.getCode(features[0].properties.code);
      const infos = this.weatherInfo.prefs[code];
      if (infos) {
        const title = infos[0].title.split('に関する')[0];
        html = title + '<br/><span>' + this.getTimeBefore(infos[0]) + '</span>';
      }
    }
    
    if (html) {
      this.popup.setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(this.map);
    } else {
			this.popup.remove();
		}
  }
  
  getCode(prefCode) {
    if (prefCode.substr(0, 2) === '01') {
      for (let code in hokkaidoPrefCodes) {
        if (hokkaidoPrefCodes[code].includes(prefCode)) return code;
      }
    } else {
      return prefCode;
    }
  }

  getTimeBefore(info) {
    const diff = Date.now() - new Date(info.datetime);
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.round(diff / 60 / 1000);
      return minutes + '分前';
    } else {
      const hours = Math.round(diff / 60 / 60 / 1000);
      return hours + '時間前';
    }
  }
}
