!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module){var App,Contact,Controller,Projects,Services,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};Controller=require("./front-controller.coffee"),Services=require("./services.coffee"),Projects=require("./projects.coffee"),Contact=require("./contact.coffee"),App=function(_super){function App(){this.log("init"),$("body").removeClass("preload"),this.services=new Services({el:$("section.hw-services")}),this.projects=new Projects({el:$("section.hw-projects")}),this.contact=new Contact({el:$("form.hw-contact-form")})}return __extends(App,_super),App.prototype.trace=!1,App.prototype.logPrefix="[APP]",App}(Controller),module.exports=App},{"./contact.coffee":3,"./front-controller.coffee":5,"./projects.coffee":6,"./services.coffee":7}],2:[function(require){var App;App=require("./app.coffee"),jQuery(function(){return window.app=new App({el:$("html")})})},{"./app.coffee":1}],3:[function(require,module){var Contact,Controller,events,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}},__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};Controller=require("./front-controller.coffee"),events=require("./events.coffee"),Contact=function(_super){function Contact(){this.always=__bind(this.always,this),this.error=__bind(this.error,this),this.success=__bind(this.success,this),Contact.__super__.constructor.apply(this,arguments),this.el.length&&this.log("init")}return __extends(Contact,_super),Contact.prototype.trace=!1,Contact.prototype.logPrefix="[CONTACT]",Contact.prototype.removeDelay=5e3,Contact.prototype.elements={"input, textarea, button":"all"},Contact.prototype.events={submit:"submit","click p":"discardMessage"},Contact.prototype.discardMessage=function(e){var $target;return this.log("discard"),$target=$(e.currentTarget),window.clearTimeout(this.timer),$target.on(events.animation,function(){return $(this).remove()}).addClass("remove")},Contact.prototype.addMessage=function(type,text){var $msg,msg;return null==type&&(type="success"),null==text&&(text="send"),msg=['<p class="hw-message-',type,'">',text,"</p>"],$msg=$(msg.join("")).prependTo(this.el),this.timer=window.setTimeout(function(_this){return function(){return _this.discardMessage({currentTarget:$msg})}}(this),this.removeDelay),this},Contact.prototype.submit=function(e){var data;return this.log("submit"),e.preventDefault(),data={},$.each(this.el.serializeArray(),function(index,item){return data[item.name]=item.value}),this.all.attr("disabled",!0),$.post("/contact",data).done(this.success).fail(this.error).always(this.always)},Contact.prototype.success=function(res){return this.log("success",res),this.addMessage("success",res.message)},Contact.prototype.error=function(res){return this.log("error",res.responseText),this.addMessage("error",res.responseText)},Contact.prototype.always=function(){return this.log("always"),this.refreshElements(),this.all.attr("disabled",!1)},Contact}(Controller),module.exports=Contact},{"./events.coffee":4,"./front-controller.coffee":5}],4:[function(require,module,exports){var whichAnimationEvent,whichTransitionEvent;whichTransitionEvent=function(){var transEndEventNames;return transEndEventNames={transition:"transitionend",msTransition:"MSTransitionEnd",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"},transEndEventNames[Modernizr.prefixed("transition")]},whichAnimationEvent=function(){var animationEndEventNames;return animationEndEventNames={animation:"animationend",msAnimation:"MSAnimationEnd",OAnimation:"oAnimationEnd",MozAnimation:"animationend",WebkitAnimation:"webkitAnimationEnd"},animationEndEventNames[Modernizr.prefixed("animation")]},exports.transition=whichTransitionEvent(),exports.animation=whichAnimationEvent()},{}],5:[function(require,module){var Controller,__slice=[].slice;Controller=function(){function Controller(options){var key,value,_ref;this.options=options||{},_ref=this.options;for(key in _ref)value=_ref[key],this[key]=value;return null!=this.el&&this.el.length?(this.e=$({}),this.elements&&this.refreshElements(),void(this.events&&this.delegateEvents(this.events))):this.warn("initialization aborted")}return Controller.prototype.eventSplitter=/^(\S+)\s*(.*)$/,Controller.prototype.trace=!1,Controller.prototype.logPrefix="(App)",Controller.prototype.log=function(){var args;return args=1<=arguments.length?__slice.call(arguments,0):[],this.trace?(this.logPrefix&&args.unshift(this.logPrefix),"undefined"!=typeof console&&null!==console&&"function"==typeof console.log&&console.log.apply(console,args),this):void 0},Controller.prototype.warn=function(){var args;return args=1<=arguments.length?__slice.call(arguments,0):[],this.trace?(this.logPrefix&&args.unshift(this.logPrefix),"undefined"!=typeof console&&null!==console&&"function"==typeof console.warn&&console.warn.apply(console,args),this):void 0},Controller.prototype.delay=function(func,timeout){return setTimeout(this.proxy(func),timeout||1)},Controller.prototype.proxy=function(func){return function(_this){return function(){return func.apply(_this,arguments)}}(this)},Controller.prototype.$=function(selector){return $(selector,this.el)},Controller.prototype.refreshElements=function(){var key,value,_ref,_results;_ref=this.elements,_results=[];for(key in _ref)value=_ref[key],_results.push(this[value]=this.$(key));return _results},Controller.prototype.delegateEvents=function(events){var eventName,key,match,method,selector,_results;_results=[];for(key in events){if(method=events[key],"function"==typeof method)method=function(_this){return function(method){return function(){return method.apply(_this,arguments),!0}}}(this)(method);else{if(!this[method])throw new Error(""+method+" doesn't exist");method=function(_this){return function(method){return function(){return _this[method].apply(_this,arguments),!0}}}(this)(method)}match=key.match(this.eventSplitter),eventName=match[1],selector=match[2],_results.push(""===selector?this.el.on(eventName,method):this.el.on(eventName,selector,method))}return _results},Controller}(),module.exports=Controller},{}],6:[function(require,module){var Controller,Projects,options,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};Controller=require("./front-controller.coffee"),options=require("../../../config/datas/stylus-var.json"),Projects=function(_super){function Projects(){Projects.__super__.constructor.apply(this,arguments),this.el.length&&(this.log("Init"),this.body=$("body"),this.body.on("click",this.cleanAll))}return __extends(Projects,_super),Projects.prototype.trace=!0,Projects.prototype.logPrefix="[PROJECTS]",Projects}(Controller),module.exports=Projects},{"../../../config/datas/stylus-var.json":8,"./front-controller.coffee":5}],7:[function(require,module){var Controller,Services,options,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}},__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};Controller=require("./front-controller.coffee"),options=require("../../../config/datas/stylus-var.json"),Services=function(_super){function Services(){this.cleanAll=__bind(this.cleanAll,this),Services.__super__.constructor.apply(this,arguments),this.el.length&&(this.log("Init"),this.body=$("body"),this.body.on("click",this.cleanAll))}return __extends(Services,_super),Services.prototype.trace=!1,Services.prototype.logPrefix="[SERVICES]",Services.prototype.timer=void 0,Services.prototype.elements={".hw-sub-container":"servicePanels",".hw-sub-close":"close"},Services.prototype.events={"click .hw-sub-container":"serviceZoom","click .hw-sub-close":"serviceClose"},Services.prototype.cleanAll=function(e){return null!=e&&this.log("clean"),this.servicePanels.removeClass(options.activeClass),this},Services.prototype.serviceZoom=function(e){var $target;return $target=$(e.currentTarget),e.stopPropagation(),$target.hasClass(options.activeClass)?void 0:(window.clearTimeout(this.timer),this.log("Service zoom"),e.preventDefault(),e.stopPropagation(),this.cleanAll(),this.el.css("z-index",2),$target.addClass(options.activeClass),this.body.addClass(options.activeBody),this)},Services.prototype.serviceClose=function(e){var $panel,$target;return this.log("Service close"),e.preventDefault(),e.stopPropagation(),$target=$(e.currentTarget),$panel=this.servicePanels.eq(this.close.index($target)),$panel.hasClass(options.activeClass)?(this.timer=this.delay(function(){return this.el.css("z-index",1)},2e3),$panel.removeClass(options.activeClass),this.body.removeClass(options.activeBody),this.cleanAll(),this):void 0},Services}(Controller),module.exports=Services},{"../../../config/datas/stylus-var.json":8,"./front-controller.coffee":5}],8:[function(require,module){module.exports={activeClass:"hw-panel-active",activeBody:"hw-body-active",carrouselClass:"hw-carrousel"}},{}]},{},[2]);