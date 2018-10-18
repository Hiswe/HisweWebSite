parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"EHrm":[function(require,module,exports) {
module.exports={name:"hiswe-website",author:"Yannick “Hiswe” Aïvayan <yannick.aivayan@hiswe.net>",description:"hiswe's personnal website",homepage:"https://hiswe.net/",version:"4.0.1",license:"MIT",scripts:{build:"yarn assets:svg && run-p build:*","build:nuxt":"nuxt build","build:server":"parcel build server/index.js --target node","assets:svg":"gulp build:svg",bump:"gulp bump",dev:"run-p dev:*","dev:watch":"parcel watch server/index.js --target node","dev:serve":"nodemon dist/index.js","dev:mail":"maildev",start:"yarn build && run-p dev:mail serve:production","serve:production":"cross-env NODE_ENV=production node dist/index.js",toc:"doctoc README.md --github",release:"node ./bin/release.js"},repository:{type:"git",url:"git://github.com/Hiswe/hiswe-website"},engines:{node:"10.12.0"},dependencies:{"@hiswe/focus-ring":"^1.0.4","@hiswe/koa-nuxt":"^1.0.0","@sindresorhus/slugify":"^0.4.0",axios:"^0.18.0",chalk:"^2.4.1",cheerio:"^1.0.0-rc.2",consola:"^1.4.4","form-serialize":"^0.7.2","fs-extra":"^7.0.0",koa:"^2.5.3","koa-body":"^4.0.4","koa-compress":"^3.0.0","koa-helmet":"^4.0.0","koa-json":"^2.0.2","koa-logger":"^3.2.0","koa-router":"^7.4.0","koa-session":"^5.9.0",lodash:"^4.17.11","lodash.clonedeep":"^4.5.0",nodemailer:"^4.6.8",nuxt:"^2.2.0","nuxt-sass-resources-loader":"^2.0.5",pug:"^2.0.3","pug-plain-loader":"^1.0.0",rc:"~1.2.8",request:"^2.88.0","request-promise-native":"^1.0.5",shortid:"^2.2.13","source-map-support":"^0.5.9",validator:"^10.8.0","vue-axios":"^2.1.4","vue-recaptcha":"^1.1.1",xml2js:"^0.4.19"},devDependencies:{"@types/node":"^10.12.0",consolidate:"^0.15.1","cross-env":"^5.2.0",del:"^3.0.0",doctoc:"^1.3.1",gulp:"^4.0.0","gulp-bump":"^3.1.1","gulp-cached":"^1.1.1","gulp-cheerio":"^0.6.3","gulp-doctoc":"^0.1.4","gulp-if":"^2.0.2","gulp-image-resize":"~0.x.x","gulp-json-editor":"^2.4.2","gulp-load-plugins":"^1.5.0","gulp-plumber":"^1.2.0","gulp-rename":"^1.4.0","gulp-rev":"^9.0.0","gulp-sass":"^4.0.2","gulp-sourcemaps":"^2.6.4","gulp-streamify":"1.0.2","gulp-svg-symbols":"^3.2.0","gulp-svgmin":"^2.1.0","gulp-uglify":"~3.0.1","image-size":"^0.6.3",inquirer:"^6.2.0",maildev:"^1.0.0-rc3","node-sass":"^4.9.4",nodemon:"^1.18.4","npm-run-all":"^4.1.3","parcel-bundler":"^1.10.3","sass-loader":"^7.1.0",shelljs:"^0.8.2",svgo:"^1.1.1",vue:"^2.5.17",webpack:"^4.21.0",yargs:"^12.0.2"}};
},{}],"4itQ":[function(require,module,exports) {
"use strict";const e=require("rc"),o=require("../package.json"),s=e("hiswe",{email:{transport:{host:"localhost",port:1025,ignoreTLS:!0},options:{from:"Mr contact dev <contact@hiswe.pouic>"}}});s.VERSION=o.version,s.HOST=s.HOST||process.env.HOST||"127.0.0.1",s.PORT=s.PORT||process.env.PORT||3e3,s.NODE_ENV=s.NODE_ENV||process.env.NODE_ENV||"development",s.isDev="development"===s.NODE_ENV,s.isProd="production"===s.NODE_ENV,module.exports=s;
},{"../package.json":"EHrm"}],"/BN7":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("nodemailer")),r=t(require("../config"));function t(e){return e&&e.__esModule?e:{default:e}}const{transport:o,provider:a}=r.default.email,u=a||o,d=e.default.createTransport(u);var i=d;exports.default=i;
},{"../config":"4itQ"}],"Ns+s":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.sendMail=exports.servicesReady=void 0;var e=i(require("util")),o=i(require("consola")),r=i(require("../config")),t=i(require("./mailing"));function i(e){return e&&e.__esModule?e:{default:e}}const l=o.default.withScope("MAIL"),n=new Promise((o,i)=>{t.default.verify().then(()=>{l.ready("transport creation – SUCCESS"),o()}).catch(o=>{l.error("transport creation – ERROR"),console.log(e.default.inspect(o,{colors:!0})),console.log("original config"),console.log(r.default.email),i("[MAILING] connection failed")})}),s=Promise.all([n]);exports.servicesReady=s;const a=t.default.sendMail.bind(t.default);exports.sendMail=a;
},{"../config":"4itQ","./mailing":"/BN7"}],"Sf0C":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=o;var e=i(require("util")),t=i(require("axios")),r=i(require("lodash")),a=i(require("xml2js")),u=i(require("cheerio"));function i(e){return e&&e.__esModule?e:{default:e}}const s=e.default.promisify(a.default.parseString);function l(e){const t=u.default.load(e);return t("h2").remove(),t("a").each((e,r)=>{const a=t(r),u=a.html();a.replaceWith(`<span>${u}</span>`)}),t("body").html().trim()}async function o(){const e=await t.default.get("https://hiswe.github.io/atom.xml");if(200===!e.status)return ctx.body=[{}];const a=await s(e.data),u=r.default.get(a,"feed.entry");return Array.isArray(u)?u.map(e=>{const t=r.default.get(e,"link[0].$.href"),a=r.default.get(e,"summary[0]._");return{title:r.default.get(e,"title[0]"),link:t,cover:`${t}cover.png`,published:r.default.get(e,"published[0]"),summary:l(a)}}):ctx.body=[{}]}
},{}],"M+VU":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=s(require("chalk")),t=s(require("validator/lib/isEmail")),r=s(require("validator/lib/isEmpty")),a=s(require("util")),i=s(require("request-promise-native")),o=s(require("consola")),n=s(require("./config")),l=require("./services");function s(e){return e&&e.__esModule?e:{default:e}}const c=o.default.withScope("CONTACT"),u="https://www.google.com/recaptcha/api/siteverify";async function d(e){const{email:o,message:s}=e,d={email:{valid:(0,t.default)(o),value:o},message:{valid:!(0,r.default)(s),value:s}};if(Object.values(d).map(e=>e.valid).includes(!1))return c.error("validation error"),{validation:d,notification:{content:"you need to fill the form",type:"error"}};const f=e["g-recaptcha-response"];if(!f)return c.warn("no captcha"),{validation:d,notification:{content:"javascript needs to be enabled",type:"error"}};const p={secret:n.default.captcha.secret,response:f},v=await(0,i.default)({method:"POST",uri:u,formData:p,json:!0});if(console.log(a.default.inspect(v,{colors:!0})),!v.success)return{validation:d,notification:{content:"a validation error has occurred. Please try again",type:"error"}};try{await(0,l.sendMail)({from:n.default.email.options.from,to:n.default.email.options.from,replyTo:o,text:s})}catch(m){return console.log(a.default.inspect(m,{colors:!0})),{validation:d,notification:{content:"an error as occurred while sending the mail. Please try again",type:"error"}}}return{validation:d,notification:{content:"message send",type:"info"}}}var f=d;exports.default=f;
},{"./config":"4itQ","./services":"Ns+s"}],"pdZr":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=s(require("./package.json")),t=s(require("rc"));function s(e){return e&&e.__esModule?e:{default:e}}const i=(0,t.default)("hiswe"),n="hiswe website",r="production"===process.env.NODE_ENV;var o={router:{middleware:["reset-form","handle-server-errors"]},loading:{color:"hsl(332, 100%, 50%)",height:"5px"},css:["@/nuxt-assets/css/global.scss","@/nuxt-assets/css/page-transitions.scss"],modules:[["nuxt-sass-resources-loader",["@/nuxt-assets/css/scss-vars.scss","@/nuxt-assets/css/scss-mixin.scss"]]],plugins:["@/nuxt-plugins/global-components.js",{src:"@/nuxt-plugins/browser.js",ssr:!1}],head:{titleTemplate:"Hiswe – %s",meta:[{charset:"utf-8"},{name:"viewport",content:"width=device-width, initial-scale=1"},{"http-equiv":"X-UA-Compatible",content:"IE=edge"},{hid:"author",name:"author",content:e.default.author},{hid:"description",name:"description",content:e.default.description},{hid:"og:title",name:"og:title",content:n},{hid:"og:type",name:"og:type",content:"website"},{hid:"og:description",name:"og:description",content:e.default.description},{hid:"og:url",name:"og:url",content:e.default.homepage},{hid:"twitter:card",name:"twitter:card",content:"summary"},{hid:"twitter:site",name:"twitter:site",content:"@hiswehalya"},{hid:"twitter:creator",name:"twitter:creator",content:"@hiswehalya"}],link:[{rel:"icon",type:"image/png",href:"/favicon.png"}],script:[{src:"https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit",async:!0,defer:!0}]}};exports.default=o;
},{"./package.json":"EHrm"}],"Focm":[function(require,module,exports) {
"use strict";var e=m(require("chalk")),t=m(require("koa")),a=m(require("koa-helmet")),s=m(require("koa-compress")),r=m(require("koa-logger")),o=m(require("koa-json")),i=m(require("koa-router")),n=m(require("koa-body")),u=m(require("consola")),c=require("nuxt"),d=m(require("util")),l=m(require("koa-session")),f=m(require("@hiswe/koa-nuxt")),y=m(require("./config")),q=require("./services"),w=m(require("./latest-blog-post")),p=m(require("./send-contact-mail")),g=m(require("../nuxt.config.js"));function m(e){return e&&e.__esModule?e:{default:e}}const v=u.default.withScope("APP"),h=u.default.withScope("ERROR");async function k(){const u=new t.default;u.keys=["e05fa6f6e4c078ad997ec324e6d69f59829b2e2237c5e1d9e3610fea291793f4","64241b9838c5d0d5f94f7e83c71d83af4674f8c84e406a138263a8803a3b1e6f"],u.use((0,a.default)()),u.use((0,s.default)()),u.use((0,r.default)()),u.use((0,o.default)());const m={key:"hiswe-website",autoCommit:!1};u.use((0,l.default)(m,u)),g.default.dev=y.default.isDev;const k=new c.Nuxt(g.default),b=(0,f.default)(k);if(g.default.dev){v.warn("SPA build for dev");const e=new c.Builder(k);await e.build()}u.use(async(e,t)=>{e.state.isJson="application/json"===e.request.type,await t()}),u.use(async(e,t)=>{try{await t()}catch(a){h.error("one of the next middleware has errored"),console.log(d.default.inspect(a,{colors:!0})),e.status=a.statusCode||a.status||500;const t={code:e.status,reason:a.message,stacktrace:a.stacktrace||a.stack||!1};if(e.state.isJson)return h.error("serving json response"),e.body={notification:{content:t.reason,type:"error"}};e.req.serverData={error:{statusCode:e.status,message:a.message}};try{h.error("serving nuxt response"),await b(e)}catch(s){h.error("serving nuxt response failed"),e.body="nuxt error"}}});const x=new i.default({prefix:"/api"});x.get("/latest-blog-post",async e=>{const t=await(0,w.default)();e.body=t}),x.post("/contact",(0,n.default)(),async e=>{const t=await(0,p.default)(e.request.body);if(e.state.isJson)return e.body=t;e.session=t,await e.session.manuallyCommit(),e.redirect("/")}),u.use(x.routes()),u.use(x.allowedMethods()),u.use(async(e,t)=>{const a=e.session||{};e.req.serverData={validation:a.validation,notification:a.notification,captcha:y.default.captcha.site},e.session={},await e.session.manuallyCommit(),await t()}),u.use(b);try{await q.servicesReady,u.listen(y.default.PORT,y.default.HOST,function(){v.start("server is listening on",e.default.cyan(`${y.default.HOST}:${y.default.PORT}`),"on mode",e.default.cyan(y.default.NODE_ENV))})}catch(O){v.fatal(e.default.red("not launched – needed services errored")),console.log(O)}}k();
},{"./config":"4itQ","./services":"Ns+s","./latest-blog-post":"Sf0C","./send-contact-mail":"M+VU","../nuxt.config.js":"pdZr"}]},{},["Focm"], null)
//# sourceMappingURL=/index.map