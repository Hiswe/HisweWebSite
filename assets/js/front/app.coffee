Controller  = require './front-controller.coffee'
Services    = require './services.coffee'
Projects    = require './projects.coffee'
Contact     = require './contact.coffee'
options     = require '../../../config/datas/stylus-var.json'

class App extends Controller
  trace: true
  logPrefix: '[APP]'
  elements: {
    'body' : 'body'
  }

  constructor: ->
    super
    @log 'init'
    # TODO handle all body behavior here
    @body.removeClass('preload')
    @instanciate()
    @bodyEvents()
    this

  instanciate: ->
    @services = new Services({el: $('section.hw-services')})
    @projects = new Projects({el: $('section.hw-projects')})
    @contact  = new Contact({el: $('form.hw-contact-form')})

  bodyEvents: ->
    @body.on 'click', =>
      @services.e.trigger 'clean'

    @services.e.on('active', =>
      @log('service open')
      @body.addClass(options.activeBody)
    )
    @services.e.on('unactive', =>
      @log('service close')
      @body.removeClass options.activeBody
    )

module.exports = App
