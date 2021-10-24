### 前言
因为使用[electron-vue](https://github.com/SimulatedGREG/electron-vue)生成的模板依赖太旧了，作者三年没更新，本人基于导出的模板上做了依赖更新，并且添加了自动更新。可放心食用

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

---

### 本地测试，自动更新服务模板
``` js
const Koa = require("koa");
const path = require("path");
const app = new Koa();
const route = require("koa-route");
const serve = require("koa-static");

// 1.主页静态网页 把静态页统一放到public中管理
app.use(serve(path.join(__dirname)));

app.use(
  route.get("/", (ctx) => {
    ctx.response.body = "Hello World";
  })
);

app.listen(8080);
console.log("listen to http://localhost:8080");

```