/*
 *  jQuery BoxyText - v0.1
 *  Fit text into an element with a given height and width with the largest font size possible.
 *  https://github.com/jjandoc/jquery-boxy-text
 *
 *  Made by Jon Jandoc
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = 'boxyText',
				defaults = {
				height: null,
				width: null,
				maxFontSize: null,
				minFontSize: 1,
				lineHeight: null,
				wrapperClass: 'boxy-text-inner'
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
  		  state: {
    		    fontSize: null,
    		    height: null,
    		    width: null
  		  },
  		  styles: {
    		    'font-size' : null,
    		    'line-height' : null
  		  },

				init: function () {
						// Place initialization logic here
						// You already have access to the DOM element and
						// the options via the instance, e.g. this.element
						// and this.settings
						// you can add more functions like the one below and
						// call them like so: this.yourOtherFunction(this.element, this.settings).
						var $el = $(this.element);

						// update setting dimensions, using current element size if no argument is supplied
					  this.settings.height = (this.settings.height && typeof this.settings.height === 'number') ?
					      this.settings.height : $el.outerHeight();
						this.settings.width = (this.settings.width && typeof this.settings.width === 'number') ?
					      this.settings.width : $el.outerWidth();

			      // update line height if nothing was supplied to use current element line height
			      if (this.settings.lineHeight === null) {
  			        var lineHeight = $el.css('line-height');
  			        var fontSize = parseInt($el.css('font-size').replace('px', ''), 10);
  			        // handle line height in pixel format
  			        if (lineHeight.indexOf('px') > 0) {
    			          this.settings.lineHeight = parseFloat(lineHeight, 10) / fontSize;
			          // handle line height as percentage
  			        } else if (lineHeight.indexOf('%') > 0) {
    			          this.settings.lineHeight = parseFloat(lineHeight, 10) / 100;
			          // handle "normal" or "initial" or something that's not a number
			          // so let's use the browser default of 1.2
  			        } else if (isNaN(lineHeight)) {
    			          this.settings.lineHeight = 1.2;
			          // all that's left are normal numbers
  			        } else {
    			          this.settings.lineHeight = parseFloat(lineHeight, 10);
  			        }
			      }
			      this.styles['line-height'] = this.settings.lineHeight;

			      if ($el.find('.' + this.settings.wrapperClass).length < 1) {
  			        $el.wrapInner('<div class="' + this.settings.wrapperClass + '">');
			      }
			      this.$innerWrap = $el.find('.' + this.settings.wrapperClass);
			      this.updateState();

			      var comparison = this.compareSize();
			      if (comparison !== 'equal') {
    			      if (comparison === 'larger') {
      			        this.sizeDown();
    			      } else if (comparison === 'smaller') {
      			        this.sizeUp();
    			      }
			      }
				},

				updateState: function() {
			      this.state.fontSize = parseInt(this.$innerWrap.css('font-size').replace('px', ''), 10);
			      this.state.height = this.$innerWrap.outerHeight();
			      this.state.width = this.$innerWrap.outerWidth();
				},

				compareSize: function () {
			      if (this.state.width > this.settings.width ||
		        this.state.height > this.settings.height) {
                return 'larger';
		        } else if (this.state.width < this.settings.width ||
		        this.state.height < this.settings.height) {
  		          return 'smaller';
		        } else {
  		          return 'equal';
		        }
				},
				setStyle: function() {
  				  this.$innerWrap.css(this.styles);
				},
				sizeUp: function () {
  				  var currentFontSize = this.state.fontSize;
  				  if (!this.settings.maxFontSize || currentFontSize < this.settings.maxFontSize) {
      				  var newFontSize = currentFontSize + 1;
    				    this.styles['font-size'] = newFontSize + 'px';
    				    this.setStyle();
    				    this.updateState();
    				    var comparison = this.compareSize();
    				    if (comparison === 'larger') {
      				      // too big, bring it back down a notch and we're done
      				      this.styles['font-size'] = currentFontSize + 'px';
      				      this.setStyle();
    				    } else {
      				      this.state.fontSize = newFontSize;
      				      this.sizeUp();
    				    }
  				  }
				},
				sizeDown: function () {
  				  var currentFontSize = this.state.fontSize;
  				  if (!this.settings.minFontSize || currentFontSize > this.settings.minFontSize) {
      				  var newFontSize = currentFontSize - 1;
    				    this.styles['font-size'] = newFontSize + 'px';
    				    this.setStyle();
    				    this.updateState();
    				    var comparison = this.compareSize();
    				    if (comparison === 'larger') {
      				      // still too big, get smaller.
      				      this.state.fontSize = newFontSize;
      				      this.sizeDown();
    				    }
  				  }
				}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				this.each(function() {
						if ( !$.data( this, 'plugin_' + pluginName ) ) {
								$.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
						}
				});

				// chain jQuery functions
				return this;
		};

})( jQuery, window, document );
