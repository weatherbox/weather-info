const { Storage } = require('@google-cloud/storage');
const bucketName = 'weather-info';

const { Datastore }= require('@google-cloud/datastore');
const projectId = 'weatherbox-217409';
const datastore = new Datastore({ projectId });

const { PubSub } = require('@google-cloud/pubsub');

const fetch = require('node-fetch');
const pdf = require('pdf-parse');
const HTMLParser = require('node-html-parser');
const path = require('path');
const moment = require('moment');

if (require.main === module) {
  //scrape(process.argv[2]); // 330
  scrape("318", "2020-04-13T11:34:00.000", { eventID: "JPTE200008", code: "120000", publisher: 'JPTE2', type: '府県気象情報' });
  //parsePDF(process.argv[2]);
}

// info { eventID, code, type, publisher }
async function scrape(code, from, info) {
  const url = `https://www.jma.go.jp/jp/kishojoho/${code}_index.html`;
  const res = await fetch(url);
  const html = await res.text();
  const root = HTMLParser.parse(html);

  const table = root.querySelectorAll('.infotable1 tr');
  table.forEach(tr => {
    const a = tr.querySelector('.infotable4 a');
    if (a) {
      const link = a.getAttribute('href');
      const title = a.innerHTML;
      console.log(link, title);

      const match = link.match(/javascript:pdfOpen\('\.\/(.*?)'\)/);
      if (match) {
        const pdfurl = 'http://www.jma.go.jp/jp/kishojoho/' + match[1];

        const datetime_str = path.basename(pdfurl).substr(12, 12);
        const datetime = moment(datetime_str, 'YYYYMMDDHHmm');
        if (from && datetime <= new Date(from)) return;

        parsePDF(pdfurl, info);
      }
    }
  });
}


async function parsePDF(url, info) {
  const res = await fetch(url);
  const content = await res.buffer();

  const basename = path.basename(url);
  const filename = 'pdf/' + basename;
  await uploadPublic(filename, content);

  const datetime_str = basename.substr(12, 12);
  const datetime = moment(datetime_str, 'YYYYMMDDHHmm');
  const publisher = basename.substr(7, 4);

  try {
    const data = await pdf(content);
    const text = parsePDFText(data.text);
    text.datetime = datetime;
    console.log(text);
    if (info) saveDatastore(text, basename, info);

  } catch (e) {
    console.warn(e);
  }
}

function parsePDFText(text) {
  const contents = text.split('\n \n');
  const match = contents[0].replace(/\n/g, '').match(/(.*気象情報) 第(.*?)号/);
  const title = match[1];
  const serial = parseInt(hankaku(match[2]));
  const headline = contents[1].replace(/\n/g, '');
  const comment = contents[2].replace(/\n/g, '');
  return { title, serial, headline, comment };
}

async function uploadPublic(filename, data) {
  const storage = new Storage();
  const file = await storage.bucket(bucketName).file(filename);
  file.save(data, {
    contentType: 'application/pdf',
    matadata: {
      cacheControl: 'no-cache'
    }
  }, function (err) { 
    if (err) console.error(err);
    file.makePublic();
  });
}

async function saveDatastore(text, pdf, info) {
  const id = info.eventID + ('000' + text.serial).slice(-3);
  console.log(id, new Date(text.datetime), info);
  const entity = {
    key: datastore.key(['jma-xml-weather-information', id]),
    data: [
      {
        name: 'datetime',
        value: new Date(text.datetime),
        excludeFromIndexes: false,
      },
      {
        name: 'code',
        value: info.code,
        excludeFromIndexes: true,
      },
      {
        name: 'type',
        value: info.type,
        excludeFromIndexes: true,
      },
      {
        name: 'publisher',
        value: info.publisher,
        excludeFromIndexes: false,
      },
      {
        name: 'title',
        value: text.title,
        excludeFromIndexes: true,
      },
      {
        name: 'headline',
        value: text.headline,
        excludeFromIndexes: true,
      },
      {
        name: 'pdf',
        value: pdf,
        excludeFromIndexes: true,
      }
    ]
  };

  try {
    await datastore.save(entity);
    await publishUpdate({ id });

  } catch (err) {
    console.error('ERROR:', err);
  }
}


async function publishUpdate(data) {
  const topicName = 'jma-xml-weather-info-update';
  const pubsub = new PubSub({ projectId });

  const dataBuffer = Buffer.from(JSON.stringify(data));
  const messageId = await pubsub.topic(topicName).publish(dataBuffer);
  console.log(`Message ${messageId} published.`);
}



function hankaku(str) {
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}
