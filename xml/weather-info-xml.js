const request = require('request');
const xml2js = require('xml2js');

const {PubSub} = require('@google-cloud/pubsub');
const {Storage} = require('@google-cloud/storage');
const bucketName = 'weather-info';

const Datastore = require('@google-cloud/datastore');
const projectId = 'weatherbox-217409';
const datastore = new Datastore({ projectId });


exports.handler = (event, context) => {
  const pubsubMessage = event.data;
  const message = JSON.parse(Buffer.from(pubsubMessage, 'base64').toString());
  console.log(message);

  request(message.url, (err, res, body) => {
    parse(body, message.url);
  });
};


async function parse(data, url) {
  var parser = new xml2js.Parser();
  
  parser.parseString(data, (err, xml) => {
    //console.log(JSON.stringify(xml, null, 2));
    if (xml.Report.Control[0].Status[0] != '通常') return;

    var data = {};
    data.type     = xml.Report.Control[0].Title[0];
    data.office   = xml.Report.Control[0].PublishingOffice[0];
    data.title    = xml.Report.Head[0].Title[0];
    data.datetime = xml.Report.Head[0].ReportDateTime[0];
    data.eventID  = xml.Report.Head[0].EventID[0];
    data.serial   = xml.Report.Head[0].Serial[0];
    data.headline = xml.Report.Head[0].Headline[0].Text[0];
    data.comment  = xml.Report.Body[0].Comment[0].Text[0]._;

    // ID
    data.id = data.eventID + ('000' + data.serial).slice(-3);
    data.url = url;

    // analyze
    var titles = data.title.split("に関する");
    data.weatherTypes = titles[0].split(/と|及び/);
    data.area = titles[1].replace("気象情報", "");

    var typeCode = {
      '全般気象情報': 0,
      '地方気象情報': 1,
      '府県気象情報': 2
    };
    data.code = data.eventID.substr(0, 4) + typeCode[data.type];

    console.log(data);
    uploadPublic("d/" + data.id + ".json", data);
    saveDatastore(data.id, data.datetime, data.code, data.title, data.headline);
  });
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
    if (err) return console.error(err);
    file.makePublic();
  });
}

async function saveDatastore(id, datetime, code, title, headline) {
  const entity = {
    key: datastore.key(['jma-xml-weather-information', id]),
    data: [
      {
        name: 'datetime',
        value: new Date(datetime),
        excludeFromIndexes: false,
      },
      {
        name: 'code',
        value: code,
        excludeFromIndexes: false,
      },
      {
        name: 'title',
        value: title,
        excludeFromIndexes: true,
      },
      {
        name: 'headline',
        value: headline,
        excludeFromIndexes: true,
      }
    ]
  };

  try {
    await datastore.save(entity);
    publishUpdate({ id });

  } catch (err) {
    console.error('ERROR:', err);
  }
}


function publishUpdate(data) {
  const topicName = 'jma-xml-weather-info-update';
  const pubsub = new PubSub({projectId});
  const publisher = pubsub.topic(topicName).publisher();

  publisher.publish(Buffer.from(JSON.stringify(data)), (err) => {
    if (err) {
      console.error('ERROR:', err);
    } else {
      console.log("published: " + topicName);
    }
  });
}

