const Datastore = require('@google-cloud/datastore');
const projectId = 'weatherbox-217409';
const datastore = new Datastore({ projectId });
const lastIdKey = datastore.key(['jma-xml-last-update', 'last-id']);

const request = require('request');
const xml2js = require('xml2js');
const atomFeed = 'http://www.data.jma.go.jp/developer/xml/feed/extra.xml';

update();


async function update() {
  const transaction = datastore.transaction();

  transaction
    .run()
    .then(() => transaction.get(lastIdKey))
    .then(res => {
      console.log(res);
      const last = res[0];
      const lastId = last.lastId;

      last.lastId = checkUpdated(lastId);
      transaction.save({
        key: lastIdKey,
        data: last
      });
      return transaction.commit();
    });
}

async function checkUpdated(lastId) { 
  request(atomFeed, (err, res, body) => {
    var parser = new xml2js.Parser();
    parser.parseString(body, (err, feed) => {
      console.log(JSON.stringify(feed, null, 2));

      for (var entry of feed.feed.entry){
        const id = entry.id[0];
        const title = entry.title[0];
        const xml = entry.link[0].$.href;
        console.log(id, title, xml);

        dispatch(title, xml);
      }
    });

    return 'sss';
  });
}

function dispatch(title, xml) {

}

