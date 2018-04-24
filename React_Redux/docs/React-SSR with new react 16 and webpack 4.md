> 本文的demo仓库在https://github.com/qiqingjin/blog/tree/master/React_Redux/demos，喜欢请star哟~

# 基本思想
简单来说，我要做的事情就是，写一套react页面，服务器端和浏览器端都可以把它们转换成html页面。当用户请求某些页面时，例如：首页，先进行服务器端渲染，然后返回html页面。浏览器会把服务器端html与浏览器端渲染的html页面对比，**并尽量复用**服务器端返回的html，展示到浏览器上。注意，React 16不再使用checksum进行严格校验。

# 面临的问题
1. 服务器端渲染不会执行ajax请求，如何进行数据请求
2. 不同的路由，在浏览器端会请求不同的数据，如何在服务器端根据路由来进行数据处理

## 数据请求
`react-dom/server`提供了一个`renderToString`方法，可以把react的虚拟dom，也就是react component的类，转换成html。我们只要在调用这个方法之前，提前执行需要在浏览器端执行的请求就好，看代码：
```js
// demos/server/server.js
const {data: todosData} = await axios.get('http://localhost:667/rest/todos');
```

然后需要获取react组件，我这里使用`koa`,`node`端不支持`import`等方法，需要用`webpack`把react组件编译，注意，服务器端编译的config配置和浏览器端编译的config略有不同，请看`demos/client/webpack.config.js`和`demos/client/webpack.config.ssr.js`。获取react组件的代码：
```js
// demos/server/server.js
const indexBundle = require('./dist/main.ssr');
const indexApp = indexBundle.__esModule ? indexBundle.default : indexBundle;
```

获取react组件后，需要把数据注入到redux的`createStore`方法中，再传给react组件，保证react组件中的`store`有`dispatch`等方法。
```js
// demos/server/server.js
const store = indexApp.createStore(initData);
const instance = indexApp.createApp(store);
const todosStr = ReactDOMServer.renderToString(instance);
```

最后，需要把数据放到`window`对象上，让浏览器端用来渲染浏览器端html，然后与服务器端html对比，尽量复用。
```js
// demos/server/server.js
const syncScript = `<script id="server-data">window._SERVER_DATA=${JSON.stringify(initData)}</script>`;
const $ = await loadHTMLTemplate(path.resolve(__dirname, '../client/dist/index.html'));
$('#app').html(todosStr);
$('head').append(syncScript);
```

## 路由处理
这个地方目前我看到的处理方法有：
1. 使用`react-router`的`match`方法，这个方案比较常见
2. 把页面分成多个`thunk`，并绑定到客户的的路由文件中，在`renderToString`之前`dispatch`这些异步方法，从而将数据更新到redux的store中，[请参考](https://juejin.im/post/5a0536346fb9a044fe45d33a)

这里我并没有写在我的代码中，如果你想尝试，可以`clone`我的仓库，自己进行优化。