const weatherInfoXML = require('./index');

// from command line
if (process.argv.length > 2){
  var url = process.argv[2];
  var data = { url };
  var buffer = new Buffer(JSON.stringify(data));
  var message = buffer.toString('base64');
  weatherInfoXML.handler({ data: message }, null);
}


