const {Storage} = require('@google-cloud/storage');
const bucketName = 'weather-info';

const Datastore = require('@google-cloud/datastore');
const projectId = 'weatherbox-217409';
const datastore = new Datastore({ projectId });

const fetch = require('node-fetch');
const pdf = require('pdf-parse');
const HTMLParser = require('node-html-parser');
const path = require('path');

if (require.main === module) {
  //scrape('330');
  parsePDF(process.argv[2]);
}

async function scrape(code) {
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
        console.log(pdfurl);
      }
    }
  });
}


async function parsePDF(url) {
  const res = await fetch(url);
  const content = await res.buffer();

  const filename = 'pdf/' + path.basename(url);
  await uploadPublic(filename, content);

  try {
    const data = await pdf(content);
    console.log(data);
    parsePDFText(data.text);
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
  console.log({ title, serial, headline, comment });
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

function hankaku(str) {
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}
