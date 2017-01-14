/* jshint esversion: 6 */
const request = require('sync-request');
const weatherApiUrl = "http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=109";
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const weatherFilter = function(payload) {
    if (payload.pureText.includes("weather") || payload.pureText.includes("날씨")) {
        const res = request('GET', weatherApiUrl);
        const xml = res.body.toString('utf-8');
        // var data = parser.parseStringSync(xml);
        // console.log(data);
        let ret = "```";
        parser.parseString(xml, function(err, result) {
          let i;
            const locations = result.rss.channel[0].item[0].description[0].body[0].location;
          let selectedLocation;
          for (i in locations) {
            const location = locations[i];
            if(location.city == '서울') {
              selectedLocation = location;
              break;
            }
          }

          for (i in selectedLocation.data) {
            const unit = selectedLocation.data[i];
            ret += convertApiModel2String(unit);
          }
        });
        ret += "```";
        return ret;
    } else {
        return null;
    }
};
let dup = {};

function convertApiModel2String(unit) {
  let ret = "";
  const dateObj = new Date(unit.tmEf);
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  if(!dup[month + ":" + date]) {
    ret = month + "월 " + date + "일 ";
    ret += ": ";
    ret += unit.tmn + " / " + unit.tmx + " / " + unit.wf + "\n";
    dup[month + ":" + date] = true;
  }
  return ret;
}

module.exports = weatherFilter;
