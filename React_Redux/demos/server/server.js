const Koa = require('koa');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const serve = require('koa-static-server');
const Router = require('koa-router');
const axios = require('axios');

const readFileAsync = Promise.promisify(fs.readFile);
const app = new Koa();
const router = new Router();

const React = require('react');
const ReactDOMServer = require('react-dom/server');

async function loadHTMLTemplate(path){
  try{
    const content = await readFileAsync(path);
    return cheerio.load(content);
  }catch(e){
    console.error('server error: ', e);
    return false;
  }
}

app.use(serve({rootDir: path.resolve(__dirname, '../client/dist/')}));

router.get('/todos', async(ctx, next) => {
  const $ = await loadHTMLTemplate(path.resolve(__dirname, '../client/dist/index.html'));

  if(!$){
    ctx.body = null;
    await next();
    return;
  }

  const indexBundle = require('./dist/index.ssr');
  const todosData = await axios.get('http://localhost:667/rest/todos');
  const initData = {
    todos: todosData
  };
  const syncScript = `<script id="server-data">window._SERVER_DATA=${JSON.stringify(initData)}</script>`;
  const instance = React.createElement(indexBundle.default, initData);
  const todosStr = ReactDOMServer.renderToString(instance);

  $('#app').html(todosStr);
  $('head').append(syncScript);

  ctx.body = $.html();
  await next();
});
router.get('/rest/todos', async(ctx, next) => {
  ctx.body = [{
    id: 0,
    text: 'todo1',
    complete: true
  }, {
    id: 1,
    text: 'todo2',
    complete: false
  }];

  await next();
})

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(667, () => {
  console.log('server is running...');
});
