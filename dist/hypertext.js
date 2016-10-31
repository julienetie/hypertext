(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.hypertext = global.hypertext || {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/**
 * @license
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash include="isPlainObject" -o isPlainObject.js`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
// ;(function() {

/** Used as the semantic version number. */
/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/*--------------------------------------------------------------------------*/

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/*--------------------------------------------------------------------------*/

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

// No operation performed.


/*------------------------------------------------------------------------*/

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || objectToString.call(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

/*--------------------------------------------------------------------------*/

//   // Some AMD build optimizers, like r.js, check for condition patterns like:
//   if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
//     // Expose Lodash on the global object to prevent errors when Lodash is
//     // loaded by a script tag in the presence of an AMD loader.
//     // See http://requirejs.org/docs/errors.html#mismatch for more details.
//     // Use `_.noConflict` to remove Lodash from the global object.
//     root._ = lodash;

//     // Define as an anonymous module so, through path mapping, it can be
//     // referenced as the "underscore" module.
//     define(function() {
//       return lodash;
//     });
//   }
//   // Check for `exports` after `define` in case a build optimizer adds it.
//   else if (freeModule) {
//     // Export for Node.js.
//     (freeModule.exports = lodash)._ = lodash;
//     // Export for CommonJS support.
//     freeExports._ = lodash;
//   }
//   else {
//     // Export to the global object.
//     root._ = lodash;
//   }
// }.call(this));

/**
 * @license
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash include="isEmpty" -o isEmpty.js`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
// ;(function() {

/** Used as a safe reference for `undefined` in pre-ES5 environments. */
var undefined$1;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag$1 = '[object Object]';
var promiseTag = '[object Promise]';
var proxyTag = '[object Proxy]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf$1 = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();

/** Detect free variable `exports`. */
var freeExports$1 = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal$1.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/*--------------------------------------------------------------------------*/

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined$1 : object[key];
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg$1(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/*--------------------------------------------------------------------------*/

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;
var objectProto$1 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root$1['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/** Built-in value references. */
var Buffer = moduleExports ? root$1.Buffer : undefined$1;
var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined$1;
var nativeKeys = overArg$1(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root$1, 'DataView');
var Map = getNative(root$1, 'Map');
var Promise$1 = getNative(root$1, 'Promise');
var Set = getNative(root$1, 'Set');
var WeakMap = getNative(root$1, 'WeakMap');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView);
var mapCtorString = toSource(Map);
var promiseCtorString = toSource(Promise$1);
var setCtorString = toSource(Set);
var weakMapCtorString = toSource(WeakMap);

// No operation performed.


/*------------------------------------------------------------------------*/

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString$1.call(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike$1(value) && objectToString$1.call(value) == argsTag;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike$1(value) && isLength(value.length) && !!typedArrayTags[objectToString$1.call(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$1.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined$1;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = function getTag(value) {
    var result = objectToString$1.call(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined$1,
        ctorString = Ctor ? toSource(Ctor) : undefined$1;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$1;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/*------------------------------------------------------------------------*/

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike$1(value) && hasOwnProperty$1.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (isArrayLike(value) && (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty$1.call(value, key)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString$1.call(value) : '';
  return tag == funcTag || tag == genTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/*------------------------------------------------------------------------*/

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var version = '2';

/**
 * @license
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash include="isArray" -o isArray.js`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the semantic version number. */
/** Detect free variable `global` from Node.js. */
var freeGlobal$2 = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf$2 = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$2 = freeGlobal$2 || freeSelf$2 || Function('return this')();

// No operation performed.


/*------------------------------------------------------------------------*/

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

var isVirtualText = function isVirtualText(virtualText) {
	return virtualText && virtualText.type === "VirtualText" && virtualText.version === version;
};

var isThunk = function isThunk(thunk) {
	return thunk && thunk.type === "Thunk";
};

var isHook = function isHook(hook) {
	return hook && (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") || typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
};

var isVirtualNode = function isVirtualNode(VirtualNode) {
	return VirtualNode && VirtualNode.type === "VirtualNode" && VirtualNode.version === version;
};

var isWidget = function isWidget(widget) {
	return widget && widget.type === "Widget";
};

var isChild = function isChild(child) {
	return isVirtualNode(child) || isVirtualText(child) || isWidget(child) || isThunk(child);
};

function VirtualNode(tagName, properties, children, key, namespace, event) {
    this.tagName = tagName;
    this.properties = properties || {};
    this.children = children || [];
    this.key = key != null ? key + '' : undefined;
    this.namespace = typeof namespace === "string" ? namespace : null;

    var count = children && children.length || 0;
    var descendants = 0;
    var hasWidgets = false;
    var hasThunks = false;
    var descendantHooks = false;
    var hooks = void 0;
    var propName = void 0;
    var property = void 0;
    var i = void 0;
    var child = void 0;

    for (propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            property = properties[propName];
            if (isHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {};
                }

                hooks[propName] = property;
            }
        }
    }

    for (i = 0; i < count; i++) {
        child = children[i];
        if (isVirtualNode(child)) {
            descendants += child.count || 0;

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true;
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true;
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true;
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true;
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants;
    this.hasWidgets = hasWidgets;
    this.hasThunks = hasThunks;
    this.hooks = hooks;
    this.descendantHooks = descendantHooks;
    this.event = event;
    this.virtualNode = true;
}

function VirtualText(text) {
    this.text = text + '';
}

VirtualNode.prototype.version = version;
VirtualNode.prototype.type = "VirtualNode";
VirtualText.prototype.version = version;
VirtualText.prototype.type = "VirtualText";

var getChildNodes = function getChildNodes(child, childNodes) {
    var tempChildNodes = Array.from(childNodes);

    if (typeof child === 'string' || typeof child === 'number') {
        tempChildNodes.push(new VirtualText(child));
    } else if (isChild(child)) {
        tempChildNodes.push(child);
    } else if (isArray$1(child)) {
        var childLength = child.length;
        for (var i = 0; i < childLength; i++) {
            tempChildNodes.push(getChildNodes(child[i], childNodes)[0]);
        }
    }
    return tempChildNodes;
};

var assembly = function assembly(tagName) {
    var tagNameUppercase = tagName.toUpperCase();
    return function () {
        var childNodes = [];
        var children = [];
        var props = void 0;
        var key = void 0;
        var namespace = void 0;
        var item = void 0;
        var i = void 0;
        var allChildNodes = void 0;
        var event = false;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        for (i = 0; i < args.length; i++) {
            item = args[i] || {};

            // Check if item is a text node.
            if (typeof item === 'string' || typeof item === 'number') {
                children.push(item);

                // Check if item is a child.
            } else if (item !== null && item.hasOwnProperty('virtualNode')) {
                children.push(item);

                // Check if item is a properties object.
            } else if (isPlainObject(item)) {

                // Check if it has the event property.
                if (item.hasOwnProperty('event')) {
                    event = item.event;
                    delete item.event;
                }

                // Check if properties is not empty.
                if (!isEmpty(item)) {
                    props = item;
                }
            }

            // Check if Loop of children 
            if (item instanceof Array) {
                item.forEach(function (child) {
                    children.push(child);
                });
            }
        }

        props = props || {};

        // support keys
        if (props.hasOwnProperty('key')) {
            key = props.key;
            props.key = undefined;
        }

        // support namespace
        if (props.hasOwnProperty('namespace')) {
            namespace = props.namespace;
            props.namespace = undefined;
        }

        allChildNodes = getChildNodes(children, childNodes);

        return new VirtualNode(tagNameUppercase, props, allChildNodes, key, namespace, event);
    };
};

function internal(data, callback, supportData) {
	var childContainer = callback.apply(this, [data, supportData]);
	if (isArray$1(childContainer)) {
		return childContainer;
	} else {
		throw new Error('A loop must return an array');
	}
}

function loop(data, inner, supportData) {
	return internal.apply(this, [data, inner, supportData]);
}

function internal$1(data, callback, supportData) {
	var childContainer = callback.apply(this, [data, supportData]);
	if (isArray$1(childContainer) || isChild(childContainer || typeof childContainer === 'string')) {
		return childContainer;
	} else {
		throw new Error('or() must return a virtualChildNode, Array or String');
	}
}

function or(data, inner, supportData) {
	return internal$1.apply(this, [data, inner, supportData]);
}

var eventStore$1 = {};

/*
 * An eventReference is meant only for an element
 * or elements that may co-exist as the same element between patches 
 */
var storeEventTarget = function storeEventTarget(HTMLElement, eventReference) {
	var i = void 0;

	if (!eventStore$1.hasOwnProperty(eventReference)) {
		eventStore$1[eventReference] = [HTMLElement];
	} else {
		var eventStoreRef = eventStore$1[eventReference];

		if (!eventStoreRef.includes(HTMLElement)) {
			eventStore$1.push(HTMLElement);
		}
	}
};

var removeProperty = function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName];

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName);
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = "";
                }
            } else if (typeof previousValue === "string") {
                node[propName] = "";
            } else {
                node[propName] = null;
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue);
        }
    }
};

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg$2(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Built-in value references. */
var getPrototype$1 = overArg$2(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$2(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;
var objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString$1 = funcToString$2.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$2 = objectProto$2.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject$1(value) {
  if (!isObjectLike$2(value) || objectToString$2.call(value) != objectTag$2) {
    return false;
  }
  var proto = getPrototype$1(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$2.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString$2.call(Ctor) == objectCtorString$1);
}

function applyStyles(node, propName, propValue) {
    var propertyName = propName;
    var value = void 0;
    for (var stylePropName in propValue) {
        value = propValue[stylePropName];
        node[propName][stylePropName] = value || value + '';
    }
}

function applyProperties(node, props) {
    var propValue = void 0;
    for (var propName in props) {

        propValue = props[propName];

        if (propValue === undefined) {
            removeProperty(node, propName, propValue);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue);
            if (propValue.hook) {
                propValue.hook(node, propName);
            }
        } else {

            if (isPlainObject$1(propValue)) {
                applyStyles(node, propName, propValue); // Property is a style.
            } else {
                // If property is a an attribute.
                switch (propName) {
                    case 'class':
                        propName = 'className';
                        break;
                }
                node[propName] = propValue;
            }
        }
    }
}

function createNodes$1(virtualNode, opts) {
    var warn = opts ? opts.warn : null;
    var vnode = virtualNode;
    var virtualNodeEvent = virtualNode.event;
    var children = void 0;
    var childNode = void 0;
    var node = void 0;

    // If widget, Vtext or not a vnode
    if (isWidget(vnode)) {
        return vnode.init();
    } else if (isVirtualText(vnode)) {
        return document.createTextNode(vnode.text);
    } else if (!isVirtualNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode);
        }
        return null;
    }

    // if no namespace create HTML, else create SVG
    if (vnode.namespace === null) {
        node = document.createElement(vnode.tagName);
        if (virtualNodeEvent) {
            storeEventTarget(node, virtualNodeEvent);
        }
    } else {
        node = document.createElementNS(vnode.namespace, vnode.tagName);
    }

    applyProperties(node, vnode.properties);

    children = vnode.children;
    var childrenLength = children.length;

    for (var i = 0; i < childrenLength; i++) {
        childNode = createNodes$1(children[i], opts);
        if (childNode) {
            node.appendChild(childNode);
        }
    }

    return node;
}

var isHook$1 = function isHook$1(hook) {
  return hook && (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") || typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
};

function VirtualNode$1(propertiesVal, childrenVal, keyVal, namespaceVal) {

  var properties = propertiesVal || {};
  var children = childrenVal || [];
  var key = keyVal != null ? keyVal + '' : undefined;
  var namespace = typeof namespaceVal === "string" ? namespaceVal : null;

  var count = children && children.length || 0;
  var descendants = 0;
  var hasWidgets = false;
  var hasThunks = false;
  var descendantHooks = false;
  var hooks = void 0;
  var propName = void 0;
  var property = void 0;
  var i = void 0;
  var child = void 0;

  for (propName in properties) {
    if (properties.hasOwnProperty(propName)) {
      property = properties[propName];
      if (isHook$1(property) && property.unhook) {
        if (!hooks) {
          hooks = {};
        }

        hooks[propName] = property;
      }
    }
  }

  for (i = 0; i < count; i++) {
    child = children[i];

    // TODO fix condition 
    {
      descendants += child.count || 0;

      if (!hasWidgets && child.hasWidgets) {
        hasWidgets = true;
      }

      if (!hasThunks && child.hasThunks) {
        hasThunks = true;
      }

      if (!descendantHooks && (child.hooks || child.descendantHooks)) {
        descendantHooks = true;
      }
    }
  }

  return {
    count: count + descendants || 0,
    hasWidgets: hasWidgets,
    hasThunks: hasThunks,
    hooks: hooks,
    descendantHooks: descendantHooks,
    key: key
  };
}

var createVTree = function createVTree(interfaceSelector) {
  var whitespaceRules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'trim';


  var element;
  var vTree = {};
  if (interfaceSelector.nodeType) {
    element = interfaceSelector;
  } else {
    element = document.querySelector(interfaceSelector);
  }

  function getDefinedAttributes(attributes) {
    var attr = {};
    var attributesLength = attributes.length;
    var attribute = void 0;
    var attributeName = void 0;
    var namespace = false;
    var key = null;
    var event = false;

    for (var i = 0; i < attributesLength; i++) {
      attribute = attributes[i];
      attributeName = attributes[i].name;

      // Ignore
      switch (attributeName) {
        case 'key':
          key = attribute.value;
          break;
        case 'event':
          event = attribute.value;
          break;
        default:
          attr[attribute.name] = attribute.value;
      }

      // Also
      switch (attributeName) {
        case 'xmlns':
        case 'xmlns:svg':
        case 'xmlns:xlink':
          namespace = attribute.value;
          break;
      }
    }

    return { attr: attr, namespace: namespace, key: key };
  }

  // function getChildrenAsArray(children){
  //   const childrenArr = [];
  //   const childrenLength = children.length;

  //   for(let i = 0; i < childrenLength; i++){
  //     childrenArr.push(createVTree(children[i]));
  //   }
  //   return childrenArr;
  // }


  function getChildNodesAsArray(childNodes) {
    var ignoreTrim = !(whitespaceRules === 'ignore-trim');
    var childNodesArr = [];
    var childNodesLength = childNodes.length;

    for (var i = 0; i < childNodesLength; i++) {
      if (childNodes[i].nodeType === 3 & ignoreTrim) {
        /*
         *  "\t" TAB \u0009
         *  "\n" LF  \u000A
         *  "\r" CR  \u000D
         *  " "  SPC \u0020
        */
        if (childNodes[i].nodeValue === childNodes[i].nodeValue.replace(/^\s+|\s+$/g, '')) {
          childNodesArr.push(createVTree(childNodes[i], whitespaceRules));
        }
      } else {
        childNodesArr.push(createVTree(childNodes[i], whitespaceRules));
      }
    }

    return childNodesArr;
  }

  if (element.nodeType !== 3) {
    // Tag name.
    vTree.tagName = element.tagName;
  }

  if (element.nodeType === 3) {
    // Text.
    vTree.text = element.nodeValue;
    vTree.version = '2';
    vTree.type = "VirtualText";
  } else {

    if (element.childNodes.length) {
      // Children.
      vTree.children = getChildNodesAsArray(element.childNodes);
    } else {
      vTree.children = [];
    }

    var definedAttributes = getDefinedAttributes(element.attributes);

    if (element.attributes) {

      // Properties.
      vTree.properties = definedAttributes.attr;

      // Namespace.
      vTree.namespace = definedAttributes.namespace ? true : null;

      // Event.
      vTree.event = !!definedAttributes.event;
    }

    var virtualNode = VirtualNode$1(vTree.properties, vTree.children, definedAttributes.key, definedAttributes.namespace, definedAttributes.event);

    vTree.hasThunks = virtualNode.hasThunks;

    vTree.count = virtualNode.count;

    vTree.hasWidgets = virtualNode.hasWidgets;

    vTree.descendantHooks = virtualNode.descendantHooks;

    vTree.hooks = virtualNode.hooks;

    vTree.key = virtualNode.key;

    vTree.version = '2';
    vTree.type = "VirtualNode";
  }

  // Is Virtual Node.
  vTree.virtualNode = true;

  return vTree;
};

var arrayFrom = function () {
  // Production steps of ECMA-262, Edition 6, 22.1.2.1
  // Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
  if (!Array.from) {
    Array.from = function () {
      var toStr = Object.prototype.toString;
      var isCallable = function isCallable(fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function toInteger(value) {
        var number = Number(value);
        if (isNaN(number)) {
          return 0;
        }
        if (number === 0 || !isFinite(number)) {
          return number;
        }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function toLength(value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      // The length property of the from method is 1.
      return function from(arrayLike /*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;

        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError("Array.from requires an array-like object - not null or undefined");
        }

        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);

        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }();
  }
};

arrayFrom();

exports.assembly = assembly;
exports.loop = loop;
exports.or = or;
exports.createNodes = createNodes$1;
exports.eventStore = eventStore$1;
exports.createVirtualNodes = createVTree;

Object.defineProperty(exports, '__esModule', { value: true });

})));
