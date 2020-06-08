const { Datastore }= require('@google-cloud/datastore');
const projectId = 'weatherbox-217409';
const datastore = new Datastore({ projectId });

const scrape = require('./scrape');

exports.handler = async (event, context) => {
  await check();
}

if (require.main === module) {
  check(process.argv[2], process.argv[3]);
}

async function check(hours = 3, code) {
  const query = datastore.createQuery('jma-xml-weather-information')
    .filter('datetime', '>', new Date(Date.now() - hours * 60 * 60 * 1000))
    .order('datetime');
  const [infos] = await datastore.runQuery(query);
  console.log(`${hours}h:`, infos.length);

  const updated = {};
  for (const info of infos) {
    const id = info[datastore.KEY].name;
    info.eventID = id.substr(0, 10);
    updated[info.publisher] = info;
  }
  console.log(updated);

  for (const p in updated) {
    await checkOffice(p, updated[p], code);
  }
}


async function checkOffice(publisher, info, pcode) {
  const code = officeCode[publisher.substr(0, 4)];
  if (!code) return;
  if (pcode && code !== pcode) return;
  console.log(code);
  const from = info.datetime;
  await scrape.scrape(code, from, info);
  await sleep(1000);
}

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const officeCode = {
  JPSA: '301',
  JPSC: '302',
  JPSB: '303',
  JPSD: '304',
  JPSJ: '304',
  JPSE: '305',
  JPSP: '306',
  JPSF: '307',
  JPDA: '308',
  JPDB: '309',
  JPDC: '310',
  JPDD: '311',
  JPSN: '312',
  JPDE: '313',
  JPTD: '314',
  JPTB: '315',
  JPTA: '316',
  JPTC: '317',
  JPTE: '318',
  JPTK: '319',
  JPTF: '320',
  JPTH: '321',
  JPTG: '322',
  JPNI: '323',
  JPNA: '324',
  JPNB: '325',
  JPNC: '326',
  JPGA: '327',
  JPGB: '328',
  JPBY: '329',
  JPGC: '330',
  JPOS: '331',
  JPOB: '332',
  JPOA: '333',
  JPOD: '334',
  JPOC: '335',
  JPOE: '336',
  JPHB: '337',
  JPHR: '338',
  JPHA: '339',
  JPHC: '340',
  JPMT: '341',
  JPMA: '342',
  JPMB: '343',
  JPMC: '344',
  JPFA: '345',
  JPFK: '346',
  JPFC: '347',
  JPFE: '348',
  JPFD: '349',
  JPFB: '350',
  JPKA: '351',
  JPKG: '352',
  JPKC: '352',
  JPOK: '353',
  JPWA: '354',
  JPWB: '355',
  JPWC: '356'
}
