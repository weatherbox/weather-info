export default class WeatherInfoLayer {
  constructor(map, data, period, onSelected) {
    this.map = map;
    this.weatherInfo = data;
    this.period = period;
    this.onSelected = onSelected;

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
        "line-color": "rgba(55, 55, 55, 0.4)"
      }
    });
    this.renderWeatherInfoPrefs();
    this.map.addLayer({
      "id": "pref-line-selected",
      "type": "line",
      "source": "pref-vt",
      "source-layer": "prefallgeojson",
      "paint": {
        "line-color": "rgba(70, 171, 199, 0.4)",
        "line-width": 2
      },
      filter: ["==", "prefCode", "0"]
    });
    this.addRegion();

    this.map.on('click', 'weather-info-pref', (e) => {
      this.onClick(e);
    });
  }

  addRegion() {
    this.map.addSource("region-vt", {
      "type": "vector",
      "minzoom": 0,
      "maxzoom": 8,
      "tiles": ["https://weatherbox.github.io/warning-area-vt/region/{z}/{x}/{y}.pbf"]
    });

    this.map.addLayer({
      "id": "region-line-selected",
      "type": "line",
      "source": "region-vt",
      "source-layer": "region",
      "paint": {
        "line-color": "rgba(70, 171, 199, 0.8)",
        "line-width": 1
      },
      filter: ["==", "code", "0"]
    });
  }

  renderWeatherInfoPrefs() {
    const now = Date.now();
    var stops = [];

    for (let code in this.weatherInfo.prefs){
      const pref = this.weatherInfo.prefs[code];
      const time = new Date(pref[0].datetime);

      if ((now - time) <= this.period * 3600 * 1000){
        if (code in hokkaidoPrefCodes){
          for (let c of hokkaidoPrefCodes[code]){
            stops.push([c, this.getColor(pref.length)]);
          }

        }else{
          stops.push([code, this.getColor(pref.length)]);
        }
      }
    }

    this.map.addLayer({
      "id": "weather-info-pref",
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
      }
    });
  }

  getColor(count) {
    const opacity = Math.min(0.1 + 0.05 * count, 0.8);
    return `rgba(70, 171, 199, ${opacity})`;
  }

  onClick(e) {
    if (e.features) {
      console.log(e.features[0].properties);
      const code = this.getCode(e.features[0].properties.prefCode);
      this.select(code);
      this.onSelected(code);
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

  select(code) {
    let filter = [code];
    if (code in hokkaidoPrefCodes){
      filter = hokkaidoPrefCodes[code];
    }
    this.map.setFilter('pref-line-selected', ['in', 'prefCode', ...filter]);
    this.map.setFilter('region-line-selected', ['==', 'code', '0']);
  }

  selectRegion(code) {
    this.map.setFilter('pref-line-selected', ['==', 'prefCode', '0']);
    this.map.setFilter('region-line-selected', ['==', 'code', code]);
  }
}


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
