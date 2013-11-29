
(function() {
    var util = {
        copyProperties: function(p_src, p_dest) {
            if (!p_dest) throw new Error('p_dest must be defined');
            p_src = p_src || {};

            for (var prop in p_src) {
                if (p_src.hasOwnProperty(prop)) {
                    p_dest[prop] = p_src[prop];
                }
            }
        }
    };


    /**
     * Extendable constructor.
     * @class
     * @name Extendable
     * @private
     */
    function Extendable() {

    }

    Extendable.prototype = /** @lends Extendable.prototype */ {
        /**
         * Extends the literal object and set the current literal as the
         * prototype.
         * @private
         * @param  {Object} p_props Properties to add to the new object
         * @return {Object}         New object with set prototype and properties
         */
        _extendLiteral: function(p_props) {
            p_props = p_props || {};
            var extendedObject = this;
            // set the extended object as new object's prototype
            var newObject = Object.create(extendedObject);
            util.copyProperties(p_props, newObject);
            return newObject;
        },
        /**
         * Extends the constructor function with the current SuperClass. This
         * function will be added as the Constructor's `extend` function.
         * @param  {Function} p_constructor Constructor function
         * @param  {Object} p_prototype     Prototype object
         * @return {Function}               Augmented p_constructor
         * @private
         */
        _extendConstructor: function(p_constructor, p_prototype) {
            var SuperClass = typeof this === 'function' ? this : Extendable;

            // inherit SuperClass prototype
            var prototype = Object.create(SuperClass.prototype);// || {});
            // copy the p_prototype's properties into the new prototype
            util.copyProperties(p_prototype, prototype);

            p_constructor.prototype = prototype;
            p_constructor.prototype.constructor = p_constructor;
            p_constructor.prototype.superclass = SuperClass;

            p_constructor.extend = this._extendConstructor || this.extend;
            p_constructor.override = this.override;

            return p_constructor;
        },
        /**
         * Extend the object which holds this function and set the current
         * object as it's prototype. The newly created object will contain
         * the properties defined by p_props
         *
         * @param  {(Object|Function)} If it's an Object, it will forward the
         * arguments to the {@see Extendable._extendLiteral} function. If it's
         * a constructor function {@see Extendable._extendConstructor}.
         * @return {Object}            The newly created object
         * @throws {Error}             If p_props is not an object nor a
         * constructor function
         */
        extend: function(p_props, p_prototype) {
            if (typeof p_props === 'object') {
                return this._extendLiteral(p_props);
            }
            if (typeof p_props === 'function') {
                return this._extendConstructor(p_props, p_prototype);
            }
            throw new Error('p_props must be an object literal or a ' +
                ' constructor function');
        },
        /**
         * Overrides a method on an existing object with the ability to call
         * the super method. The super parameter (overridden method) will then
         * be added as the first argument to the list.
         *
         * Remember to always add the p_super argument as the first argument
         * when defining a new method and after extending just call the method
         * as you usually would (without the super argument). Also, you can't
         * name the parameteras 'super' because it's a reserved keyword in
         * JavaScript, use 'p_super' or something like that.
         *
         * @param  {String} p_methodName   The name of the method to override
         * @param  {Function} p_newMethod  A new method which overrides
         * @return {Object}                The same object instance (this)
         */
        override: function(p_methodName, p_newMethod) {
            var object = this;
            // the old function
            var overriddenFunction = object[p_methodName];
            if (typeof p_methodName !== 'string') {
                throw new TypeError('p_methodName should be a string');
            }
            if (typeof overriddenFunction !== 'function') {
                throw new Error('Method "' +
                    p_methodName + '" should be a function, but is ' +
                    typeof overriddenFunction);
            }

            // wrap the new method in a separate function so the overridden
            // function can be mapped as the first function parameter
            object[p_methodName] = function() {
                // there is a risk that somebody might have extended the object
                // and we do not want to pass the old `object` reference when
                // somebody calls the function.
                var obj = this;

                // wrap the overridden function so that the `this` reference can
                // be set to the "real" this (`obj`) variable
                function overridenWrapper() {
                    return overriddenFunction.apply(obj, arguments);
                }

                var args = Array.prototype.slice.call(arguments);
                // add the wrapped super function as the first argument
                args.splice(0, 0, overridenWrapper);

                // call the new method and return the result
                return p_newMethod.apply(obj, args);
            };

            return object;
        },
        /**
         * Create a new object from the current object (this). Calling this
         * method is effectively the same as calling `extend()` with
         * no arguments or calling Object.create(arg1) where `arg1` is the
         * current object.
         *
         * @return {Object} A new object with the current object as the
         * prototype
         */
        create: function() {
            return Object.create(this);
        }
    };

    var extendable = new Extendable();

    // export the module
    if (typeof module !== 'undefined' && module.exports) {
        // node.js
        module.exports = extendable;
    }
    else if (typeof define === 'function' && define.amd) {
        // amd module
        define([], function() {
            return extendable;
        });
    }
    else {
        // global variable
        window.Extendable = extendable;
    }
}());