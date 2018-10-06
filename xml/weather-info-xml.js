var request = require('request');
var xml2js = require('xml2js');

request('http://www.data.jma.go.jp/developer/xml/data/bd6e165f-d3ac-3b1f-a919-d2f9491e9f19.xml', (err, res, body) => {
  parse(body);
});

function parse(data){
  var parser = new xml2js.Parser();
  
  parser.parseString(data, (err, xml) => {
    console.log(JSON.stringify(xml, null, 2));
    if (xml.Report.Control[0].Status[0] != '通常') return;

    var type = xml.Report.Control[0].Title[0];
    var office = xml.Report.Control[0].PublishingOffice[0];
    var title = xml.Report.Head[0].Title[0];
    var datetime = xml.Report.Head[0].ReportDateTime[0];
    var headline = xml.Report.Head[0].Headline[0].Text[0];
    var comment = xml.Report.Body[0].Comment[0].Text[0]._;

    console.log(type, office, title, datetime, headline, comment);
  });
}


