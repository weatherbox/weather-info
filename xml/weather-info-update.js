const {Storage} = require('@google-cloud/storage');
const bucketName = 'weather-info';
const AllJson = 'weather-info-all.json';

const Datastore = require('@google-cloud/datastore');
const projectId = 'weatherbox-217409';
const datastore = new Datastore({ projectId });


exports.handler = (event, context) => {

};

query();



async function query() {
  const from = new Date(Date.now() - 72 * 3600 * 1000);
  const query = datastore
    .createQuery('jma-xml-weather-info')
    .filter('datetime', '>', from)
    .order('datetime');
  const [infos] = await datastore.runQuery(query);
  console.log(from, infos.length);

  makeAllJson(infos);
}


async function makeAllJson(infos) {
  const from = new Date(Date.now() - 72 * 3600 * 1000);
  const alljson = {
    general: null,
    regions: {},
    prefs: {},
    lastUpdated: null
  };

  infos.forEach(d => {
    const id = d[datastore.KEY].name;
    const code = d.code;
    const data = { id, datetime: d.datetime, title: d.title, headline: d.headline };

    if (new Date(data.datetime) < from) return;

    if (/全般気象情報/.test(data.title)) {
      alljson.general = data;

    } else if (/地方/.test(data.title)) {
      alljson.regions[code] = data;

    } else {
      alljson.prefs[code] = data;
    }

    alljson.lastUpdated = d.datetime;
  });

  console.log(alljson);
  uploadPublic(AllJson, alljson);
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


