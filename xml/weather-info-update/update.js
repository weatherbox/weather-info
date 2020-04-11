const {Storage} = require('@google-cloud/storage');
const bucketName = 'weather-info';
const AllJson = 'weather-info-all-1.json';

const Datastore = require('@google-cloud/datastore');
const projectId = 'weatherbox-217409';
const datastore = new Datastore({ projectId });


exports.handler = (event, context) => {

};

query();



async function query() {
  const from = new Date(Date.now() - 48 * 3600 * 1000);
  const query = datastore
    .createQuery('jma-xml-weather-information')
    .filter('datetime', '>', from)
    .order('datetime');
  const [infos] = await datastore.runQuery(query);
  console.log(from, infos.length);

  makeAllJson(infos, from);
}


async function makeAllJson(infos, from) {
  console.log(infos)
  const alljson = {
    general: null,
    regions: {},
    prefs: {},
    lastUpdated: null
  };

  infos.forEach(d => {
    const id = d[datastore.KEY].name;
    const code = d.code;
    const data = { id, datetime: d.datetime, title: d.title, headline: d.headline, count: 1 };

    const area = data.title.match("関する(.*?)気象情報");
    if (/全般気象情報/.test(data.title)) {
      alljson.general = data;

    } else if (area && area[1] in regions) {
      updateDataCount(alljson.regions, code, data);

    } else {
      updateDataCount(alljson.prefs, code, data);
    }

    alljson.lastUpdated = d.datetime;
  });

  console.log(alljson);
  uploadPublic(AllJson, alljson);
}

function updateDataCount(list, key, data) {
  if (list[key]) {
    data.count = list[key].count + 1;
  }
  list[key] = data;
}


async function uploadPublic(filename, data) {
  const storage = new Storage();
  const file = await storage.bucket(bucketName).file(filename);
  file.save(JSON.stringify(data), {
    contentType: 'application/json',
    gzip: true,
    matadata: {
      cacheControl: 'no-cache'
    }
  }, function (err) { 
    if (err) console.error(err);
    file.makePublic();
  });
}


var regions = {
  "北海道地方": "010100",
  "東北地方": "010200",
  "関東甲信地方": "010300",
  "北陸地方": "010500",
  "東海地方": "010400",
  "近畿地方": "010600",
  "中国地方": "010700",
  "四国地方": "010800",
  "九州北部地方（山口県を含む）": "010900",
  "九州南部・奄美地方": "011000",
  "沖縄地方": "011100",
};
