const Datastore = require('@google-cloud/datastore');
const projectId = 'weatherbox-217409';
const datastore = new Datastore({ projectId });
const lastIdKey = datastore.key(['jma-xml-last-update', 'last-id']);

const request = require('request');
const xml2js = require('xml2js');
const atomFeed = 'http://www.data.jma.go.jp/developer/xml/feed/extra.xml';

update();


function update() {
  const transaction = datastore.transaction();

  transaction
    .run()
    .then(() => transaction.get(lastIdKey))
    .then(res => {
      console.log(res);
      const last = res[0];
      const lastId = last.lastId;

      checkUpdated(lastId, function(updatedLastId) {
        console.log('updated: ' + updatedLastId);
        last.lastId = updatedLastId;
        transaction.save({
          key: lastIdKey,
          data: last
        });
        return transaction.commit();
      });
    });
}

function checkUpdated(lastId, done) { 
  request(atomFeed, (err, res, body) => {
    var parser = new xml2js.Parser();
    parser.parseString(body, (err, feed) => {
      let count = 0;

      for (var entry of feed.feed.entry){
        const id = entry.id[0];
        const title = entry.title[0];
        const xml = entry.link[0].$.href;
        if (id == lastId) break;

        dispatch(id, title, xml);
        count++;
      }
    
      console.log('updated ' + count + ' xmls');
      done(feed.feed.entry[0].id[0]);
    });

  });
}


const topics = {
  '全般気象情報': 'weather-info',
  '地方気象情報': 'weather-info',
  '府県気象情報': 'weather-info',
};

function dispatch(id, title, xml) {
  console.log(id, title, xml);
  if (title in topics) {
    const topic = topics[title];
    console.log('->', topic);
  }
}

