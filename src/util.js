
export function reportTime(t) {
    var date = pad(t.getMonth() + 1) + '/' + pad(t.getDate());
    var time = pad(t.getHours()) + ':' + pad(t.getMinutes());
    return date + ' ' + time;
}

function pad(x) {
  return ('0' + x).slice(-2);
}

export function hankaku(str) {
  return str.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }).replace(/．/g, '.');
}
