const {Storage} = require('@google-cloud/storage');
const bucketName = 'weather-info';
const AllJson = 'weather-info-all.json';

const Datastore = require('@google-cloud/datastore');
const projectId = 'weatherbox-217409';
const datastore = new Datastore({ projectId });


exports.handler = (event, context) => {
  query();
};

if (require.main === module) {
  query();
}



async function query() {
  const from = new Date(Date.now() - 48 * 3600 * 1000);
  const query = datastore
    .createQuery('jma-xml-weather-information')
    .filter('datetime', '>', from)
    .order('datetime');
  const [infos] = await datastore.runQuery(query);
  console.log(from, infos.length);

  makeAllJson(infos);
}


async function makeAllJson(infos) {
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

    if (d.type == '全般気象情報') {
      alljson.general = data;

    } else if (d.type == '地方気象情報') {
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

