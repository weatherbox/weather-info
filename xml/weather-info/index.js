const rp = require('request-promise');
const xml2js = require('xml2js');

const {PubSub} = require('@google-cloud/pubsub');
const {Storage} = require('@google-cloud/storage');
const bucketName = 'weather-info';

const Datastore = require('@google-cloud/datastore');
const projectId = 'weatherbox-217409';
const datastore = new Datastore({ projectId });


exports.handler = async (event, context) => {
  const pubsubMessage = event.data;
  const message = JSON.parse(Buffer.from(pubsubMessage, 'base64').toString());
  console.log(message);

  await process(message.url);
};


async function process(url) {
  const xmldata = await rp(url);
  const xml = await parseXML(xmldata);
  
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

  // area/code
  data.area = titles[1].replace("気象情報", "");
  data.code = getCode(data.area, data.type); 

  var typeCode = {
    '全般気象情報': 0,
    '地方気象情報': 1,
    '府県気象情報': 2
  };
  data.publisher = data.eventID.substr(0, 4) + typeCode[data.type];

  console.log(data);
  await uploadPublic("d/" + data.id + ".json", data).catch(console.error);
  await saveDatastore(data.id, data);
}

function getCode(area, type) {
  if (type == "全般気象情報") {
    return "010000";
  } else if (type == "地方気象情報") {
    return regions[area];
  } else if (area in prefs) {
    return prefs[area];
  } else if (area.includes("東京都")) {
    return "130100"; // 伊豆諸島、小笠原諸島
  }
}

function parseXML(data) {
  return new Promise(function (resolve, reject) {
    const parser = new xml2js.Parser();
    parser.parseString(data, (err, xml) => {
      if (err) reject(err);
      resolve(xml);
    });
  });
}


async function uploadPublic(filename, data) {
  const storage = new Storage();
  const file = await storage.bucket(bucketName).file(filename);
  await file.save(JSON.stringify(data), {
    contentType: 'application/json',
    gzip: true,
    matadata: {
      cacheControl: 'public, max-age=3600',
    }
  });
  await file.makePublic();
}

async function saveDatastore(id, data) {
  const entity = {
    key: datastore.key(['jma-xml-weather-information', id]),
    data: [
      {
        name: 'datetime',
        value: new Date(data.datetime),
        excludeFromIndexes: false,
      },
      {
        name: 'code',
        value: data.code,
        excludeFromIndexes: true,
      },
      {
        name: 'type',
        value: data.type,
        excludeFromIndexes: true,
      },
      {
        name: 'publisher',
        value: data.publisher,
        excludeFromIndexes: false,
      },
      {
        name: 'title',
        value: data.title,
        excludeFromIndexes: true,
      },
      {
        name: 'headline',
        value: data.headline,
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
  const pubsub = new PubSub({projectId});
  const publisher = pubsub.topic(topicName).publisher();

  await publisher.publish(Buffer.from(JSON.stringify(data)));
  console.log("published: " + topicName);
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
  "九州南部・奄美地方": "011000", // xxx
  "沖縄地方": "011100",
};

// AreaForecastLocalM
var prefs = {
  "宗谷地方": "011000",
  "上川・留萌地方": "012000",
  "網走・北見・紋別地方": "013000",
  "釧路・根室・十勝地方": "014000", // ?
  "釧路・根室地方": "014100",
  "十勝地方": "014030",
  "胆振・日高地方": "015000",
  "石狩・空知・後志地方": "016000",
  "渡島・檜山地方": "017000",
  "青森県": "020000",
  "岩手県": "030000",
  "宮城県": "040000",
  "秋田県": "050000",
  "山形県": "060000",
  "福島県": "070000",
  "茨城県": "080000",
  "栃木県": "090000",
  "群馬県": "100000",
  "埼玉県": "110000",
  "千葉県": "120000",
  "東京都": "130000",
  "東京都（伊豆諸島）": "130100",  //
  "神奈川県": "140000",
  "新潟県": "150000",
  "富山県": "160000",
  "石川県": "170000",
  "福井県": "180000",
  "山梨県": "190000",
  "長野県": "200000",
  "岐阜県": "210000",
  "静岡県": "220000",
  "愛知県": "230000",
  "三重県": "240000",
  "滋賀県": "250000",
  "京都府": "260000",
  "大阪府": "270000",
  "兵庫県": "280000",
  "奈良県": "290000",
  "和歌山県": "300000",
  "鳥取県": "310000",
  "島根県": "320000",
  "岡山県": "330000",
  "広島県": "340000",
  "山口県": "350000",
  "徳島県": "360000",
  "香川県": "370000",
  "愛媛県": "380000",
  "高知県": "390000",
  "福岡県": "400000",
  "佐賀県": "410000",
  "長崎県": "420000",
  "熊本県": "430000",
  "大分県": "440000",
  "宮崎県": "450000",
  "鹿児島県（奄美地方を除く）": "460100",
  "奄美地方（鹿児島県）": "460040",
  "沖縄本島地方": "471000",
  "大東島地方": "472000",
  "宮古島地方": "473000",
  "八重山地方": "474000",
};


