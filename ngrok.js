const ngrok = require('ngrok');

(async function () {
  const url = await ngrok.connect({ addr: 3333, host_header: 'rewrite' });
  console.log(url);
  return;
})();
