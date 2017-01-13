/* jshint esversion: 6 */
const request = require('sync-request');
const weatherApiUrl = "http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=109";
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const weatherFilter = function(payload) {
    if (payload.pureText.includes("weather") || payload.pureText.includes("날씨")) {
        var res = request('GET', weatherApiUrl);
        var xml = res.body.toString('utf-8');
        // var data = parser.parseStringSync(xml);
        // console.log(data);
        var ret = "```";
        parser.parseString(xml, function(err, result) {
          var locations = result.rss.channel[0].item[0].description[0].body[0].location;
          var selectedLocation;
          for (var i in locations) {
            var location = locations[i];
            if(location.city == '서울') {
              selectedLocation = location;
              break;
            }
          }

          for (var i in selectedLocation.data) {
            var unit = selectedLocation.data[i];
            ret += convertApiModel2String(unit);
          }
        });
        ret += "```";
        return ret;
    } else {
        return null;
    }
};
var dup = {};

function convertApiModel2String(unit) {
  var ret = "";
  var dateObj = new Date(unit.tmEf);
  var month = dateObj.getMonth()+1;
  var date = dateObj.getDate();
  if(!dup[month + ":" + date]) {
    ret = month + "월 " + date + "일 ";
    ret += ": ";
    ret += unit.tmn + " / " + unit.tmx + " / " + unit.wf + "\n";
    dup[month + ":" + date] = true;
  }
  return ret;
}

module.exports = weatherFilter;
