express   = require 'express'
path      = require 'path'
conf      = require('rc')('hiswe')
log       = '[ASSETS]'
awsLog    = log + '[AWS]'

aws       = require('knox').createClient({
  key:    conf.AWS_ACCESS_KEY_ID
  secret: conf.AWS_SECRET_KEY
  bucket: conf.AWS_BUCKET
  region: 'eu-west-1'
  secure: off
})

# Other examples on http://stackoverflow.com/questions/17516820/serving-files-stored-in-s3-in-express-nodejs-app
streamAws = (req, res, next)  ->
  url     = req.params[0]
  # console.log url
  aws.getFile "/#{url}", (err, resp) ->
    # console.log awsLog.prompt, 'get asset'.prompt, url
    if err
      console.log awsLog.error, url, err
      return next(err)

    res.setHeader('Content-Length', resp.headers['content-length'])
    res.setHeader('Content-Type', resp.headers['content-type'])
    return resp.pipe(res)

slowAssets = (req, res, next) ->
  if /\.(jpg||jpeg||png||svg)$/i.test req.url
    # setTimeout(next, 250 + Math.round(1000 * Math.random()))
    setTimeout(next, 2000 + Math.round(2000 * Math.random()))
  else
    next()

module.exports = (app) ->
  console.log log.debug, 'setup assets'

  maxAge = 0

  # Slow assets on dev
  if app.get('env') is 'development'
    console.log awsLog.warn, 'use local images'
    app.use(slowAssets)
  else
    console.log awsLog.prompt, 'use AWS CDN'
    # Amazon S3 support
    reg = ///^\/(
    (?:[\w-]*\.(?:js|css))| # JS & CSS
    (?:media\/images\/[\w-]*\.(?:jpg|jpeg|svg|png)) # Images
    )$///
    app.get(reg, streamAws)
    # Statics
    maxAge = 2629800000 # 1 month

  # Statics
  assets    = path.join(__dirname, '/../public')
  app.use express.static(assets, {maxAge: maxAge})

  return app