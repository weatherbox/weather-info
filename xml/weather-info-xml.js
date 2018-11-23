var request = require('request');
var xml2js = require('xml2js');

var url = process.argv[2];
request(url, (err, res, body) => {
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

    // analyze
    var titles = title.split("に関する");
    var weather_type = titles[0];
    var area = titles[1].replace("気象情報", "");
    var code = (area == "全般") ? "010000" : codes[area];

    console.log(type, office, title, datetime, headline, comment);
    console.log(weather_type, area, code);
  });
}


var codes = {
  // region
  "北海道地方": "010100",
  "東北地方": "010200",
  "関東甲信地方": "010300",
  "北陸地方": "010500",
  "東海地方": "010400",
  "近畿地方": "010600",
  "中国地方": "010700",
  "四国地方": "010800",
  "九州北部地方（山口県を含む）": "010900",
  "九州南部・奄美地方": "011000",
  "沖縄地方": "011100",

   // pref
  "宗谷地方": "011000",
  "上川・留萌地方": "012000",
  "網走・北見・紋別地方": "013000",
  "釧路・根室・十勝地方": "014000",
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
  "鹿児島県（奄美地方除く）": "460100",
  "奄美地方": "460040",
  "沖縄本島地方": "471000",
  "大東島地方": "472000",
  "宮古島地方": "473000",
  "八重山地方": "474000",
};


