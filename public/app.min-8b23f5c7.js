!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module){var App,Contact,Controller,Projects,Services,options,pubsub,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};Controller=require("./front-controller.coffee"),Services=require("./services.coffee"),Projects=require("./projects.coffee"),Contact=require("./contact.coffee"),pubsub=require("./pubsub.coffee"),options=require("../../../config/datas/stylus-var.json"),App=function(_super){function App(){App.__super__.constructor.apply(this,arguments),this.log("init"),this.body.removeClass("prevent-transition"),this.getPixelRatio(),this.instanciate(),this.bodyEvents(),pubsub("resizeStart").subscribe(function(_this){return function(){return _this.body.addClass("prevent-transition")}}(this)),pubsub("resizeEnd").subscribe(function(_this){return function(){return _this.body.removeClass("prevent-transition")}}(this))}return __extends(App,_super),App.prototype.trace=!1,App.prototype.logPrefix="APP",App.prototype.elements={body:"body","section.hw-services":"servicesContainer"},App.prototype.instanciate=function(){return this.services=new Services({el:this.servicesContainer}),this.projects=new Projects({el:$("section.hw-projects")}),this.contact=new Contact({el:$("form.hw-contact-form")})},App.prototype.bodyEvents=function(){return this.body.on("tap",function(_this){return function(){var _ref;return _this.log("body click"),null!=(_ref=_this.services.e)?_ref.trigger("clean"):void 0}}(this)),pubsub("projects").subscribe(function(_this){return function(event){return"openStart"===event&&(_this.log("projects open"),_this.body.css("overflow","hidden")),"closeEnd"===event?(_this.log("projects close"),_this.body.css("overflow","auto")):void 0}}(this))},App.prototype.getPixelRatio=function(){var pixelRatio;return pixelRatio=null!=window.devicePixelRatio?window.devicePixelRatio:1,Controller.prototype.pixelRatio=pixelRatio},App}(Controller),module.exports=App},{"../../../config/datas/stylus-var.json":9,"./contact.coffee":3,"./front-controller.coffee":4,"./projects.coffee":6,"./pubsub.coffee":7,"./services.coffee":8}],2:[function(require){var App,pubsub;App=require("./app.coffee"),pubsub=require("./pubsub.coffee"),jQuery(function(){var resizeTimer;return window.app=new App({el:$("html")}),resizeTimer=null,$(window).on("resize",function(){return resizeTimer||pubsub("resizeStart").publish(),window.clearTimeout(resizeTimer),resizeTimer=window.setTimeout(function(){return pubsub("resizeEnd").publish(),resizeTimer=null},300)}),$("body").on("tap",function(){return pubsub("body").publish("tap")})})},{"./app.coffee":1,"./pubsub.coffee":7}],3:[function(require,module){var Contact,Controller,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}},__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};Controller=require("./front-controller.coffee"),Contact=function(_super){function Contact(){this.always=__bind(this.always,this),this.error=__bind(this.error,this),this.success=__bind(this.success,this),Contact.__super__.constructor.apply(this,arguments),this.el.length&&this.log("init")}return __extends(Contact,_super),Contact.prototype.trace=!1,Contact.prototype.logPrefix="CONTACT",Contact.prototype.removeDelay=5e3,Contact.prototype.elements={"input, textarea, button":"all"},Contact.prototype.events={submit:"submit","click p":"discardMessage"},Contact.prototype.discardMessage=function(e){var $target;return this.log("discard"),$target=$(e.currentTarget),window.clearTimeout(this.timer),$target.on("animationend",function(){return $(this).remove()}).addClass("remove")},Contact.prototype.addMessage=function(type,text){var $msg,msg;return null==type&&(type="success"),null==text&&(text="send"),msg=['<p class="hw-message-',type,'">',text,"</p>"],$msg=$(msg.join("")).prependTo(this.el),this},Contact.prototype.submit=function(e){var data;return this.log("submit"),e.preventDefault(),data={},$.each(this.el.serializeArray(),function(index,item){return data[item.name]=item.value}),this.all.attr("disabled",!0),$.post("/contact",data).done(this.success).fail(this.error).always(this.always)},Contact.prototype.success=function(res){return this.log("success",res),this.addMessage("success",res.message)},Contact.prototype.error=function(res){return this.log("error",res.responseText),this.addMessage("error",res.responseText)},Contact.prototype.always=function(){return this.log("always"),this.refreshElements(),this.all.attr("disabled",!1)},Contact}(Controller),module.exports=Contact},{"./front-controller.coffee":4}],4:[function(require,module){var Controller,uid,__slice=[].slice;uid=0,Controller=function(){function Controller(options){var key,value,_ref;uid+=1,this.uid=uid,this.options=options||{},_ref=this.options;for(key in _ref)value=_ref[key],this[key]=value;return null!=this.el&&this.el.length?(this.elements&&this.refreshElements(),void(this.events&&this.delegateEvents(this.events))):this.warn("initialization aborted")}return Controller.prototype.eventSplitter=/^(\S+)\s*(.*)$/,Controller.prototype.trace=!1,Controller.prototype.logPrefix="(App)",Controller.prototype.log=function(){var args;return args=1<=arguments.length?__slice.call(arguments,0):[],this.trace?(this.logPrefix&&args.unshift("["+this.logPrefix+" – "+this.uid+"]"),"undefined"!=typeof console&&null!==console&&"function"==typeof console.log&&console.log.apply(console,args),this):void 0},Controller.prototype.warn=function(){var args;return args=1<=arguments.length?__slice.call(arguments,0):[],this.trace?(this.logPrefix&&args.unshift("["+this.logPrefix+" – "+this.uid+"]"),"undefined"!=typeof console&&null!==console&&"function"==typeof console.warn&&console.warn.apply(console,args),this):void 0},Controller.prototype.wait=function(timeout){var dfd;return dfd=new jQuery.Deferred,setTimeout(dfd.resolve,timeout||1),dfd.promise()},Controller.prototype.proxy=function(func){return function(_this){return function(){return func.apply(_this,arguments)}}(this)},Controller.prototype.$=function(selector){return $(selector,this.el)},Controller.prototype.refreshElements=function(){var key,value,_ref,_results;_ref=this.elements,_results=[];for(key in _ref)value=_ref[key],_results.push(this[value]=this.$(key));return _results},Controller.prototype.delegateEvents=function(events){var eventName,key,match,method,selector,_results;_results=[];for(key in events){if(method=events[key],"function"==typeof method)method=function(_this){return function(method){return function(){return method.apply(_this,arguments),!0}}}(this)(method);else{if(!this[method])throw new Error(""+method+" doesn't exist");method=function(_this){return function(method){return function(){return _this[method].apply(_this,arguments),!0}}}(this)(method)}match=key.match(this.eventSplitter),eventName=match[1],selector=match[2],_results.push(""===selector?this.el.on(eventName,method):this.el.on(eventName,selector,method))}return _results},Controller}(),module.exports=Controller},{}],5:[function(require,module){var Controller,ServicesCarrousel,options,pubsub,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}},__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};Controller=require("./front-controller.coffee"),options=require("../../../config/datas/stylus-var.json"),pubsub=require("./pubsub.coffee"),ServicesCarrousel=function(_super){function ServicesCarrousel(){return this.resizeEnd=__bind(this.resizeEnd,this),this.updateProgress=__bind(this.updateProgress,this),this.loadImage=__bind(this.loadImage,this),this.onProgress=__bind(this.onProgress,this),ServicesCarrousel.__super__.constructor.apply(this,arguments),this.el.length?this.el.hasClass(options.carrouselClass)?this.warn("Carrousel already intialized"):(this.initCarrousel(),this.loadImages(),void pubsub("resizeEnd").subscribe(this.resizeEnd)):this.warn("No element defined")}return __extends(ServicesCarrousel,_super),ServicesCarrousel.prototype.trace=!1,ServicesCarrousel.prototype.logPrefix="CARROUSEL",ServicesCarrousel.prototype.count=0,ServicesCarrousel.prototype.total=0,ServicesCarrousel.prototype.galleryWidth=null,ServicesCarrousel.prototype.events={"tap .hw-projects-gallery li":"circle"},ServicesCarrousel.prototype.elements={".hw-projects-gallery":"gallery",ul:"list",".hw-projects-gallery li":"li",".hw-projects-gallery img":"images"},ServicesCarrousel.prototype.initCarrousel=function(){return Modernizr.csstransforms?(this.log("Init"),this.el.addClass(options.carrouselClass),this.li.eq(0).addClass(options.carrouselClassSelected),this.total=this.li.length,this.galleryWidth=this.gallery.width(),this.log("with",this.total,"image(s)"),this):(this.el.off("tap",".hw-projects-gallery li"),this.warn("No css transform available"))},ServicesCarrousel.prototype.loadImages=function(){var loadedImages;return loadedImages=this.initLoading().imagesLoaded(),loadedImages.progress(this.onProgress).done(function(_this){return function(){return _this.log("all images loaded")}}(this)),Modernizr.progressbar&&(this.initProgress(),loadedImages.progress(this.updateProgress)),this},ServicesCarrousel.prototype.initLoading=function(){return this.log("Init loading"),this.images.each(this.loadImage),this.refreshElements(),this.images},ServicesCarrousel.prototype.onProgress=function(instance,image){return this.log("on progress"),$(image.img).addClass(options.carrouselImageLoaded).css("opacity","").parent().removeClass("hw-projects-lazyload-loading")},ServicesCarrousel.prototype.loadImage=function(index,image){var $img,$original,$parent,imgSrc;return $original=$(image).css("opacity",0),$img=$original.clone(),$parent=$img.parent().addClass("hw-projects-lazyload-loading"),imgSrc=$img.data("original"),$img.attr("src",imgSrc),$original.replaceWith($img),this},ServicesCarrousel.prototype.initProgress=function(){var progressMarkup;return this.log("Init progress bar"),this.progressCurrent=0,this.total=this.li.length,progressMarkup='<progress class="bg-projects-progress" value="0"  max="',progressMarkup+=this.total+'"></progress>',this.progressBar=$(progressMarkup).appendTo(this.el)},ServicesCarrousel.prototype.updateProgress=function(){return this.log("update progress bar"),this.progressCurrent+=1,this.progressBar.attr("value",this.progressCurrent),this.progressCurrent===this.total?this.progressBar.remove():void 0},ServicesCarrousel.prototype.resizeEnd=function(){return this.galleryWidth=this.gallery.width(),this.moveTo(this.li.eq(this.count)),this},ServicesCarrousel.prototype.getNodes=function(event){var $current,$next,nextNodeIndex;return $current=this.li.eq(this.count),$next=$(event.currentTarget),nextNodeIndex=this.li.index($next),this.log("move from",this.count,"to",nextNodeIndex),this.count=nextNodeIndex,{$current:$current,$next:$next}},ServicesCarrousel.prototype.moveTo=function(selectedImage){var adjustedTransform,currentTransform;return currentTransform=-1*selectedImage.position().left,adjustedTransform=0===this.count?currentTransform:this.count===this.total-1?currentTransform+this.galleryWidth-selectedImage.width():currentTransform+.05*this.galleryWidth,this.list.css({transform:"translate3d("+adjustedTransform+"px, 0px, 0px)"}),this},ServicesCarrousel.prototype.circle=function(event){var el;return this.log("circle"),el=this.getNodes(event),el.$next.hasClass(options.carrouselClassSelected)?void 0:(el.$current.removeClass(options.carrouselClassSelected),el.$next.addClass(options.carrouselClassSelected),this.moveTo(el.$next),this)},ServicesCarrousel}(Controller),module.exports=ServicesCarrousel},{"../../../config/datas/stylus-var.json":9,"./front-controller.coffee":4,"./pubsub.coffee":7}],6:[function(require,module){var Carrousel,Controller,Projects,options,pubsub,__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};Controller=require("./front-controller.coffee"),Carrousel=require("./projects-carrousel.coffee"),options=require("../../../config/datas/stylus-var.json"),pubsub=require("./pubsub.coffee"),Projects=function(_super){function Projects(){Projects.__super__.constructor.apply(this,arguments),this.el.length&&(this.log("Init"),this.all.append('<dd class="'+options.witness+'"></dd>'),this.loadCovers())}return __extends(Projects,_super),Projects.prototype.trace=!1,Projects.prototype.logPrefix="PROJECTS",Projects.prototype.opened=!1,Projects.prototype.elements={".hw-projects-item":"all",".hw-projects-content-container":"content",".hw-projects-content":"container"},Projects.prototype.events={"tap .hw-projects-item":"open","tap .hw-projects-name":"prevent","tap .hw-projects-close":"close","transitionend .hw-witness":"witness"},Projects.prototype.prevent=function(event){return this.log("prevent",event),event.preventDefault(),!1},Projects.prototype.currentPanel=function(){return this.all.filter("."+options.activeClass)},Projects.prototype.clean=function(){return this.currentPanel().removeClass(options.activeClass).find("."+options.witness).heventRemoveClass(options.activeWitness),this},Projects.prototype.loadCovers=function(){return this.wait(1e3).then(function(_this){return function(){return _this.log("init load cover"),_this.$("."+options.projectCoverLoad).each(function(){var $cover,$title,imgMarkup;return $cover=$(this),$title=$cover.find(".hw-projects-name"),imgMarkup='<img src="'+$title.data("original")+'" alt="'+$title.data("alt")+'" />',$(imgMarkup).appendTo($cover).imagesLoaded().done(function(){return $cover.removeClass(options.projectCoverLoad)})})}}(this))},Projects.prototype.loadBody=function($currentPanel){return $currentPanel.data("bodyLoaded")?void 0:this.wait(100).then(function(_this){return function(){var href;return href=$currentPanel.find("a.hw-projects-name").attr("href"),_this.log("load body",href),$.get(href).success(function(body){var $body;return $currentPanel.data("bodyLoaded",!0),$body=$('<div class="hw-projects-content-xhr"></div>').css("opacity",0).append(body),$currentPanel.find(".hw-projects-content").append($body),_this.wait(100).then(function(){return $body.css("opacity",1),_this.initCarrousel($currentPanel)})})}}(this))},Projects.prototype.witness=function(){return this.opened===!0?(this.log("witness :: close"),this.closingTransitionEnd()):(this.log("witness :: open"),this.openingTransitionEnd()),this},Projects.prototype.openingTransitionEnd=function(){var $currentPanel;return this.opened===!0?this:(this.log("transition end ::","open"),$currentPanel=this.currentPanel(),this.loadBody($currentPanel),pubsub("projects").publish("openEnd"),this.opened=!0)},Projects.prototype.closingTransitionEnd=function(){return this.opened===!1?this:(this.log("transition end::","close"),this.el.css("z-index",1),pubsub("projects").publish("closeEnd"),this.opened=!1)},Projects.prototype.initCarrousel=function($currentPanel){var $carrousel;return $carrousel=$currentPanel.data("carrousel",!0).find(".hw-projects-gallery-container"),this.log("init",$carrousel.length,"carrousel(s)"),$.each($carrousel,function(){return new Carrousel({el:$(this)})})},Projects.prototype.open=function(e){var $target;return $target=$(e.currentTarget),e.stopPropagation(),$target.hasClass(options.activeClass)?void 0:(this.log("Projects open"),e.preventDefault(),this.clean(),this.el.css("z-index",2),this.wait(50).then(function(){return $target.addClass(options.activeClass)}),$target.find("."+options.witness).heventAddClass(options.activeWitness),pubsub("projects").publish("openStart"),this)},Projects.prototype.close=function(e){return this.log("Projects close"),e.preventDefault(),e.stopImmediatePropagation(),pubsub("projects").publish("closeStart"),this.container.scrollTop(0),this.clean(),this},Projects}(Controller),module.exports=Projects},{"../../../config/datas/stylus-var.json":9,"./front-controller.coffee":4,"./projects-carrousel.coffee":5,"./pubsub.coffee":7}],7:[function(require,module){var pubsub,topics;topics={},pubsub=function(id){var callbacks,topic;if(null==id)throw new Error("pubsub need an  id");return topic=topics[id],null==topic?(callbacks=jQuery.Callbacks(),topic={publish:callbacks.fire,subscribe:callbacks.add,unsubscribe:callbacks.remove},topics[id]=topic,topic):topic},module.exports=pubsub},{}],8:[function(require,module){var Controller,Services,options,pubsub,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}},__hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};Controller=require("./front-controller.coffee"),options=require("../../../config/datas/stylus-var.json"),pubsub=require("./pubsub.coffee"),Services=function(_super){function Services(){this.clean=__bind(this.clean,this),Services.__super__.constructor.apply(this,arguments),this.el.length&&(this.log("Init"),pubsub("body").subscribe(function(_this){return function(event){return"tap"===event?_this.clean():void 0}}(this)))}return __extends(Services,_super),Services.prototype.trace=!1,Services.prototype.logPrefix="SERVICES",Services.prototype.opened=!1,Services.prototype.elements={".hw-services-item":"servicePanels",".hw-sub-close":"closeButton"},Services.prototype.events={"tap .hw-services-item":"open","tap .hw-sub-close":"close","transitionend .hw-services-item":"transitionend"},Services.prototype.clean=function(){var $panel;return this.log("clean"),$panel=this.servicePanels.filter("."+options.activeClass),$panel.heventRemoveClass(options.activeClass),this},Services.prototype.transitionend=function(event){var e;return e=event.originalEvent,null!=event.originalEvent&&/cover/.test(event.target.className)&&/transform/.test(e.propertyName)?this.opened===!0?(this.log("transition end::","close"),this.el.css("z-index",1),pubsub("services").publish("close"),this.opened=!1):(this.log("transition end ::","open"),this.opened=!0):void 0},Services.prototype.open=function(e){var $target;return this.log("Service open"),$target=$(e.currentTarget),e.stopPropagation(),$target.hasClass(options.activeClass)?void 0:(e.preventDefault(),this.clean(),this.el.css("z-index",2),$target.heventAddClass(options.activeClass),pubsub("services").publish("open"),this)},Services.prototype.close=function(e){return this.log("Service close"),e.preventDefault(),e.stopImmediatePropagation(),this.clean(),this},Services}(Controller),module.exports=Services},{"../../../config/datas/stylus-var.json":9,"./front-controller.coffee":4,"./pubsub.coffee":7}],9:[function(require,module){module.exports={activeClass:"hw-panel-active",witness:"hw-witness",activeWitness:"hw-witness-active",activeBody:"hw-body-active",carrouselClass:"hw-carrousel",desktopWidth:1080,carrouselHeight:552,carrouselImageLoaded:"hw-carrousel-image-loaded",carrouselClassSelected:"hw-carrousel-selected",projectCoverLoad:"hw-projects-cover-lazyload"}},{}]},{},[2]);