import { hokkaidoPrefCodes, izuOgasawara } from './code';

export default class SelectedLayer {
  constructor(map, onSelected) {
    this.map = map;
    this.onSelected = onSelected;

    this.addSelectedLayer();
    this.map.on('click', 'weather-info-pref', (e) => {
      this.onClick(e);
    });
    this.map.on('click', 'weather-info-tokyo', (e) => {
      this.onClickTokyo(e);
    });
  }

  addSelectedLayer() {
    this._addSelectedLayer('pref');
    this._addSelectedLayer('distlict');
    this._addSelectedLayer('region');
  }
  
  _addSelectedLayer(type) {
    this.map.addLayer({
      "id": type + "-line-selected",
      "type": "line",
      "source": type === "region" ? "region-vt" : "vt",
      "source-layer": type,
      "paint": {
        "line-color": "rgba(70, 171, 199, 0.8)",
        "line-width": 1
      },
      filter: ["==", "code", "0"]
    });
  }

  onClick(e) {
    if (e.features) {
      console.log(e.features[0].properties);
      const code = this.getCode(e.features[0].properties.code);
      const prefName = e.features[0].properties.name;
      this.selectPref(code);
      this.onSelected(code, prefName);
    }
  }

  onClickTokyo(e) {
    if (e.features) {
      console.log(e.features[0].properties);
      const prefName = '伊豆・小笠原諸島';
      this.select('distlict', izuOgasawara);
      this.onSelected('130100', prefName);
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

  selectPref(code) {
    let filter = [code];
    if (code in hokkaidoPrefCodes){
      filter = hokkaidoPrefCodes[code];
    }
    this.select('pref', filter);
  }

  selectRegion(code) {
    this.select('region', [code]);
  }
  
  select(type, codes) {
    ['pref', 'distlict', 'region'].forEach(l => {
      const filter = l === type ? codes : ['0'];
      this.map.setFilter(l + '-line-selected', ['in', 'code', ...filter]);
    });
  }
}
