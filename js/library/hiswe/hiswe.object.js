(function(h, $) {
	$.extend(h, {
		object: function (name, base, prototype) { // inspired by jQuery widget factory
			var namespace = name.split( "." )[ 0 ],
				name = name.split( "." )[ 1 ],
				fullName = namespace+h.capitalize(name),
				generalSettings = (h.settings && h.settings[nameSpace] && h.settings[nameSpace][base]) ? h.settings[nameSpace][base] : {},
				baseObject,
				baseOptions = $.extend(true, {}, generalSettings, {
					object: name,
					namespace: namespace,
					fullName: fullName
				}),
				augmentedObject = {};

			if ( !prototype ) {
				prototype = base;
				base = h.Object,
				baseObject = {
					_create: $.noop,
					_super: function (module ,methodName, datas) {
						var namespace = module.split( "." )[ 0 ],
							name = module.split( "." )[ 1 ];
						datas = datas || [];

						if (h[namespace] && h[namespace].prototype[name]
							&& h[namespace].prototype[name][methodName] && $.isFunction(h[namespace].prototype[name][methodName])){
								h[namespace].prototype[name][methodName].apply(this, datas)
						}else{
							cp.debug('warn', '['+this.options.module +'] No super method ::', methodName, 'in', module);
						}
					}
				}
			}else{
				var baseNamespace = base.split( "." )[ 0 ],
					baseName = base.split( "." )[ 1 ];
				baseObject = h[ baseNamespace ].prototype[ baseName ];
			}
			// create a new object with all methods public
			augmentedObject = $.extend(true, augmentedObject, baseObject, prototype);
			h.debug('[object] ',fullName,' :: ', augmentedObject);


			var createInstance = function (options) {
				var instance,
					publicFunctions = {};
				// create a new instance object
				instance = Object.create(augmentedObject);
				// merge options
				instance.options = $.extend(true, {}, augmentedObject.options, options, baseOptions);
				// call the create function
				instance._create.apply(instance, []);
				// Reveal each functions not prefixed with an underscore
				for (var key in instance) {
					if (!/^_/.test(key) && $.isFunction(instance[key])){
						publicFunctions[key] = instance[key];
					}
				}
				return publicFunctions;
			};

			// expose him to framework name space
			h[ namespace ] = h[ namespace ] || {}; // create the namespace if none
			// expose the prototype
			h[ namespace ].prototype = h[ namespace ].prototype || {};
			h[ namespace ].prototype[ name ] = augmentedObject;
			// Create the object factory
			h[ fullName ] = createInstance;
		}
	});
}(hiswe, jQuery));