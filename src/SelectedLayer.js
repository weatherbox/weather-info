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
    const key = type === 'region' ? 'code' : type + 'Code';
    this.map.addLayer({
      "id": type + "-line-selected",
      "type": "line",
      "source": type + "-vt",
      "source-layer": type === 'region' ? type : type + 'allgeojson',
      "paint": {
        "line-color": "rgba(70, 171, 199, 0.8)",
        "line-width": 1
      },
      filter: ["==", key, "0"]
    });
  }

  onClick(e) {
    if (e.features) {
      console.log(e.features[0].properties);
      const code = this.getCode(e.features[0].properties.prefCode);
      const prefName = e.features[0].properties.prefName;
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
      const key = l === 'region' ? 'code' : type + 'Code';
      const filter = l === type ? codes : ['0'];
      this.map.setFilter(l + '-line-selected', ['in', key, ...filter]);
    });
  }
}
