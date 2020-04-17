const { WebClient } = require('@slack/web-api');
const moment = require('moment');

async function post(content, title, url, datetime) {
  const slack = new WebClient(process.env.SLACK_TOKEN);

  const result = await slack.files.upload({
    title,
    file: content,
    filetype: 'pdf',
    channels: '#weather-info'
  });
  console.log('File uploaded: ', result.file.id);

  const text = title + ' ' + moment(datetime).format('YYYY/MM/DD HH:mm') + '\n' + url;
  await slack.chat.postMessage({
    text,
    channel: '#weather-info',
  });
}

module.exports.post = post;
