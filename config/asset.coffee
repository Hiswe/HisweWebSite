express = require 'express'
expose  = require 'express-expose'
path    = require 'path'
stylus  = require 'stylus'
nib     = require 'nib'
hstrap  = require 'hstrap'


activeClass = 'hw-panel-active'


compileCss = (str, path) ->
  return stylus(str)
   .set('filename', path)
   .set('compress', false)
   .define('activeClass', new stylus.nodes.String(activeClass))
   .use(nib())
   .use(hstrap())

module.exports = (app) ->
  # Coffeescript + sprocket
  app.use require('connect-assets')()

  # Stylus
  app.use stylus.middleware({
    src: path.join( __dirname + '/../assets/css'),
    dest: path.join( __dirname + '/../public')
    compile: compileCss
  });

  # Statics
  if app.get('env') is 'production'
    maxAge = 2629800000 # 1 month
  else
    maxAge = 1
  assets  = path.join(__dirname, '/../public')
  app.use express.static(assets, {maxAge: maxAge})

  # expose some datas to the front app under bg namespace
  options = {
    activeClass: activeClass
  }
  app.expose({ options: options}, 'hw')

  return app
