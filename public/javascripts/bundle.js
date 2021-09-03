
/*!
 * MWF (Moray) v1.3.1
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Copyright 2011-2020 The Bootstrap Authors and Twitter, Inc.
 */

(function(l, r) { return })(window.document);
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mwf = {}));
}(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn) {
	  var module = { exports: {} };
		return fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global$1 =
	  /* global globalThis -- safe */
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$2 && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	var f$4 = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$2(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f$4
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has$1 = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global$1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	var f$3 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has$1(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$3
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global$1, key, value);
	  } catch (error) {
	    global$1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store$1 = global$1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store$1;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap$2 = global$1.WeakMap;

	var nativeWeakMap = typeof WeakMap$2 === 'function' && /native code/.test(inspectSource(WeakMap$2));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.9.1',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id$1 = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id$1 + postfix).toString(36);
	};

	var keys$2 = shared('keys');

	var sharedKey = function (key) {
	  return keys$2[key] || (keys$2[key] = uid(key));
	};

	var hiddenKeys$1 = {};

	var WeakMap$1 = global$1.WeakMap;
	var set, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store = sharedStore.state || (sharedStore.state = new WeakMap$1());
	  var wmget = store.get;
	  var wmhas = store.has;
	  var wmset = store.set;
	  set = function (it, metadata) {
	    metadata.facade = it;
	    wmset.call(store, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store, it) || {};
	  };
	  has = function (it) {
	    return wmhas.call(store, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys$1[STATE] = true;
	  set = function (it, metadata) {
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has$1(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return has$1(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var state;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has$1(value, 'name')) {
	      createNonEnumerableProperty(value, 'name', key);
	    }
	    state = enforceInternalState(value);
	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
	    }
	  }
	  if (O === global$1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global$1;

	var aFunction$1 = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global$1[namespace])
	    : path[namespace] && path[namespace][method] || global$1[namespace] && global$1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor$1 = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.es/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$1 : ceil)(argument);
	};

	var min$4 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min$4(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max$3 = Math.max;
	var min$3 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max$3(integer + length, 0) : min$3(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$4 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$4(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$4(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has$1(hiddenKeys$1, key) && has$1(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has$1(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	var f$1 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys);
	};

	var objectGetOwnPropertyNames = {
		f: f$1
	};

	var f = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has$1(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global$1;
	  } else if (STATIC) {
	    target = global$1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $indexOf = arrayIncludes.indexOf;


	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD$3 = arrayMethodIsStrict('indexOf');

	// `Array.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$3 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	var engineIsNode = classofRaw(global$1.process) == 'process';

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global$1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version$1;

	if (v8) {
	  match = v8.split('.');
	  version$1 = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version$1 = match[1];
	  }
	}

	var engineV8Version = version$1 && +version$1;

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  /* global Symbol -- required for testing */
	  return !Symbol.sham &&
	    // Chrome 38 Symbol has incorrect toString conversion
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    (engineIsNode ? engineV8Version === 38 : engineV8Version > 37 && engineV8Version < 41);
	});

	var useSymbolAsUid = nativeSymbol
	  /* global Symbol -- safe */
	  && !Symbol.sham
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global$1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has$1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
	    if (nativeSymbol && has$1(Symbol$1, name)) {
	      WellKnownSymbolsStore[name] = Symbol$1[name];
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	    }
	  } return WellKnownSymbolsStore[name];
	};

	var SPECIES$5 = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES$5];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var SPECIES$4 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$4] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('splice');

	var max$2 = Math.max;
	var min$2 = Math.min;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.es/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max$2(toInteger(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	var nativeAssign = Object.assign;
	var defineProperty$4 = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$4({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$4(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  /* global Symbol -- required for testing */
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : nativeAssign;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	// a string of all valid unicode whitespaces
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
	  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$3 = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$3(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimend
	  end: createMethod$3(2),
	  // `String.prototype.trim` method
	  // https://tc39.es/ecma262/#sec-string.prototype.trim
	  trim: createMethod$3(3)
	};

	var trim$2 = stringTrim.trim;


	var $parseInt = global$1.parseInt;
	var hex = /^[+-]?0[Xx]/;
	var FORCED$2 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

	// `parseInt` method
	// https://tc39.es/ecma262/#sec-parseint-string-radix
	var numberParseInt = FORCED$2 ? function parseInt(string, radix) {
	  var S = trim$2(String(string));
	  return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
	} : $parseInt;

	// `parseInt` method
	// https://tc39.es/ecma262/#sec-parseint-string-radix
	_export({ global: true, forced: parseInt != numberParseInt }, {
	  parseInt: numberParseInt
	});

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');

	var SPECIES$3 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$3];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var ViewPort = {
	  XS: 0,
	  SM: 540,
	  MD: 860,
	  LG: 1084,
	  XL: 1400
	};
	var DetectionUtil = {
	  detectIE: function detectIE() {
	    /**
	    * detect IE
	    * returns version of IE or false, if browser is not Internet Explorer
	    */
	    var UA = window.navigator.userAgent;
	    var MSIE = UA.indexOf('MSIE ');
	    var TRIDENT = UA.indexOf('Trident/');
	    var EDGE = UA.indexOf('Edge/'); // IE 10 or older => return version number

	    if (MSIE > 0) {
	      return parseInt(UA.slice(MSIE + 5, UA.indexOf('.', MSIE)), 10);
	    } // IE 11 => return version number


	    if (TRIDENT > 0) {
	      var RV = UA.indexOf('rv:');
	      return parseInt(UA.slice(RV + 3, UA.indexOf('.', RV)), 10);
	    } // Edge (IE 12+) => return version number


	    if (EDGE > 0) {
	      return parseInt(UA.slice(EDGE + 5, UA.indexOf('.', EDGE)), 10);
	    } // other browser


	    return false;
	  },

	  /* eslint-disable no-useless-escape, unicorn/better-regex */
	  detectMobile: function detectMobile(includeTabletCheck) {
	    if (includeTabletCheck === void 0) {
	      includeTabletCheck = false;
	    }

	    /**
	    * detect if mobile and/or tablet device
	    * returns bool
	    */
	    var check = false;

	    if (includeTabletCheck) {
	      (function (a) {
	        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.slice(0, 4))) {
	          check = true;
	        }
	      })(navigator.userAgent || navigator.vendor || window.opera);
	    } else {
	      (function (a) {
	        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.slice(0, 4))) {
	          check = true;
	        }
	      })(navigator.userAgent || navigator.vendor || window.opera);
	    }

	    return check;
	  },

	  /**
	  * Gets viewport based on brower's window width.
	  * @return {string} Returns viewport
	  */
	  detectViewport: function detectViewport() {
	    var windowWidth = window.innerWidth;

	    if (windowWidth >= ViewPort.XS && windowWidth < ViewPort.SM) {
	      return 'xs';
	    }

	    if (windowWidth < ViewPort.MD && windowWidth >= ViewPort.SM) {
	      return 'sm';
	    }

	    if (windowWidth < ViewPort.LG && windowWidth >= ViewPort.MD) {
	      return 'md';
	    }

	    if (windowWidth < ViewPort.XL && windowWidth >= ViewPort.LG) {
	      return 'lg';
	    }

	    if (windowWidth >= ViewPort.XL) {
	      return 'xl';
	    }
	  },

	  /* eslint-enable no-useless-escape */
	  isBiDirectional: function isBiDirectional(el) {
	    if (!el) {
	      el = document.querySelector('html');
	    }

	    return el.getAttribute('dir') === 'rtl';
	  }
	};

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _inheritsLoose(subClass, superClass) {
	  subClass.prototype = Object.create(superClass.prototype);
	  subClass.prototype.constructor = subClass;

	  _setPrototypeOf(subClass, superClass);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _objectWithoutPropertiesLoose(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;

	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }

	  return target;
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _createForOfIteratorHelperLoose(o, allowArrayLike) {
	  var it;

	  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
	    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
	      if (it) o = it;
	      var i = 0;
	      return function () {
	        if (i >= o.length) return {
	          done: true
	        };
	        return {
	          done: false,
	          value: o[i++]
	        };
	      };
	    }

	    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }

	  it = o[Symbol.iterator]();
	  return it.next.bind(it);
	}

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	var aFunction = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
	var createMethod$2 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var IS_FILTER_OUT = TYPE == 7;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_OUT ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else switch (TYPE) {
	          case 4: return false;             // every
	          case 7: push.call(target, value); // filterOut
	        }
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$2(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$2(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$2(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$2(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$2(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$2(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$2(6),
	  // `Array.prototype.filterOut` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterOut: createMethod$2(7)
	};

	var $forEach = arrayIteration.forEach;


	var STRICT_METHOD$2 = arrayMethodIsStrict('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	var arrayForEach = !STRICT_METHOD$2 ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	for (var COLLECTION_NAME$1 in domIterables) {
	  var Collection$1 = global$1[COLLECTION_NAME$1];
	  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype$1 && CollectionPrototype$1.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype$1, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype$1.forEach = arrayForEach;
	  }
	}

	var InitializationUtil = {
	  /**
	   * Initialize a component after DOM is loaded
	   * @param {string} selector - DOM selector for component
	   * @param {Function} cbFn - Callback function to initialize the component
	   */
	  initializeComponent: function initializeComponent(selector, cbFn) {
	    document.addEventListener('DOMContentLoaded', function () {
	      document.querySelectorAll(selector).forEach(function (node) {
	        return cbFn(node);
	      });
	    });
	  },

	  /**
	   * Iterate over list to add event listeners
	   * @param {array} eventList - List of event maps
	   */
	  addEvents: function addEvents(eventList) {
	    for (var _iterator = _createForOfIteratorHelperLoose(eventList), _step; !(_step = _iterator()).done;) {
	      var obj = _step.value;

	      if (typeof obj.options === 'undefined') {
	        obj.options = {};
	      }

	      obj.el.addEventListener(obj.type, obj.handler, obj.options);
	    }
	  },

	  /**
	   * Iterate over list to remove event listeners
	   * @param {array} eventList - List of event maps
	   */
	  removeEvents: function removeEvents(eventList) {
	    for (var _iterator2 = _createForOfIteratorHelperLoose(eventList), _step2; !(_step2 = _iterator2()).done;) {
	      var obj = _step2.value;
	      obj.el.removeEventListener(obj.type, obj.handler);
	    }
	  },

	  /**
	   * Tears down each in a list of mwf component instances
	   * @param {Array} componentList an array of mwf component instance
	   */
	  tearDownComponentList: function tearDownComponentList(componentList) {
	    if (Array.isArray(componentList)) {
	      var component;

	      while (componentList.length > 0) {
	        component = componentList.pop();

	        if (typeof component.remove === 'function') {
	          component.remove();
	        }
	      }
	    }
	  }
	};

	var nativeJoin = [].join;

	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD$1 = arrayMethodIsStrict('join', ',');

	// `Array.prototype.join` method
	// https://tc39.es/ecma262/#sec-array.prototype.join
	_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$1 }, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG$3] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var TO_STRING = 'toString';
	var RegExpPrototype$1 = RegExp.prototype;
	var nativeToString = RegExpPrototype$1[TO_STRING];

	var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = nativeToString.name != TO_STRING;

	// `RegExp.prototype.toString` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$1) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	var $filter = arrayIteration.filter;


	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

	// `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject -- old IE */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys$1[IE_PROTO$1] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype$1 = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype$1, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype$1[UNSCOPABLES][key] = true;
	};

	var $includes = arrayIncludes.includes;


	// `Array.prototype.includes` method
	// https://tc39.es/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');

	var MATCH$2 = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH$2]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (error1) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (error2) { /* empty */ }
	  } return false;
	};

	// `String.prototype.includes` method
	// https://tc39.es/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~String(requireObjectCoercible(this))
	      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var iterators = {};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO = sharedKey('IE_PROTO');
	var ObjectPrototype = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has$1(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype : null;
	};

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS$1 = false;

	var returnThis$2 = function () { return this; };

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype$2[ITERATOR$5].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if (!has$1(IteratorPrototype$2, ITERATOR$5)) {
	  createNonEnumerableProperty(IteratorPrototype$2, ITERATOR$5, returnThis$2);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

	var defineProperty$3 = objectDefineProperty.f;



	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has$1(it = STATIC ? it : it.prototype, TO_STRING_TAG$1)) {
	    defineProperty$3(it, TO_STRING_TAG$1, { configurable: true, value: TAG });
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	/* eslint-disable no-proto -- safe */

	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var IteratorPrototype = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$4]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
	          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;
	    defaultIterator = function values() { return nativeIterator.call(this); };
	  }

	  // define iterator
	  if (IterablePrototype[ITERATOR$4] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
	  }
	  iterators[NAME] = defaultIterator;

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$3 = internalState.set;
	var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState$3(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$1(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
	iterators.Arguments = iterators.Array;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global$1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR$3] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype, ITERATOR$3, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR$3] = ArrayValues;
	    }
	    if (!CollectionPrototype[TO_STRING_TAG]) {
	      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
	    }
	    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      }
	    }
	  }
	}

	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails(function () {
	    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
	  });
	};

	var $trim = stringTrim.trim;


	// `String.prototype.trim` method
	// https://tc39.es/ecma262/#sec-string.prototype.trim
	_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var selectors = ['input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'a[href]', 'button:not([disabled])', '[tabindex]', 'audio[controls]', 'video[controls]', '[contenteditable]:not([contenteditable="false"])'];
	var HelpersUtil = {
	  getTabbableElements: function getTabbableElements(node) {
	    if (node === void 0) {
	      node = document;
	    }

	    var elements = [].slice.call(node.querySelectorAll(selectors.join(', ')));
	    var tabbable = [];

	    for (var i = 0; i < elements.length; i++) {
	      var el = elements[i];

	      if (!el.disabled) {
	        tabbable.push(el);
	      }
	    }

	    return tabbable;
	  },
	  isElementTabbable: function isElementTabbable(node) {
	    return node.matches(selectors.join(', '));
	  },
	  getUid: function getUid() {
	    // Convert random number to base 36 (numbers + letters),
	    // and grab the first 9 characters after the decimal.
	    return Math.random().toString(36).slice(2, 9);
	  },

	  /**
	  * Returns array of tabbable elements filtered by tabindex
	  * @param {node} node container to search, default is document
	  * @returns {NodeList} returns focusable elements
	  */
	  getFocusableElements: function getFocusableElements(node) {
	    if (node === void 0) {
	      node = document;
	    }

	    return this.getTabbableElements(node).filter(function (e) {
	      return !e.attributes.tabindex || e.attributes.tabindex.value >= 0;
	    });
	  },

	  /**
	  * Returns outer height of element, includes element offsetHeight
	  * @param {node}       node container to search
	  * @param {object}     options
	  * @param {string[]}   options.cssSelectors array of css properties
	  * @example
	  *   const options = { cssSelectors: ['margin', 'padding'] };
	  *   const options = { cssSelectors: ['marginTop'] };
	  * @returns {number}   returns height value
	  */
	  getElementOuterHeight: function getElementOuterHeight(node, options) {
	    if (options === void 0) {
	      options = null;
	    }

	    var computedNodeStyles = getComputedStyle(node);

	    if (!options) {
	      return computedNodeStyles.offsetHeight;
	    }

	    var outerHeight = node.offsetHeight;
	    options.cssSelectors.forEach(function (selector) {
	      // if no values are specified, calculate spacing for the top and bottom
	      if (!selector.toLowerCase().includes('top') && !selector.toLowerCase().includes('bottom')) {
	        outerHeight += parseInt(computedNodeStyles[selector + 'Top'], 10) + parseInt(computedNodeStyles[selector + 'Bottom'], 10);
	      } else if (selector.values.length > 0) {
	        outerHeight += parseInt(computedNodeStyles[selector], 10);
	      }
	    });
	    return outerHeight;
	  },

	  /**
	  * Returns outer width of element, includes element offsetWidth
	  * @param {node}       node container to search
	  * @param {object}     options
	  * @param {string[]}   options.cssSelectors array of css properties
	  * @example
	  *   const options = { cssSelectors: ['margin', 'padding'] };
	  *   const options = { cssSelectors: ['marginLeft'] };
	  * @returns {number}   returns width value
	  */
	  getElementOuterWidth: function getElementOuterWidth(node, options) {
	    if (options === void 0) {
	      options = null;
	    }

	    var computedNodeStyles = getComputedStyle(node);

	    if (!options) {
	      return computedNodeStyles.offsetWidth;
	    }

	    var outerWidth = node.offsetWidth;
	    options.cssSelectors.forEach(function (selector) {
	      // if no values are specifed, calculate spacing for the left and right
	      if (!selector.toLowerCase().includes('left') && !selector.toLowerCase().includes('right')) {
	        outerWidth += parseInt(computedNodeStyles[selector + 'Left'], 10) + parseInt(computedNodeStyles[selector + 'Right'], 10);
	      } else if (selector.values.length > 0) {
	        outerWidth += parseInt(computedNodeStyles[selector], 10);
	      }
	    });
	    return outerWidth;
	  },

	  /**
	   * Returns the element pointed to from a data-target attribute
	   * @param {node} element element with the data-target attribute
	   * @returns {node} returns the element
	   */
	  getSelectorFromElement: function getSelectorFromElement(element) {
	    var selector = element.getAttribute('data-target');

	    if (!selector || selector === '#') {
	      var hrefAttr = element.getAttribute('href');
	      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
	    }

	    try {
	      return document.querySelector(selector) ? selector : null;
	    } catch (_unused) {
	      return null;
	    }
	  },

	  /**
	   * Gets the offset height of the element
	   * @param {node} element the element
	   * @returns {number} returns the offset height
	   */
	  reflow: function reflow(element) {
	    return element.offsetHeight;
	  }
	};

	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.
	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y$2 = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
		UNSUPPORTED_Y: UNSUPPORTED_Y$2,
		BROKEN_CARET: BROKEN_CARET
	};

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	// eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	// `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec
	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points







	var SPECIES$2 = wellKnownSymbol('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	var REPLACE = wellKnownSymbol('replace');
	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$2] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !(
	      REPLACE_SUPPORTS_NAMED_GROUPS &&
	      REPLACE_KEEPS_$0 &&
	      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    )) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$1 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$1(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$1(true)
	};

	var charAt$1 = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt$1(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	// @@match logic
	fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.es/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible(this);
	      var matcher = regexp == undefined ? undefined : regexp[MATCH];
	      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
	    function (regexp) {
	      var res = maybeCallNative(nativeMatch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);

	      if (!rx.global) return regexpExecAbstract(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regexpExecAbstract(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	var ColorUtil = {
	  /**
	     * Calulates the YIQ of the color
	     * @param {object} rgb The RGB notation of the color
	     * @returns {null} null
	     */
	  getYiq: function getYiq(_ref) {
	    var r = _ref.r,
	        g = _ref.g,
	        b = _ref.b;
	    return (r * 299 + g * 587 + b * 114) / 1000;
	  },

	  /**
	     * Gets the RGB object notation for a string
	     * @param {string} str a string respresenting a css rgb value
	     * @returns {object} an object for rgb notation
	     */
	  getRGB: function getRGB(str) {
	    var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d\.\d?)\))?/);
	    return match ? {
	      r: match[1],
	      g: match[2],
	      b: match[3]
	    } : {};
	  }
	};

	var KeyboardUtil = {
	  keyCodes: {
	    ARROW_DOWN: 40,
	    ARROW_UP: 38,
	    ARROW_LEFT: 37,
	    ARROW_RIGHT: 39,
	    ENTER: 13,
	    ESC: 27,
	    SPACE: 32,
	    BACKSPACE: 8,
	    TAB: 9
	  },
	  getKeyCode: function getKeyCode(e) {
	    return e.which || e.keyCode || 0;
	  }
	};

	var floor = Math.floor;
	var replace = ''.replace;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

	// https://tc39.es/ecma262/#sec-getsubstitution
	var getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
	  var tailPos = position + matched.length;
	  var m = captures.length;
	  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	  if (namedCaptures !== undefined) {
	    namedCaptures = toObject(namedCaptures);
	    symbols = SUBSTITUTION_SYMBOLS;
	  }
	  return replace.call(replacement, symbols, function (match, ch) {
	    var capture;
	    switch (ch.charAt(0)) {
	      case '$': return '$';
	      case '&': return matched;
	      case '`': return str.slice(0, position);
	      case "'": return str.slice(tailPos);
	      case '<':
	        capture = namedCaptures[ch.slice(1, -1)];
	        break;
	      default: // \d\d?
	        var n = +ch;
	        if (n === 0) return match;
	        if (n > m) {
	          var f = floor(n / 10);
	          if (f === 0) return match;
	          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	          return match;
	        }
	        capture = captures[n - 1];
	    }
	    return capture === undefined ? '' : capture;
	  });
	};

	var max = Math.max;
	var min$1 = Math.min;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
	  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
	  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.es/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible(this);
	      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return replacer !== undefined
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      if (
	        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
	        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
	      ) {
	        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	        if (res.done) return res.value;
	      }

	      var rx = anObject(regexp);
	      var S = String(this);

	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regexpExecAbstract(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = String(result[0]);
	        var position = max(min$1(toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];
	});

	var StringUtil = {
	  /**
	   * Interpolate a string.
	   * @param {string} template - The template string to interpolate, with keys in the format %{key}.
	   * @param {object} data - An object containing the keys and values to replace in the template.
	   * @returns {string} - The interpolated string.
	   */
	  interpolateString: function interpolateString(template, data) {
	    return template.replace(/%{(\w+)}/g, function (match, key) {
	      if (Object.prototype.hasOwnProperty.call(data, key)) {
	        return data[key];
	      } // %{key} not found, show a warning in the console and return an empty string
	      // eslint-disable-next-line no-console


	      console.warn("Template error, %{" + key + "} not found:", template);
	      return '';
	    });
	  }
	};

	var EventName$j = {
	  ON_REMOVE: 'onRemove'
	};
	var focusControls = [];
	/**
	 * Class representing Focus Controls.
	 * Solve for Firefox bug where following on-page anchor links loses focus:
	 * https://bugzilla.mozilla.org/show_bug.cgi?id=308064
	 * https://bugzilla.mozilla.org/show_bug.cgi?id=277178
	 */

	var FocusControls = /*#__PURE__*/function () {
	  /**
	   * Initialize focus controls.
	   * @param {Object} opts - The focus control options.
	   * @param {Node} opts.el - The anchor element node, must have href attribute with fragment identifier.
	   */
	  function FocusControls(opts) {
	    var _this = this;

	    this.el = opts.el;
	    this.target = document.querySelector(this.el.getAttribute('href'));
	    this.events = [{
	      el: this.el,
	      type: 'click',
	      handler: function handler(e) {
	        _this.onClick(e);
	      }
	    }]; // Add event handlers.

	    InitializationUtil.addEvents(this.events); // Create custom events.

	    this[EventName$j.ON_REMOVE] = new CustomEvent(EventName$j.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	    focusControls.push(this);
	  }
	  /**
	   * Click event.
	   * @param {Event} e - The event object.
	   */


	  var _proto = FocusControls.prototype;

	  _proto.onClick = function onClick(e) {
	    e.preventDefault();
	    this.target.focus();
	  }
	  /**
	   * Remove the focus controls and events.
	   */
	  ;

	  _proto.remove = function remove() {
	    // Remove event handlers
	    InitializationUtil.removeEvents(this.events);
	    this.el.dispatchEvent(this[EventName$j.ON_REMOVE]); // remove this focus controls reference from array of instances

	    var index = focusControls.indexOf(this);
	    focusControls.splice(index, 1);
	  }
	  /**
	   * Get an array of focus controls instances.
	   * @returns {Object[]} Array of focus controls instances.
	   */
	  ;

	  FocusControls.getInstances = function getInstances() {
	    return focusControls;
	  };

	  return FocusControls;
	}();

	var trim$1 = stringTrim.trim;


	var $parseFloat = global$1.parseFloat;
	var FORCED$1 = 1 / $parseFloat(whitespaces + '-0') !== -Infinity;

	// `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string
	var numberParseFloat = FORCED$1 ? function parseFloat(string) {
	  var trimmedString = trim$1(String(string));
	  var result = $parseFloat(trimmedString);
	  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
	} : $parseFloat;

	// `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string
	_export({ global: true, forced: parseFloat != numberParseFloat }, {
	  parseFloat: numberParseFloat
	});

	var SPECIES$1 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$1]) == undefined ? defaultConstructor : aFunction(S);
	};

	var arrayPush = [].push;
	var min = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF;

	// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
	var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

	// @@split logic
	fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    // eslint-disable-next-line regexp/no-empty-group -- required for testing
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
	    // eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
	    '.'.split(/()()/).length > 1 ||
	    ''.split(/.?/).length
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string];
	      // If `separator` is not a regex, use native split
	      if (!isRegexp(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }
	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output.length > lim ? output.slice(0, lim) : output;
	    };
	  // Chakra, V8
	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [
	    // `String.prototype.split` method
	    // https://tc39.es/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = requireObjectCoercible(this);
	      var splitter = separator == undefined ? undefined : separator[SPLIT];
	      return splitter !== undefined
	        ? splitter.call(separator, O, limit)
	        : internalSplit.call(String(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (regexp, limit) {
	      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);
	      var C = speciesConstructor(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (SUPPORTS_Y ? 'y' : 'g');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = SUPPORTS_Y ? q : 0;
	        var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	        var e;
	        if (
	          z === null ||
	          (e = min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
	        ) {
	          q = advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          A.push(S.slice(p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            A.push(z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      A.push(S.slice(p));
	      return A;
	    }
	  ];
	}, !SUPPORTS_Y);

	var TRANSITION_END = 'transitionend';
	/**
	 * Gets the transition duration from an element's styles
	 * @param {node} element - element
	 * @returns {number} - transition duration in milliseconds
	 */

	var getTransitionDurationFromElement = function getTransitionDurationFromElement(element) {
	  var MILLISECONDS_MULTIPLIER = 1000;

	  if (!element) {
	    return 0;
	  } // Get transition-duration of the element


	  var transitionDuration = getComputedStyle(element)['transition-duration'];
	  var transitionDelay = getComputedStyle(element)['transition-delay'];
	  var floatTransitionDuration = parseFloat(transitionDuration);
	  var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

	  if (!floatTransitionDuration && !floatTransitionDelay) {
	    return 0;
	  } // If multiple durations are defined, take the first


	  transitionDuration = transitionDuration.split(',')[0];
	  transitionDelay = transitionDelay.split(',')[0];
	  return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
	};
	/**
	 * Dispatches a transition-end event.
	 * @param {node} element - element on which to dispatch event
	 */


	var triggerTransitionEnd = function triggerTransitionEnd(element) {
	  element.dispatchEvent(new Event(TRANSITION_END));
	};
	/**
	 * Ensures transition-end is triggered on an element.
	 * @param {node} element - element on which transition occurs
	 * @param {number} duration - transition duration in milliseconds
	 */


	var emulateTransitionEnd = function emulateTransitionEnd(element, duration) {
	  var called = false;
	  var durationPadding = 5;
	  var emulatedDuration = duration + durationPadding;

	  function listener() {
	    called = true;
	    element.removeEventListener(TRANSITION_END, listener);
	  }

	  element.addEventListener(TRANSITION_END, listener);
	  setTimeout(function () {
	    if (!called) {
	      triggerTransitionEnd(element);
	    }
	  }, emulatedDuration);
	};

	var TransitionUtil = {
	  TRANSITION_END: TRANSITION_END,
	  getTransitionDurationFromElement: getTransitionDurationFromElement,
	  triggerTransitionEnd: triggerTransitionEnd,
	  emulateTransitionEnd: emulateTransitionEnd
	};

	var Util = Object.assign({}, DetectionUtil, HelpersUtil, InitializationUtil, ColorUtil, KeyboardUtil, StringUtil, {
	  FocusControls: FocusControls
	}, TransitionUtil);

	var instances$4 = [];
	var Selector$k = {
	  ALERT: '.alert-dismissible, [data-mount="alert-dismissible"]',
	  DISMISS: '[data-dismiss="alert"]'
	};
	var EventName$i = {
	  CLOSE: 'onClose',
	  CLOSED: 'onClosed',
	  ON_REMOVE: 'onRemove'
	};
	var ClassName$f = {
	  FADE: 'fade',
	  SHOW: 'show'
	};

	function _triggerCloseEvent(element) {
	  element.dispatchEvent(this[EventName$i.CLOSE]);
	}

	function _removeElement(element) {
	  var _this = this;

	  element.classList.remove(ClassName$f.SHOW);

	  if (!element.classList.contains(ClassName$f.FADE)) {
	    _destroyElement.bind(this)(element);

	    return;
	  }

	  var transitionDuration = Util.getTransitionDurationFromElement(element);
	  element.addEventListener(Util.TRANSITION_END, function (event) {
	    return _destroyElement.bind(_this)(element, event);
	  }, {
	    once: true
	  });
	  Util.emulateTransitionEnd(element, transitionDuration);
	}

	function _destroyElement(element) {
	  element.dispatchEvent(this[EventName$i.CLOSED]);
	  element.remove();
	}

	var Alert = /*#__PURE__*/function () {
	  function Alert(opts) {
	    var _this2 = this;

	    this.el = opts.el;
	    this.dismiss = this.el.querySelector(Selector$k.DISMISS); // Custom Events

	    this[EventName$i.CLOSE] = new CustomEvent(EventName$i.CLOSE);
	    this[EventName$i.CLOSED] = new CustomEvent(EventName$i.CLOSED);
	    this[EventName$i.ON_REMOVE] = new CustomEvent(EventName$i.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    }); // Add event handlers

	    if (this.dismiss) {
	      this.events = [{
	        el: this.dismiss,
	        type: 'click',
	        handler: function handler() {
	          _this2.close();
	        }
	      }];
	      Util.addEvents(this.events);
	    }

	    instances$4.push(this);
	  }
	  /**
	   * Perform a close action
	   */


	  var _proto = Alert.prototype;

	  _proto.close = function close() {
	    var rootElement = this.el;

	    _triggerCloseEvent.bind(this)(rootElement);

	    _removeElement.bind(this)(rootElement);
	  }
	  /**
	   * Remove the instance
	   */
	  ;

	  _proto.remove = function remove() {
	    Util.removeEvents(this.events);
	    this.el.dispatchEvent(this[EventName$i.ON_REMOVE]);
	    var index = instances$4.indexOf(this);
	    instances$4.splice(index, 1);
	  }
	  /**
	   * Get alert instances.
	   * @returns {Object[]} An array of alert instances
	   */
	  ;

	  Alert.getInstances = function getInstances() {
	    return instances$4;
	  };

	  return Alert;
	}();

	(function () {
	  Util.initializeComponent(Selector$k.ALERT, function (node) {
	    return new Alert({
	      el: node
	    });
	  });
	})();

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    typeof (NewTarget = dummy.constructor) == 'function' &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var SPECIES = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES]) {
	    defineProperty(Constructor, SPECIES, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var defineProperty$2 = objectDefineProperty.f;
	var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;





	var setInternalState$2 = internalState.set;



	var MATCH = wellKnownSymbol('match');
	var NativeRegExp = global$1.RegExp;
	var RegExpPrototype = NativeRegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var UNSUPPORTED_Y = regexpStickyHelpers.UNSUPPORTED_Y;

	var FORCED = descriptors && isForced_1('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y || fails(function () {
	  re2[MATCH] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	})));

	// `RegExp` constructor
	// https://tc39.es/ecma262/#sec-regexp-constructor
	if (FORCED) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = this instanceof RegExpWrapper;
	    var patternIsRegExp = isRegexp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var sticky;

	    if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
	      return pattern;
	    }

	    if (CORRECT_NEW) {
	      if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
	    } else if (pattern instanceof RegExpWrapper) {
	      if (flagsAreUndefined) flags = regexpFlags.call(pattern);
	      pattern = pattern.source;
	    }

	    if (UNSUPPORTED_Y) {
	      sticky = !!flags && flags.indexOf('y') > -1;
	      if (sticky) flags = flags.replace(/y/g, '');
	    }

	    var result = inheritIfRequired(
	      CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
	      thisIsRegExp ? this : RegExpPrototype,
	      RegExpWrapper
	    );

	    if (UNSUPPORTED_Y && sticky) setInternalState$2(result, { sticky: sticky });

	    return result;
	  };
	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$2(RegExpWrapper, key, {
	      configurable: true,
	      get: function () { return NativeRegExp[key]; },
	      set: function (it) { NativeRegExp[key] = it; }
	    });
	  };
	  var keys$1 = getOwnPropertyNames$1(NativeRegExp);
	  var index = 0;
	  while (keys$1.length > index) proxy(keys$1[index++]);
	  RegExpPrototype.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype;
	  redefine(global$1, 'RegExp', RegExpWrapper);
	}

	// https://tc39.es/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	/*
	 * @constant
	 * @type {string}
	 */

	var Config = {
	  DEFAULT_SEARCH_RESULT: 10
	};
	var autocompleteInstances = [];
	var Selector$j = {
	  RESULT_LIST: '.result-list',
	  RESULTS_CONTAINER: '.search-results-container',
	  SEARCH_INPUT: '.search-input',
	  RESULT_STATUS: '.result-status',
	  LIST_FIRST_CHILD: 'li:first-child',
	  LIST_SELECTED: 'li.selected'
	};
	var Messages = {
	  // default message is set, if custom message not set.
	  RESULTS_TEMPLATE_MANY: '%{numResults} results are available, use up and down arrow keys to navigate',
	  RESULTS_TEMPLATE_ONE: '%{numResults} result is available, use up and down arrow keys to navigate',
	  NO_RESULTS: 'No results are available'
	};
	var Errors = {
	  DATA_TYPE_ERROR: 'Data must be of type Array[<string>] or Array[{value: <string>}]'
	};
	var ClassName$e = {
	  ACTIVE: 'active',
	  SELECTED: 'selected'
	};
	var EventName$h = {
	  ON_CLOSE: 'onClose',
	  ON_OPEN: 'onOpen',
	  ON_UPDATE: 'onUpdate',
	  ON_REMOVE: 'onRemove'
	};
	/*
	* filter the data.
	*/

	function _filterData(data) {
	  var re = _getSearchPattern.bind(this)();

	  return data.filter(function (item) {
	    if (typeof item === 'object' && re.test(item.value) || typeof item === 'string' && re.test(item)) {
	      return item;
	    }

	    return false;
	  });
	}
	/*
	* fetch the data to li tag.
	*/


	function _fetchData(data) {
	  var _this = this;

	  // data is an array of results
	  var searchData = data.slice(0, Config.DEFAULT_SEARCH_RESULT);
	  var targetHtmlContainer = '';
	  var str = null;
	  var resultsMessage; // if the length of sesarchData is 0, there are no results

	  if (searchData.length > 0 && this.searchInput.value !== '') {
	    searchData.forEach(function (item) {
	      if (typeof item === 'string') {
	        str = item;
	      } else if (typeof item === 'object') {
	        str = item.value;
	      }

	      targetHtmlContainer += '<li class="result"  role="option" tabindex="-1">' + _highlightMatch.bind(_this)(str) + '</li>';
	    });
	    resultsMessage = Util.interpolateString(searchData.length > 1 ? this.resultsAvailableTemplateMany : this.resultsAvailableTemplateOne, {
	      numResults: searchData.length
	    });

	    if (!this.shown) {
	      this.open();
	    }
	  } else {
	    this.close();
	    resultsMessage = this.noResultsMsg;
	  }

	  this.target.innerHTML = targetHtmlContainer;
	  /* Sets sr_only message for a11y */

	  this.container.querySelector(Selector$j.RESULT_STATUS).textContent = resultsMessage;
	}
	/*
	* populates the selected matching values
	*/


	function _populateSelect() {
	  var filteredSearchData = this.suggestedData;

	  if (typeof this.suggestedData === 'object') {
	    if (this.filter === 'true') {
	      filteredSearchData = _filterData.bind(this)(filteredSearchData);
	    }

	    _fetchData.bind(this)(filteredSearchData);
	  }
	}
	/**
	  @func _clearSuggestionsMenu
	  @desc Clears the results from the suggestions menu.
	  @this AutoComplete
	*/


	function _clearSuggestionsMenu() {
	  this.target.innerHTML = '';
	  this.container.querySelector(Selector$j.RESULT_STATUS).textContent = '';
	}
	/**
	  @func _getSearchPattern
	  @desc Returns a new regular expression object from the internal searchInput property.
	  @returns {RegExp} Regular expression object with the autocomplete's searchInput value as the source.
	  @this AutoComplete
	*/


	function _getSearchPattern() {
	  /* replacing instances of regex characters with string literals to disable use of regular expressions in search input */
	  var re = /([()*+.?\\])/gi;
	  var sanitizedInput = this.searchInput.value.replace(re, '\\$&');
	  /* Second parameter flags - 'g': global (matches multiple instances in string), 'i': case insensitive */

	  /* \\b used to only begin match at start of a word (rather than matching a character in the middle of a word) */

	  /* \\s used to allow matching of accepted special characters (e.g. &) when in between words */

	  return new RegExp('\\b\\s?' + sanitizedInput, 'gi');
	}
	/**
	  @func _setSuggestionItemSelectedStatus
	  @desc Given a string, returns the same string with a <strong> tag encapsulating the matching substring.
	  @param {string} str - String used to create the regex for matching.
	  @returns {string} String with a <strong> tag encapsulating matched sub string.
	  @this AutoComplete
	*/


	function _highlightMatch(str) {
	  var re = _getSearchPattern.bind(this)();

	  return str.replace(re, '<strong>$&</strong>');
	}
	/**
	  @func _removeSuggestionItemSelectedStatus
	  @desc Removes the HTML classes and attributes used to markup the "selected" status for suggestions (li elements) displayed in the auto suggestion menu (ul element, this.target).
	  @param {Node} element - HTML element that should remove classes/attributes for showing "selected" status
	*/


	function _removeSuggestionItemSelectedStatus(element) {
	  element.classList.remove(ClassName$e.SELECTED);
	  element.removeAttribute('aria-selected');
	}
	/**
	  @func _setSuggestionItemSelectedStatus
	  @desc Sets the HTML classes and attributes used to markup the "selected" status for suggestions (li elements) displayed in the auto suggestion menu (ul element, this.target).
	  @param {Node} element - HTML element that should receive classes/attributes for showing "selected" status
	*/


	function _setSuggestionItemSelectedStatus(element) {
	  element.classList.add(ClassName$e.SELECTED);
	  element.setAttribute('aria-selected', true);
	  element.focus();
	}
	/**
	  @func _verifyData
	  @desc Verifies that the passed in parameter is either Array[<string>] or Array[{value: <string>}]
	  @param {Array} data - Data to verify.
	  @returns {boolean} Whether the data has the correct structure.
	*/


	function _verifyData(data) {
	  if (Array.isArray(data) && data.every(function (entry) {
	    return typeof entry === 'string' || typeof entry === 'object' && Object.keys(entry).includes('value') && typeof entry.value === 'string';
	  })) {
	    return true;
	  }

	  return false;
	}
	/***********/

	/* EVENTS */

	/***********/

	/*
	* close suggested list.
	*/


	function _onDocumentClick(e) {
	  if (e.target !== this.searchInput && e.target !== this.searchResultsContainer) {
	    var _target = this.target;

	    _target.classList.remove(ClassName$e.ACTIVE);

	    this.searchInput.setAttribute('aria-expanded', false);
	  }
	}
	/*
	* after entering the data,populating the value through populateSelect function
	* @param {object} e - present event
	*/


	function _onSearchInputInput(e) {
	  if (this.searchInput.value === '') {
	    _clearSuggestionsMenu.bind(this)(e);

	    if (this.shown) {
	      this.close();
	    }
	  } else {
	    _populateSelect.bind(this)(e);
	  }
	}
	/**
	  @func _onSearchInputKeyDown
	  @desc Handles keydown event for arrow down.
	  @param {Event} e - Keydown event attached to this.searchInput
	  @this AutoComplete
	*/


	function _onSearchInputKeyDown(e) {
	  var suggestionMenu = this.target;

	  if (e.keyCode === Util.keyCodes.ARROW_DOWN && suggestionMenu.children.length > 0) {
	    this.open();

	    _setSuggestionItemSelectedStatus(suggestionMenu.querySelector(Selector$j.LIST_FIRST_CHILD));
	  }

	  if (e.keyCode === Util.keyCodes.TAB && this.shown) {
	    this.close();
	  }
	}
	/**
	  @func _onSearchInputFocus
	  @desc Sets the cursor position to the end of the text when focus is set to the input element
	  @this AutoComplete
	*/


	function _onSearchInputFocus() {
	  /* Requires 2 parameters */
	  this.searchInput.setSelectionRange(this.searchInput.value.length, this.searchInput.value.length);
	}
	/**
	  @func _onSuggestionMenuKeyDown
	  @desc Handles keydown events for backspace, arrow right, and character input.
	Is attached to this.target (ul with suggestions that appears underneath input) during initializaiton.
	  @param {Event} e
	  @this AutoComplete
	*/


	function _onSuggestionMenuKeyDown(e) {
	  if (this.target.classList.contains(ClassName$e.ACTIVE)) {
	    var _target = this.target;

	    var selected = _target.querySelector(Selector$j.LIST_SELECTED);

	    var prevSibling;

	    switch (e.keyCode) {
	      case Util.keyCodes.ARROW_UP:
	        if (selected) {
	          prevSibling = selected.previousElementSibling;

	          _removeSuggestionItemSelectedStatus(selected);

	          if (prevSibling) {
	            _setSuggestionItemSelectedStatus(prevSibling);
	          } else {
	            this.searchInput.focus();
	          }
	        }

	        break;

	      case Util.keyCodes.ARROW_DOWN:
	        if (_target.querySelector('li') && !_target.querySelector(Selector$j.LIST_SELECTED)) {
	          var firstLiElement = _target.querySelector(Selector$j.LIST_FIRST_CHILD);

	          _setSuggestionItemSelectedStatus(firstLiElement);
	        } else {
	          var nextSibling = null;
	          nextSibling = selected.nextElementSibling;

	          if (nextSibling) {
	            _removeSuggestionItemSelectedStatus(selected);

	            _setSuggestionItemSelectedStatus(nextSibling);
	          }
	        }

	        break;

	      case Util.keyCodes.ARROW_RIGHT:
	      case Util.keyCodes.BACKSPACE:
	        this.searchInput.focus();
	        break;

	      case Util.keyCodes.ENTER:
	        if (selected) {
	          this.searchInput.value = selected.textContent;

	          _clearSuggestionsMenu.bind(this)();

	          this.searchInput.focus();
	          this.close();
	          e.preventDefault();
	        }

	        break;

	      case Util.keyCodes.ESC:
	        this.searchInput.value = '';
	        this.searchInput.focus();

	        _clearSuggestionsMenu.bind(this)();

	        break;

	      case Util.keyCodes.TAB:
	        this.close();
	        this.searchInput.focus();

	        _removeSuggestionItemSelectedStatus(selected);

	        break;

	      default:
	        if (e.key.length === 1) {
	          this.searchInput.focus();
	        }

	        break;
	    }
	  }
	}
	/*
	* fetch the suggested data from drop down to the autocomplete
	* @param {object} e - present event
	*/


	function _onSuggestionMenuMouseUp(e) {
	  this.searchInput.value = e.target.textContent;

	  _clearSuggestionsMenu.bind(this)();

	  this.searchInput.focus();
	  this.close();
	  e.stopPropagation();
	}
	/*
	 * Class representing a Autocomplete.
	 */


	var AutoComplete = /*#__PURE__*/function () {
	  /**
	   * Create the Autocomplete.
	   @param {Object} opts - The autocomplete options.
	   @param {Node} opts.target - The autocomplete DOM node.
	   @throws {TypeError} Will throw a TypeError when opts.data is not of type Array[<string>] or Array[{value: <string>}]
	   */
	  function AutoComplete(opts) {
	    this.container = opts.target; // defaults to a sr message for en locales if none is provided

	    this.resultsAvailableTemplateMany = opts.multipleResultsMsg || Messages.RESULTS_TEMPLATE_MANY;
	    this.resultsAvailableTemplateOne = opts.oneResultMsg || Messages.RESULTS_TEMPLATE_ONE;
	    this.noResultsMsg = opts.noResultsMsg || Messages.NO_RESULTS;
	    this.filter = opts.filter || opts.target.getAttribute('data-filter') || true;

	    if (_verifyData(opts.data)) {
	      this.suggestedData = opts.data;
	    } else {
	      throw new TypeError(Errors.DATA_TYPE_ERROR);
	    }

	    this.target = opts.target.querySelector(Selector$j.RESULT_LIST);
	    this.searchResultsContainer = this.container.querySelector(Selector$j.RESULTS_CONTAINER);
	    this.searchInput = this.container.querySelector(Selector$j.SEARCH_INPUT);
	    this.shown = false;
	    autocompleteInstances.push(this); // Add event handlers.

	    this.events = [{
	      el: document,
	      type: 'click',
	      handler: _onDocumentClick.bind(this)
	    }, {
	      el: this.searchInput,
	      type: 'input',
	      handler: _onSearchInputInput.bind(this)
	    }, {
	      el: this.searchInput,
	      type: 'keydown',
	      handler: _onSearchInputKeyDown.bind(this)
	    }, {
	      el: this.searchInput,
	      type: 'focus',
	      handler: _onSearchInputFocus.bind(this)
	    }, {
	      el: this.target,
	      type: 'mouseup',
	      handler: _onSuggestionMenuMouseUp.bind(this)
	    }, {
	      el: this.target,
	      type: 'keydown',
	      handler: _onSuggestionMenuKeyDown.bind(this)
	    }];
	    Util.addEvents(this.events); // Create custom events.

	    this[EventName$h.ON_CLOSE] = new CustomEvent(EventName$h.ON_CLOSE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$h.ON_OPEN] = new CustomEvent(EventName$h.ON_OPEN, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$h.ON_UPDATE] = new CustomEvent(EventName$h.ON_UPDATE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$h.ON_REMOVE] = new CustomEvent(EventName$h.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	  }
	  /*
	   * Get an array of autocomplete instances.
	   * @returns {Object[]} Array of search instances.
	   */


	  AutoComplete.getInstances = function getInstances() {
	    return autocompleteInstances;
	  }
	  /**
	  @func open
	  @desc Opens the suggestions menu.
	  @this AutoComplete
	  */
	  ;

	  var _proto = AutoComplete.prototype;

	  _proto.open = function open() {
	    this.shown = true;
	    this.target.classList.add(ClassName$e.ACTIVE);
	    this.searchInput.setAttribute('aria-expanded', true);
	    this.container.dispatchEvent(this[EventName$h.ON_OPEN]);
	  }
	  /**
	  @func close
	  @desc Closes the suggestions menu.
	  @this AutoComplete
	  */
	  ;

	  _proto.close = function close() {
	    this.shown = false;
	    this.target.classList.remove(ClassName$e.ACTIVE);
	    this.searchInput.setAttribute('aria-expanded', false);
	    this.container.dispatchEvent(this[EventName$h.ON_CLOSE]);
	  }
	  /**
	  @func update
	  @desc Updates the value of this.searchInput with given string.
	  @param {string} value - String to set this.searchInput
	  @this AutoComplete
	  */
	  ;

	  _proto.update = function update(value) {
	    // Changed if(value) to if(typeof value === 'string') to allow empty string values.
	    if (typeof value === 'string') {
	      this.searchInput.value = value;

	      if (value) {
	        _populateSelect.bind(this)();

	        this.container.dispatchEvent(this[EventName$h.ON_UPDATE]); // Is empty string. Menu should be closed.
	      } else {
	        this.close();
	      }
	    }
	  }
	  /**
	  @func updateDataSource
	  @desc Closes the suggestions menu.
	  @param {Array} data - Data to set this.suggestedData
	  @this AutoComplete
	  @throws {TypeError} Will throw a TypeError when opts.data is not of type Array[<string>] or Array[{value: <string>}]
	  */
	  ;

	  _proto.updateDataSource = function updateDataSource(data) {
	    if (_verifyData(data)) {
	      this.suggestedData = data;

	      _populateSelect.bind(this)();
	    } else {
	      throw new TypeError(Errors.DATA_TYPE_ERROR);
	    }
	  }
	  /**
	   * remove all event listeners.
	   */
	  ;

	  _proto.remove = function remove() {
	    Util.removeEvents(this.events); // remove this autocomplete reference from array of instances

	    var index = autocompleteInstances.indexOf(this);
	    autocompleteInstances.splice(index, 1);
	    this.container.dispatchEvent(this[EventName$h.ON_REMOVE]);
	  };

	  return AutoComplete;
	}();

	/* eslint-disable no-undefined,no-param-reassign,no-shadow */

	/**
	 * Throttle execution of a function. Especially useful for rate limiting
	 * execution of handlers on events like resize and scroll.
	 *
	 * @param  {number}    delay -          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
	 * @param  {boolean}   [noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
	 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
	 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
	 *                                    the internal counter is reset).
	 * @param  {Function}  callback -       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
	 *                                    to `callback` when the throttled-function is executed.
	 * @param  {boolean}   [debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
	 *                                    schedule `callback` to execute after `delay` ms.
	 *
	 * @returns {Function}  A new, throttled, function.
	 */
	function throttle (delay, noTrailing, callback, debounceMode) {
	  /*
	   * After wrapper has stopped being called, this timeout ensures that
	   * `callback` is executed at the proper times in `throttle` and `end`
	   * debounce modes.
	   */
	  var timeoutID;
	  var cancelled = false; // Keep track of the last time `callback` was executed.

	  var lastExec = 0; // Function to clear existing timeout

	  function clearExistingTimeout() {
	    if (timeoutID) {
	      clearTimeout(timeoutID);
	    }
	  } // Function to cancel next exec


	  function cancel() {
	    clearExistingTimeout();
	    cancelled = true;
	  } // `noTrailing` defaults to falsy.


	  if (typeof noTrailing !== 'boolean') {
	    debounceMode = callback;
	    callback = noTrailing;
	    noTrailing = undefined;
	  }
	  /*
	   * The `wrapper` function encapsulates all of the throttling / debouncing
	   * functionality and when executed will limit the rate at which `callback`
	   * is executed.
	   */


	  function wrapper() {
	    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
	      arguments_[_key] = arguments[_key];
	    }

	    var self = this;
	    var elapsed = Date.now() - lastExec;

	    if (cancelled) {
	      return;
	    } // Execute `callback` and update the `lastExec` timestamp.


	    function exec() {
	      lastExec = Date.now();
	      callback.apply(self, arguments_);
	    }
	    /*
	     * If `debounceMode` is true (at begin) this is used to clear the flag
	     * to allow future `callback` executions.
	     */


	    function clear() {
	      timeoutID = undefined;
	    }

	    if (debounceMode && !timeoutID) {
	      /*
	       * Since `wrapper` is being called for the first time and
	       * `debounceMode` is true (at begin), execute `callback`.
	       */
	      exec();
	    }

	    clearExistingTimeout();

	    if (debounceMode === undefined && elapsed > delay) {
	      /*
	       * In throttle mode, if `delay` time has been exceeded, execute
	       * `callback`.
	       */
	      exec();
	    } else if (noTrailing !== true) {
	      /*
	       * In trailing throttle mode, since `delay` time has not been
	       * exceeded, schedule `callback` to execute `delay` ms after most
	       * recent execution.
	       *
	       * If `debounceMode` is true (at begin), schedule `clear` to execute
	       * after `delay` ms.
	       *
	       * If `debounceMode` is false (at end), schedule `callback` to
	       * execute after `delay` ms.
	       */
	      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
	    }
	  }

	  wrapper.cancel = cancel; // Return the wrapper function.

	  return wrapper;
	}

	/* eslint-disable no-undefined */
	/**
	 * Debounce execution of a function. Debouncing, unlike throttling,
	 * guarantees that a function is only executed a single time, either at the
	 * very beginning of a series of calls, or at the very end.
	 *
	 * @param  {number}   delay -         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
	 * @param  {boolean}  [atBegin] -     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
	 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
	 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
	 * @param  {Function} callback -      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
	 *                                  to `callback` when the debounced-function is executed.
	 *
	 * @returns {Function} A new, debounced function.
	 */

	function debounce (delay, atBegin, callback) {
	  return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
	}

	var Selector$i = {
	  DATA_MOUNT: '[data-mount="sticky"]',
	  SHOW_STUCK: '.sticky-show-stuck',
	  HIDE_STUCK: '.sticky-hide-stuck'
	};
	var ClassName$d = {
	  STICKY: 'sticky',
	  SENTINEL: 'sticky-sentinel',
	  STUCK: 'stuck',
	  GET_HEIGHT: 'get-height'
	};
	var Direction$2 = {
	  TOP: 'top',
	  BOTTOM: 'bottom'
	};
	var EventName$g = {
	  ON_STUCK: 'onSticky',
	  ON_UNSTUCK: 'onStatic',
	  ON_UPDATE: 'onUpdate',
	  ON_REMOVE: 'onRemove',
	  FOCUS_IN: 'focusin',
	  RESIZE: 'resize'
	};
	var Default$4 = {
	  DIRECTION: 'top'
	};
	var stickies = [];
	/**
	 * Private functions.
	 */

	/**
	 * Check for the `data-smooth-transition` attribute.
	 * Its presence makes this option "true" unless the value is specifically set to "false"
	 * @param {Node} node - The element to check for the attribute `data-smooth-transition`
	 * @returns {Boolean} return false if contentDivTarget is null
	 */

	function _hasSmoothTransition(node) {
	  if (node.hasAttribute('data-smooth-transition') && node.dataset.smoothTransition !== 'false') {
	    return true;
	  }

	  return false;
	}
	/**
	 * Get the direction of the sticky.
	 * @param {string} string - The string to parse.
	 * @param {string} [defaultValue=top] - The default value to fallback to.
	 * @returns {string} The direction of the sticky.
	 */


	function _getDirection(str, defaultValue) {
	  if (defaultValue === void 0) {
	    defaultValue = Default$4.DIRECTION;
	  }

	  switch (str) {
	    case 'top':
	    case 'bottom':
	      return str;

	    default:
	      return defaultValue;
	  }
	}
	/**
	 * Handle intersection observer
	 */


	function _onStickyChange() {
	  this.el.classList.toggle(ClassName$d.STUCK, this.isStuck);

	  _updateContentDivSpacing.bind(this)();

	  _updateScrollPadding.bind(this)();
	}
	/**
	 * Update margin spacing on the element before/after the sticky bar so that overlapping
	 * does not occur when the page bar is fixed. Remove property if it is not stuck
	 * @returns {Boolean} return false if contentDivTarget is null
	 */


	function _updateContentDivSpacing() {
	  if (this.contentDivTarget === null) {
	    return false;
	  }

	  if (this.isStuck) {
	    var adjustNextElementSpacing = parseInt(getComputedStyle(this.el).height, 10) + this.contentDivTargetSpacing;

	    if (this.rootMarginOffset !== 0) {
	      adjustNextElementSpacing -= this.rootMarginOffset;
	    }

	    this.contentDivTarget.style.setProperty(this.styleProp, adjustNextElementSpacing + 'px', 'important');
	  } else {
	    this.contentDivTarget.style.setProperty(this.styleProp, '');
	  }
	}
	/**
	 * Updates scroll padding so that elements scrolled into view don't stay behind
	 */


	function _updateScrollPadding(removeScrollPadding) {
	  var htmlElement = document.querySelector('html');

	  if (removeScrollPadding) {
	    htmlElement.style.scrollPaddingTop = 0;
	    htmlElement.style.scrollPaddingBottom = 0;
	  }

	  if (this.direction === Direction$2.TOP) {
	    if (this.isStuck) {
	      htmlElement.style.scrollPaddingTop = this.el.getBoundingClientRect().height + this.extraScrollPaddingPx + 'px';
	    } else {
	      htmlElement.style.scrollPaddingTop = this.el.getBoundingClientRect().height + this.rootMarginOffset + this.extraScrollPaddingPx + 'px';
	    }
	  } else if (this.direction === Direction$2.BOTTOM) {
	    if (this.isStuck) {
	      htmlElement.style.scrollPaddingBottom = this.el.getBoundingClientRect().height + this.extraScrollPaddingPx + 'px';
	    } else {
	      htmlElement.style.scrollPaddingBottom = this.el.getBoundingClientRect().height + this.rootMarginOffset + this.extraScrollPaddingPx + 'px';
	    }
	  }
	}
	/**
	 * Triggers a boundary check when focus changes to handle edge cases where Intersection Observer does not fire
	 * Uses focusin because focus does not bubble
	 */


	function _onFocusin() {
	  if (this.enableObserver) {
	    this.isStuck = this.doesSentinelExceedBoundary();
	    this.el.classList.toggle(ClassName$d.STUCK, this.isStuck);

	    _updateScrollPadding.bind(this)();
	  }
	}
	/**
	  @func _stickyExceedsAcceptedHeight
	  @desc Calculates and returns whether the height of the sticky has exceeded 33% of the viewport height based on height of the sticky's hidden elements and the height of the sticky's visible elements.
	  @returns {boolean} Whether the height of the sticky has exceeded 33% of the viewport height.
	  @this Sticky
	*/


	function _stickyExceedsAcceptedHeight() {
	  // Subtracting two additional pixels based on a border that is toggled based on visibility.
	  return (this.hiddenElementsHeight + this.visibleElementsHeight - 2) / window.innerHeight > 0.33;
	}
	/**
	  @func _getShowStuckHeight
	  @desc Calculates and returns the combined height of all .sticky-show-stuck elements.
	  @returns {number} Combined height of all .sticky-show-stuck elements.
	  @this Sticky
	*/


	function _getShowStuckHeight() {
	  var _this = this;

	  var hiddenHeight = 0; // Calculate the height of hidden elements when not stuck

	  var showStuck = this.el.querySelectorAll(Selector$i.SHOW_STUCK);

	  if (showStuck && showStuck instanceof NodeList) {
	    // Get the height of all hidden elements
	    showStuck.forEach(function (el, index, list) {
	      hiddenHeight += Util.getElementOuterHeight(el, {
	        cssSelectors: ['margin', 'padding']
	      }); // If this is the last item in the node list, remove the CSS hack that displays hidden elements

	      if (index === list.length - 1) {
	        _this.el.classList.remove(ClassName$d.GET_HEIGHT);
	      }
	    });
	  }

	  return hiddenHeight;
	}
	/**
	  @func _calculateHeights
	  @desc Calculates and returns the height of hidden and visible elements.
	  @returns {Object} Object containing height of hidden and visible elements.
	  @this Sticky
	*/


	function _calculateHeights() {
	  this.el.classList.add(ClassName$d.GET_HEIGHT);

	  var hiddenHeight = _getShowStuckHeight.call(this);

	  var visibleHeight = this.el.offsetHeight;
	  this.el.classList.remove(ClassName$d.GET_HEIGHT);
	  return {
	    hidden: hiddenHeight,
	    visible: visibleHeight
	  };
	}
	/**
	 * Class representing a Sticky Element.
	 */


	var Sticky = /*#__PURE__*/function () {
	  /**
	   * Create the Sticky Element
	   * @param {Object} opts - The Sticky Element options.
	   * @param {Node} opts.el - The Sticky Element DOM node.
	   * @param {string} opts.direction - Whether the Sticky element sticks to the top when scrolled below a certain point (TOP) or sticks to the bottom when scrolled above a certain point (BOTTOM). Defaults to TOP
	   * @param {boolean} opts.enableSmoothTransition - Whether to enable a smoother transition to hiding/showing elements as the sticky become stuck. If not defined, will attempt to read `data-smooth-transition` attribute, defaults to false
	   * @param {boolean} opts.enableObserver - enable the observer on initialization (defaults to true)
	   * @param {number} opts.extraScrollPaddingPx - Extra scroll padding to reduce crowding into sticky bars, defaults to 12px, same as minimal gutters
	   */
	  function Sticky(opts) {
	    var _this2 = this;

	    this.el = opts.el;
	    this.direction = _getDirection(opts.direction || this.el.dataset.direction);
	    this.enableSmoothTransition = typeof opts.enableSmoothTransition === 'boolean' ? opts.enableSmoothTransition : _hasSmoothTransition(this.el);
	    this.extraScrollPaddingPx = typeof opts.extraScrollPaddingPx === 'number' ? opts.extraScrollPaddingPx : 12;
	    this.enableObserver = typeof opts.enableObserver === 'boolean' ? opts.enableObserver : true; // Saves the initial value of enable observer status from construction. Is used to flag whether the sticky should be automatically disabled when the height of the sticky exceeds 33% of the viewport

	    this.enableObserverInitial = this.enableObserver; // Add "sticky" class only while initialized to attach style and functionality provided by CSS
	    // Set prior to all height calculations so that styles are applied first

	    this.el.classList.add(ClassName$d.STICKY);

	    var _calculateHeights$cal = _calculateHeights.call(this),
	        hiddenElementsHeight = _calculateHeights$cal.hidden,
	        visibleElementsHeight = _calculateHeights$cal.visible; // Adjusts where the sentinel to the intersection observer triggers. Expected to be 0 if smooth transition is disabled.


	    this.rootMarginOffset = this.enableSmoothTransition ? hiddenElementsHeight : 0;
	    this.hiddenElementsHeight = hiddenElementsHeight;
	    this.visibleElementsHeight = visibleElementsHeight; // Set properties based on the anchor direction

	    if (this.direction === Direction$2.BOTTOM) {
	      this.el.style.bottom = '0';
	      this.contentDivTarget = this.el.previousElementSibling;
	      this.contentDivTargetSpacing = this.contentDivTarget ? parseInt(getComputedStyle(this.contentDivTarget).paddingBottom, 10) + parseInt(getComputedStyle(this.contentDivTarget).marginBottom, 10) : 0;
	      this.styleProp = 'margin-bottom';
	    } else {
	      // Assume direction is Direction.TOP
	      this.el.style.top = '0';
	      this.contentDivTarget = this.el.nextElementSibling;
	      this.contentDivTargetSpacing = this.contentDivTarget ? parseInt(getComputedStyle(this.contentDivTarget).paddingTop, 10) + parseInt(getComputedStyle(this.contentDivTarget).marginTop, 10) : 0;
	      this.styleProp = 'margin-top';
	    } // Add event handlers


	    this.events = [{
	      el: document.body,
	      type: EventName$g.FOCUS_IN,
	      handler: _onFocusin.bind(this)
	    }, {
	      el: window,
	      type: EventName$g.RESIZE,
	      handler: throttle(200, _updateScrollPadding.bind(this))
	    }, {
	      el: window,
	      type: EventName$g.RESIZE,
	      handler: debounce(300, function () {
	        if (_this2.enableObserverInitial) {
	          if (_stickyExceedsAcceptedHeight.call(_this2)) {
	            _this2.setObserverStatus(false);
	          } else {
	            _this2.setObserverStatus(true);
	          }
	        }
	      }),
	      options: {
	        passive: true
	      }
	    }];
	    Util.addEvents(this.events); // Create custom events

	    this[EventName$g.ON_STUCK] = new CustomEvent(EventName$g.ON_STUCK, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$g.ON_UNSTUCK] = new CustomEvent(EventName$g.ON_UNSTUCK, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$g.ON_REMOVE] = new CustomEvent(EventName$g.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    }); // Setup intersection observer

	    this.sentinel = document.createElement('div');
	    this.sentinel.classList.add(ClassName$d.SENTINEL); // If smooth transition is enabled, the`rootMarginOffset` value should reflect the combined height
	    // of all elements hidden prior to the sticky becoming stuck. Adding this value to the rootMargin option
	    // of the intersection observer will allow for the sticky to activate sooner, resulting in a more
	    // seamless transition

	    var observerOptions = {
	      rootMargin: "-" + this.rootMarginOffset + "px 0px 0px 0px"
	    };
	    this.observer = new IntersectionObserver(function (entries) {
	      // fire onStickyChange if not in viewport
	      if (_this2.enableObserver) {
	        var prevState = _this2.isStuck;
	        _this2.isStuck = _this2.doesSentinelExceedBoundary() && !entries[0].isIntersecting; // Check if sticky has changed state from unstuck to stuck and vice versa
	        // in order to trigger custom events

	        if (typeof prevState !== 'undefined' && prevState !== _this2.isStuck) {
	          if (_this2.isStuck) {
	            _this2.el.dispatchEvent(_this2[EventName$g.ON_STUCK]);
	          } else {
	            _this2.el.dispatchEvent(_this2[EventName$g.ON_UNSTUCK]);
	          }
	        }

	        _onStickyChange.bind(_this2)();
	      }
	    }, observerOptions);
	    this.el.insertAdjacentElement('beforebegin', this.sentinel);
	    this.observer.observe(this.sentinel);

	    if (this.doesSentinelExceedBoundary() && this.enableObserver) {
	      this.el.classList.add(ClassName$d.STUCK);

	      _updateScrollPadding.bind(this)();
	    }

	    if (this.enableObserverInitial) {
	      if (_stickyExceedsAcceptedHeight.call(this)) {
	        this.setObserverStatus(false);
	      } else {
	        this.setObserverStatus(true);
	      }
	    }

	    stickies.push(this);
	  }
	  /**
	   * Check if the sentinel Exceeds the boundary
	   * @returns {boolean} State of sentinel boundary
	   */


	  var _proto = Sticky.prototype;

	  _proto.doesSentinelExceedBoundary = function doesSentinelExceedBoundary() {
	    var sentinelRect = this.sentinel.getBoundingClientRect();
	    var sentinelTop = sentinelRect.top - this.rootMarginOffset;
	    var sentinelBottom = sentinelRect.bottom;

	    if (this.direction === Direction$2.TOP && sentinelTop < 0) {
	      return true;
	    }

	    if (this.direction === Direction$2.BOTTOM && sentinelBottom > window.innerHeight) {
	      return true;
	    }

	    return false;
	  }
	  /**
	   * Set the status of the observer (to enable or disable the observer)
	   * @param {boolean} status The status to set
	   */
	  ;

	  _proto.setObserverStatus = function setObserverStatus(status) {
	    if (this.doesSentinelExceedBoundary()) {
	      _updateScrollPadding.bind(this)();

	      if (status) {
	        this.el.classList.add(ClassName$d.STUCK);
	      } else {
	        this.el.classList.remove(ClassName$d.STUCK);
	      }
	    }

	    this.enableObserver = status;
	  }
	  /**
	   * Remove the sticky.
	   */
	  ;

	  _proto.remove = function remove() {
	    Util.removeEvents(this.events); // remove the attribute from the element

	    this.el.classList.remove(ClassName$d.STICKY);

	    _updateScrollPadding.bind(this)(true); // remove sticky-sentinel element


	    this.sentinel.remove(); // remove this sticky reference from array of instances

	    var index = stickies.indexOf(this);
	    stickies.splice(index, 1);
	    this.el.dispatchEvent(this[EventName$g.ON_REMOVE]);
	  }
	  /**
	   * Get an array of sticky instances.
	   * @returns {Object[]} Array of sticky instances.
	   */
	  ;

	  Sticky.getInstances = function getInstances() {
	    return stickies;
	  };

	  return Sticky;
	}();

	(function () {
	  Util.initializeComponent(Selector$i.DATA_MOUNT, function (node) {
	    return new Sticky({
	      el: node
	    });
	  });
	})();

	var backToTopInstances = [];
	var Selector$h = {
	  BACK_TO_TOP: '[data-mount="back-to-top"]'
	};
	var EventName$f = {
	  SCROLL: 'scroll',
	  ON_REMOVE: 'onRemove',
	  ON_RESIZE: 'resize'
	};
	var Attributes$2 = {
	  TABINDEX: 'tabindex'
	};
	var DISPLAY_BUTTON_THRESHOLD = 0.7; // percentage of the page where button will display

	var initialPageLoad = true;
	/**
	 * Switch the back to top element between static and sticky
	 */

	function _scrollListener() {
	  var _this = this;

	  // use offset margin and subtract the top position of the sentinel
	  var offsetWithSentinel = this.stickyElement.sentinel.offsetTop - this.offsetMarginTop;
	  var scrollY = window.scrollY || window.pageYOffset;

	  if (scrollY > offsetWithSentinel) {
	    this.stickyElement.setObserverStatus(true);
	    this.el.style.opacity = 1;
	  } else {
	    var timeout = initialPageLoad ? 0 : 175; // prevent button flashing on page load

	    this.el.style.opacity = 0;
	    setTimeout(function () {
	      _this.el.classList.remove(ClassName$d.STUCK);

	      _this.stickyElement.enableObserver = false;
	    }, timeout);
	    initialPageLoad = false;
	  }
	}
	/**
	 * Update sticky offset margin top value when browser height changes
	 * and remove/create new sticky element
	 */


	function _onWindowResize$1() {
	  // extra conditional check to prevent code from constantly running on resize
	  if (this.offsetMarginTop !== document.documentElement.offsetHeight * DISPLAY_BUTTON_THRESHOLD) {
	    this.offsetMarginTop = document.documentElement.offsetHeight * DISPLAY_BUTTON_THRESHOLD;
	    this.stickyElement.remove();
	    this.stickyElement = new Sticky({
	      el: this.el,
	      direction: Direction$2.BOTTOM
	    });
	  }
	}

	var BackToTop = /*#__PURE__*/function () {
	  function BackToTop(opts) {
	    this.el = opts.el;
	    this.offsetMarginTop = document.documentElement.offsetHeight * DISPLAY_BUTTON_THRESHOLD;
	    this.setTabindex(); // Create custom events

	    this[EventName$f.ON_REMOVE] = new CustomEvent(EventName$f.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	    backToTopInstances.push(this);
	    this.stickyElement = new Sticky({
	      el: this.el,
	      direction: Direction$2.BOTTOM
	    }); // Do the initial firing of the listener to set the state

	    _scrollListener.call(this); // attach event listeners


	    this.events = [{
	      el: document,
	      type: EventName$f.SCROLL,
	      handler: throttle(200, _scrollListener.bind(this)),
	      options: {
	        passive: true
	      }
	    }, {
	      el: window,
	      type: EventName$f.ON_RESIZE,
	      handler: throttle(200, _onWindowResize$1.bind(this))
	    }];
	    Util.addEvents(this.events);
	  }
	  /**
	   * Check if the element needs a tabindex and set it
	   */


	  var _proto = BackToTop.prototype;

	  _proto.setTabindex = function setTabindex() {
	    var link = this.el.querySelector('a');
	    var href = link.getAttribute('href');
	    var targetElement = document.querySelector(href);
	    var isElementFound = document.querySelector(href) !== null;

	    if (isElementFound && // Only do something if the element is not tabbable
	    !Util.isElementTabbable(targetElement)) {
	      var tabindex = targetElement.getAttribute(Attributes$2.TABINDEX); // If we don't have a tabindex

	      if (tabindex === null) {
	        // Set the tabindex of the element to -1
	        targetElement.setAttribute(Attributes$2.TABINDEX, '-1');
	      }
	    }
	  }
	  /**
	   * Remove the event listener from the back to top element
	   */
	  ;

	  _proto.remove = function remove() {
	    Util.removeEvents(this.events);
	    this.stickyElement.remove();
	    this.el.dispatchEvent(this[EventName$f.ON_REMOVE]); // remove this carousel reference from array of instances

	    var index = backToTopInstances.indexOf(this);
	    backToTopInstances.splice(index, 1);
	  }
	  /**
	   * Get a back to top instances.
	   * @returns {Object} A back to top instance
	   */
	  ;

	  BackToTop.getInstances = function getInstances() {
	    return backToTopInstances;
	  };

	  return BackToTop;
	}();

	(function () {
	  Util.initializeComponent(Selector$h.BACK_TO_TOP, function (node) {
	    return new BackToTop({
	      el: node
	    });
	  });
	})();

	/**
	 * EvEmitter v1.1.0
	 * Lil' event emitter
	 * MIT License
	 */

	var evEmitter = createCommonjsModule(function (module) {
	/* jshint unused: true, undef: true, strict: true */

	( function( global, factory ) {
	  // universal module definition
	  /* jshint strict: false */ /* globals define, module, window */
	  if ( module.exports ) {
	    // CommonJS - Browserify, Webpack
	    module.exports = factory();
	  } else {
	    // Browser globals
	    global.EvEmitter = factory();
	  }

	}( typeof window != 'undefined' ? window : commonjsGlobal, function() {

	function EvEmitter() {}

	var proto = EvEmitter.prototype;

	proto.on = function( eventName, listener ) {
	  if ( !eventName || !listener ) {
	    return;
	  }
	  // set events hash
	  var events = this._events = this._events || {};
	  // set listeners array
	  var listeners = events[ eventName ] = events[ eventName ] || [];
	  // only add once
	  if ( listeners.indexOf( listener ) == -1 ) {
	    listeners.push( listener );
	  }

	  return this;
	};

	proto.once = function( eventName, listener ) {
	  if ( !eventName || !listener ) {
	    return;
	  }
	  // add event
	  this.on( eventName, listener );
	  // set once flag
	  // set onceEvents hash
	  var onceEvents = this._onceEvents = this._onceEvents || {};
	  // set onceListeners object
	  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
	  // set flag
	  onceListeners[ listener ] = true;

	  return this;
	};

	proto.off = function( eventName, listener ) {
	  var listeners = this._events && this._events[ eventName ];
	  if ( !listeners || !listeners.length ) {
	    return;
	  }
	  var index = listeners.indexOf( listener );
	  if ( index != -1 ) {
	    listeners.splice( index, 1 );
	  }

	  return this;
	};

	proto.emitEvent = function( eventName, args ) {
	  var listeners = this._events && this._events[ eventName ];
	  if ( !listeners || !listeners.length ) {
	    return;
	  }
	  // copy over to avoid interference if .off() in listener
	  listeners = listeners.slice(0);
	  args = args || [];
	  // once stuff
	  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

	  for ( var i=0; i < listeners.length; i++ ) {
	    var listener = listeners[i];
	    var isOnce = onceListeners && onceListeners[ listener ];
	    if ( isOnce ) {
	      // remove listener
	      // remove before trigger to prevent recursion
	      this.off( eventName, listener );
	      // unset once flag
	      delete onceListeners[ listener ];
	    }
	    // trigger listener
	    listener.apply( this, args );
	  }

	  return this;
	};

	proto.allOff = function() {
	  delete this._events;
	  delete this._onceEvents;
	};

	return EvEmitter;

	}));
	});

	/*!
	 * imagesLoaded v4.1.4
	 * JavaScript is all like "You images are done yet or what?"
	 * MIT License
	 */

	var imagesloaded = createCommonjsModule(function (module) {
	( function( window, factory ) {  // universal module definition

	  /*global define: false, module: false, require: false */

	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	      window,
	      evEmitter
	    );
	  } else {
	    // browser global
	    window.imagesLoaded = factory(
	      window,
	      window.EvEmitter
	    );
	  }

	})( typeof window !== 'undefined' ? window : commonjsGlobal,

	// --------------------------  factory -------------------------- //

	function factory( window, EvEmitter ) {

	var $ = window.jQuery;
	var console = window.console;

	// -------------------------- helpers -------------------------- //

	// extend objects
	function extend( a, b ) {
	  for ( var prop in b ) {
	    a[ prop ] = b[ prop ];
	  }
	  return a;
	}

	var arraySlice = Array.prototype.slice;

	// turn element or nodeList into an array
	function makeArray( obj ) {
	  if ( Array.isArray( obj ) ) {
	    // use object if already an array
	    return obj;
	  }

	  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
	  if ( isArrayLike ) {
	    // convert nodeList to array
	    return arraySlice.call( obj );
	  }

	  // array of single index
	  return [ obj ];
	}

	// -------------------------- imagesLoaded -------------------------- //

	/**
	 * @param {Array, Element, NodeList, String} elem
	 * @param {Object or Function} options - if function, use as callback
	 * @param {Function} onAlways - callback function
	 */
	function ImagesLoaded( elem, options, onAlways ) {
	  // coerce ImagesLoaded() without new, to be new ImagesLoaded()
	  if ( !( this instanceof ImagesLoaded ) ) {
	    return new ImagesLoaded( elem, options, onAlways );
	  }
	  // use elem as selector string
	  var queryElem = elem;
	  if ( typeof elem == 'string' ) {
	    queryElem = document.querySelectorAll( elem );
	  }
	  // bail if bad element
	  if ( !queryElem ) {
	    console.error( 'Bad element for imagesLoaded ' + ( queryElem || elem ) );
	    return;
	  }

	  this.elements = makeArray( queryElem );
	  this.options = extend( {}, this.options );
	  // shift arguments if no options set
	  if ( typeof options == 'function' ) {
	    onAlways = options;
	  } else {
	    extend( this.options, options );
	  }

	  if ( onAlways ) {
	    this.on( 'always', onAlways );
	  }

	  this.getImages();

	  if ( $ ) {
	    // add jQuery Deferred object
	    this.jqDeferred = new $.Deferred();
	  }

	  // HACK check async to allow time to bind listeners
	  setTimeout( this.check.bind( this ) );
	}

	ImagesLoaded.prototype = Object.create( EvEmitter.prototype );

	ImagesLoaded.prototype.options = {};

	ImagesLoaded.prototype.getImages = function() {
	  this.images = [];

	  // filter & find items if we have an item selector
	  this.elements.forEach( this.addElementImages, this );
	};

	/**
	 * @param {Node} element
	 */
	ImagesLoaded.prototype.addElementImages = function( elem ) {
	  // filter siblings
	  if ( elem.nodeName == 'IMG' ) {
	    this.addImage( elem );
	  }
	  // get background image on element
	  if ( this.options.background === true ) {
	    this.addElementBackgroundImages( elem );
	  }

	  // find children
	  // no non-element nodes, #143
	  var nodeType = elem.nodeType;
	  if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
	    return;
	  }
	  var childImgs = elem.querySelectorAll('img');
	  // concat childElems to filterFound array
	  for ( var i=0; i < childImgs.length; i++ ) {
	    var img = childImgs[i];
	    this.addImage( img );
	  }

	  // get child background images
	  if ( typeof this.options.background == 'string' ) {
	    var children = elem.querySelectorAll( this.options.background );
	    for ( i=0; i < children.length; i++ ) {
	      var child = children[i];
	      this.addElementBackgroundImages( child );
	    }
	  }
	};

	var elementNodeTypes = {
	  1: true,
	  9: true,
	  11: true
	};

	ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
	  var style = getComputedStyle( elem );
	  if ( !style ) {
	    // Firefox returns null if in a hidden iframe https://bugzil.la/548397
	    return;
	  }
	  // get url inside url("...")
	  var reURL = /url\((['"])?(.*?)\1\)/gi;
	  var matches = reURL.exec( style.backgroundImage );
	  while ( matches !== null ) {
	    var url = matches && matches[2];
	    if ( url ) {
	      this.addBackground( url, elem );
	    }
	    matches = reURL.exec( style.backgroundImage );
	  }
	};

	/**
	 * @param {Image} img
	 */
	ImagesLoaded.prototype.addImage = function( img ) {
	  var loadingImage = new LoadingImage( img );
	  this.images.push( loadingImage );
	};

	ImagesLoaded.prototype.addBackground = function( url, elem ) {
	  var background = new Background( url, elem );
	  this.images.push( background );
	};

	ImagesLoaded.prototype.check = function() {
	  var _this = this;
	  this.progressedCount = 0;
	  this.hasAnyBroken = false;
	  // complete if no images
	  if ( !this.images.length ) {
	    this.complete();
	    return;
	  }

	  function onProgress( image, elem, message ) {
	    // HACK - Chrome triggers event before object properties have changed. #83
	    setTimeout( function() {
	      _this.progress( image, elem, message );
	    });
	  }

	  this.images.forEach( function( loadingImage ) {
	    loadingImage.once( 'progress', onProgress );
	    loadingImage.check();
	  });
	};

	ImagesLoaded.prototype.progress = function( image, elem, message ) {
	  this.progressedCount++;
	  this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
	  // progress event
	  this.emitEvent( 'progress', [ this, image, elem ] );
	  if ( this.jqDeferred && this.jqDeferred.notify ) {
	    this.jqDeferred.notify( this, image );
	  }
	  // check if completed
	  if ( this.progressedCount == this.images.length ) {
	    this.complete();
	  }

	  if ( this.options.debug && console ) {
	    console.log( 'progress: ' + message, image, elem );
	  }
	};

	ImagesLoaded.prototype.complete = function() {
	  var eventName = this.hasAnyBroken ? 'fail' : 'done';
	  this.isComplete = true;
	  this.emitEvent( eventName, [ this ] );
	  this.emitEvent( 'always', [ this ] );
	  if ( this.jqDeferred ) {
	    var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
	    this.jqDeferred[ jqMethod ]( this );
	  }
	};

	// --------------------------  -------------------------- //

	function LoadingImage( img ) {
	  this.img = img;
	}

	LoadingImage.prototype = Object.create( EvEmitter.prototype );

	LoadingImage.prototype.check = function() {
	  // If complete is true and browser supports natural sizes,
	  // try to check for image status manually.
	  var isComplete = this.getIsImageComplete();
	  if ( isComplete ) {
	    // report based on naturalWidth
	    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
	    return;
	  }

	  // If none of the checks above matched, simulate loading on detached element.
	  this.proxyImage = new Image();
	  this.proxyImage.addEventListener( 'load', this );
	  this.proxyImage.addEventListener( 'error', this );
	  // bind to image as well for Firefox. #191
	  this.img.addEventListener( 'load', this );
	  this.img.addEventListener( 'error', this );
	  this.proxyImage.src = this.img.src;
	};

	LoadingImage.prototype.getIsImageComplete = function() {
	  // check for non-zero, non-undefined naturalWidth
	  // fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
	  return this.img.complete && this.img.naturalWidth;
	};

	LoadingImage.prototype.confirm = function( isLoaded, message ) {
	  this.isLoaded = isLoaded;
	  this.emitEvent( 'progress', [ this, this.img, message ] );
	};

	// ----- events ----- //

	// trigger specified handler for event type
	LoadingImage.prototype.handleEvent = function( event ) {
	  var method = 'on' + event.type;
	  if ( this[ method ] ) {
	    this[ method ]( event );
	  }
	};

	LoadingImage.prototype.onload = function() {
	  this.confirm( true, 'onload' );
	  this.unbindEvents();
	};

	LoadingImage.prototype.onerror = function() {
	  this.confirm( false, 'onerror' );
	  this.unbindEvents();
	};

	LoadingImage.prototype.unbindEvents = function() {
	  this.proxyImage.removeEventListener( 'load', this );
	  this.proxyImage.removeEventListener( 'error', this );
	  this.img.removeEventListener( 'load', this );
	  this.img.removeEventListener( 'error', this );
	};

	// -------------------------- Background -------------------------- //

	function Background( url, element ) {
	  this.url = url;
	  this.element = element;
	  this.img = new Image();
	}

	// inherit LoadingImage prototype
	Background.prototype = Object.create( LoadingImage.prototype );

	Background.prototype.check = function() {
	  this.img.addEventListener( 'load', this );
	  this.img.addEventListener( 'error', this );
	  this.img.src = this.url;
	  // check if image is already complete
	  var isComplete = this.getIsImageComplete();
	  if ( isComplete ) {
	    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
	    this.unbindEvents();
	  }
	};

	Background.prototype.unbindEvents = function() {
	  this.img.removeEventListener( 'load', this );
	  this.img.removeEventListener( 'error', this );
	};

	Background.prototype.confirm = function( isLoaded, message ) {
	  this.isLoaded = isLoaded;
	  this.emitEvent( 'progress', [ this, this.element, message ] );
	};

	// -------------------------- jQuery -------------------------- //

	ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
	  jQuery = jQuery || window.jQuery;
	  if ( !jQuery ) {
	    return;
	  }
	  // set local variable
	  $ = jQuery;
	  // $().imagesLoaded()
	  $.fn.imagesLoaded = function( options, callback ) {
	    var instance = new ImagesLoaded( this, options, callback );
	    return instance.jqDeferred.promise( $(this) );
	  };
	};
	// try making plugin
	ImagesLoaded.makeJQueryPlugin();

	// --------------------------  -------------------------- //

	return ImagesLoaded;

	});
	});

	var PointerType = {
	  TOUCH: 'touch',
	  PEN: 'pen'
	};

	function _handleSwipe() {
	  var absDeltax = Math.abs(this.touchDeltaX);

	  if (absDeltax <= this.swipeThreshold) {
	    return;
	  }

	  var direction = absDeltax / this.touchDeltaX; // swipe left

	  if (direction > 0) {
	    this.negativeCallback();
	  } // swipe right


	  if (direction < 0) {
	    this.positiveCallback();
	  }
	}

	function _swipeStart(event) {
	  if (this.pointerEvent && PointerType[event.pointerType.toUpperCase()]) {
	    this.touchStartX = event.clientX;
	  } else if (!this.pointerEvent) {
	    this.touchStartX = event.touches[0].clientX;
	  }
	}

	function _swipeMove(event) {
	  // ensure swiping with one touch and not pinching
	  if (event.touches && event.touches.length > 1) {
	    this.touchDeltaX = 0;
	  } else {
	    this.touchDeltaX = event.touches[0].clientX - this.touchStartX;
	  }
	}

	function _swipeEnd(event) {
	  if (this.pointerEvent && PointerType[event.pointerType.toUpperCase()]) {
	    this.touchDeltaX = event.clientX - this.touchStartX;
	  }

	  _handleSwipe.bind(this)();
	}
	/**
	 * Class for handling touch events.
	 */


	var TouchUtil = /*#__PURE__*/function () {
	  /**
	   * Create the touch events handler.
	   * @param {Object} opts - The touch events options.
	   * @param {Node} opts.el - The swipeable DOM node.
	   * @param {Function} opts.positiveCallback - Callback function to be called after swiping in a positive direction.
	   * @param {Function} opts.negativeCallback - Callback function to be called after swiping in a negative direction.
	   * @param {number} [opts.swipeThreshold] - The minimum swipe size
	   * @param {string} [opts.pointerEventClassName] - The classname to add for pointer events
	   */
	  function TouchUtil(opts) {
	    this.el = opts.el;
	    this.positiveCallback = opts.positiveCallback;
	    this.negativeCallback = opts.negativeCallback;
	    this.swipeThreshold = opts.swipeThreshold || 40;
	    this.pointerEventClassName = opts.pointerEventClassName || 'pointer-event';
	    this.touchStartX = 0;
	    this.touchDeltaX = 0;
	    this.touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
	    this.pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent);
	  }
	  /**
	   * Add the touch event listeners.
	   */


	  var _proto = TouchUtil.prototype;

	  _proto.addEventListeners = function addEventListeners() {
	    if (this.touchSupported) {
	      if (this.pointerEvent) {
	        this.el.addEventListener('pointerdown', _swipeStart.bind(this));
	        this.el.addEventListener('pointerup', _swipeEnd.bind(this));
	        this.el.classList.add(this.pointerEventClassName);
	      } else {
	        this.el.addEventListener('touchstart', _swipeStart.bind(this));
	        this.el.addEventListener('touchmove', _swipeMove.bind(this));
	        this.el.addEventListener('touchend', _swipeEnd.bind(this));
	      }
	    }
	  }
	  /**
	   * Remove the touch event listeners.
	   */
	  ;

	  _proto.removeEventListeners = function removeEventListeners() {
	    if (this.touchSupported) {
	      if (this.pointerEvent) {
	        this.el.removeEventListener('pointerdown', _swipeStart.bind(this));
	        this.el.removeEventListener('pointerup', _swipeEnd.bind(this));
	        this.el.classList.remove(this.pointerEventClassName);
	      } else {
	        this.el.removeEventListener('touchstart', _swipeStart.bind(this));
	        this.el.removeEventListener('touchmove', _swipeMove.bind(this));
	        this.el.removeEventListener('touchend', _swipeEnd.bind(this));
	      }
	    }
	  };

	  return TouchUtil;
	}();

	var ClassName$c = {
	  ACTIVE: 'active',
	  SLIDE: 'slide',
	  SLIDE_IN: 'sliding-in',
	  SNEAK_PEAK: 'carousel-sneak-peek',
	  PRODUCT_CARD: 'carousel-product-card',
	  VARIABLE_HEIGHT: 'carousel-variable-height',
	  RIGHT: 'carousel-item-right',
	  LEFT: 'carousel-item-left',
	  NEXT: 'carousel-item-next',
	  PREV: 'carousel-item-prev',
	  GET_HEIGHT: 'get-height',
	  MARGIN_X_0: 'mx-0',
	  PADDING_X_0: 'px-0'
	};
	var Direction$1 = {
	  NEXT: 'next',
	  PREV: 'prev',
	  LEFT: 'left',
	  RIGHT: 'right'
	};
	var Selector$g = {
	  ACTIVE: '.active',
	  ACTIVE_ITEM: '.active.carousel-item',
	  ITEM: '.carousel-item',
	  ITEM_IMG: '.carousel-item img',
	  INDICATORS: '.carousel-indicators',
	  DATA_SLIDE_PREV: '[data-slide="prev"]',
	  DATA_SLIDE_NEXT: '[data-slide="next"]',
	  DATA_MOUNT: '[data-mount="carousel"]',
	  DATA_LOOP: 'data-loop',
	  DATA_STATUS: 'data-status',
	  CAROUSEL_INNER: '.carousel-inner',
	  ROW: '.row',
	  SLIDE_ITEM: '.slide-item'
	};
	var EventName$e = {
	  ON_CHANGE: 'onChange',
	  ON_UPDATE: 'onUpdate',
	  ON_REMOVE: 'onRemove'
	};
	/**
	 * Private functions.
	 */

	function _getItemIndex(element) {
	  var items = element && element.parentNode ? [].slice.call(element.parentNode.querySelectorAll(Selector$g.ITEM)) : [];
	  return items.indexOf(element);
	}

	function _getInitialSlideIndex() {
	  var activeItem = this.el.querySelector(Selector$g.ACTIVE_ITEM);
	  return _getItemIndex.bind(this)(activeItem);
	}

	function _getNextSlide() {
	  var index = this.currentSlideIndex + 1; // If index exceeds slide length, return to index 0

	  return index > this.slides.length - 1 ? 0 : index;
	}

	function _getPrevSlide() {
	  var index = this.currentSlideIndex - 1; // If index is less than 0, move to last slide index

	  return index < 0 ? this.slides.length - 1 : index;
	}

	function _getSlide(num) {
	  // Record highest number, 0 or passed-in value
	  var max = Math.max(num, 0); // Return lowest number, either previous number or the maximum slide index

	  return Math.min(max, this.slides.length - 1);
	}

	function _getStatusContainer() {
	  // Check if we are maintaing a status message for this carousel
	  // and that the element exists on the page
	  var statusContainer = this.el.getAttribute(Selector$g.DATA_STATUS);
	  return statusContainer ? document.getElementById(statusContainer) : null;
	}

	function _shouldLoopSlides() {
	  // Loop by default unless data-loop is set to false
	  return !(this.el.getAttribute(Selector$g.DATA_LOOP) === 'false');
	}

	function _onFirstSlide() {
	  return this.currentSlideIndex === 0;
	}

	function _onLastSlide() {
	  return this.currentSlideIndex === this.slides.length - 1;
	}

	function _shouldGoForward() {
	  return _onLastSlide.bind(this)() ? this.loopSlides : true;
	}

	function _shouldGoBack() {
	  return _onFirstSlide.bind(this)() ? this.loopSlides : true;
	}

	function _prevBtnOnClick() {
	  this.goToPrevSlide();
	}

	function _nextBtnOnClick() {
	  // Add events to manage focus order for accessibility
	  Util.addEvents(this.nextBtnEvents);
	  this.goToNextSlide();
	}

	function _imgOnDrag(event) {
	  // Prevent images inside slides from being dragged and interfering with touch interaction
	  event.preventDefault();
	}

	function _slide(direction, nextElementIndex) {
	  var _this = this;

	  var activeElement = this.slides[this.currentSlideIndex];
	  var nextElement = this.slides[nextElementIndex];
	  var directionalClassName;
	  var orderClassName;

	  if (direction === Direction$1.NEXT) {
	    directionalClassName = ClassName$c.LEFT;
	    orderClassName = ClassName$c.NEXT;
	  } else {
	    directionalClassName = ClassName$c.RIGHT;
	    orderClassName = ClassName$c.PREV;
	  }

	  if (nextElement && nextElement.classList.contains(ClassName$c.ACTIVE)) {
	    this.isSliding = false;
	    return;
	  }

	  if (!activeElement || !nextElement) {
	    // Some weirdness is happening, so we bail
	    return;
	  }

	  this.isSliding = true;

	  _setActiveIndicatorElement.bind(this)(nextElementIndex);

	  if (this.el.classList.contains(ClassName$c.SNEAK_PEAK)) {
	    _removeNextPrevClasses.bind(this)();
	  }

	  if (this.el.classList.contains(ClassName$c.SLIDE)) {
	    if (this.el.classList.contains(ClassName$c.VARIABLE_HEIGHT)) {
	      this.el.classList.add(ClassName$c.MARGIN_X_0, ClassName$c.PADDING_X_0);
	    }

	    nextElement.classList.add(orderClassName, ClassName$c.SLIDE_IN);
	    Util.reflow(nextElement);
	    activeElement.classList.add(directionalClassName);
	    nextElement.classList.add(directionalClassName);
	    var transitionDuration = Util.getTransitionDurationFromElement(activeElement);
	    setTimeout(function () {
	      nextElement.classList.remove(directionalClassName, orderClassName, ClassName$c.SLIDE_IN);
	      nextElement.classList.add(ClassName$c.ACTIVE);
	      activeElement.classList.remove(ClassName$c.ACTIVE, orderClassName, directionalClassName);

	      if (_this.el.classList.contains(ClassName$c.VARIABLE_HEIGHT)) {
	        _this.el.classList.remove(ClassName$c.MARGIN_X_0, ClassName$c.PADDING_X_0);
	      }

	      _this.isSliding = false;
	    }, transitionDuration);
	  } else {
	    activeElement.classList.remove(ClassName$c.ACTIVE);
	    nextElement.classList.add(ClassName$c.ACTIVE);
	    this.isSliding = false;
	  }

	  _setSlideAttributes.bind(this)(nextElementIndex);

	  this.didSlide = true;
	  this.currentSlideIndex = nextElementIndex;

	  if (this.el.classList.contains(ClassName$c.SNEAK_PEAK)) {
	    _addNextPrevClasses.bind(this)();
	  }

	  _setButtonAttributes.bind(this)(); // Update the status message


	  if (this.statusContainer) {
	    _setStatusMessage.bind(this)(nextElementIndex);
	  }
	}

	function _setActiveIndicatorElement(index) {
	  if (this.indicators) {
	    var indicators = [].slice.call(this.indicators.querySelectorAll(Selector$g.ACTIVE));
	    indicators.forEach(function (indicator) {
	      indicator.classList.remove(ClassName$c.ACTIVE);
	    });
	    var nextIndicator = this.indicators.children[index];

	    if (nextIndicator) {
	      nextIndicator.classList.add(ClassName$c.ACTIVE);
	    }
	  }
	}

	function _removeNextPrevClasses() {
	  var nextElementIndex = _getNextSlide.bind(this)();

	  var prevElementIndex = _getPrevSlide.bind(this)();

	  this.slides[prevElementIndex].classList.remove(ClassName$c.PREV);
	  this.slides[nextElementIndex].classList.remove(ClassName$c.NEXT);
	}

	function _addNextPrevClasses() {
	  var nextElementIndex = _getNextSlide.bind(this)();

	  var prevElementIndex = _getPrevSlide.bind(this)();

	  this.slides[nextElementIndex].classList.add(ClassName$c.NEXT);
	  this.slides[prevElementIndex].classList.add(ClassName$c.PREV);
	}

	function _setSlideAttributes(index) {
	  for (var i = 0; i < this.slides.length; i++) {
	    if (i === index) {
	      this.slides[i].removeAttribute('aria-hidden');

	      if (this.el.classList.contains(ClassName$c.PRODUCT_CARD)) {
	        // Product card carousel needs the first product card focusable, not the whole slide
	        var slideItems = [].slice.call(this.slides[i].querySelectorAll(Selector$g.SLIDE_ITEM));
	        this.slides[i].removeAttribute('tabindex');
	        slideItems[0].firstElementChild.setAttribute('tabindex', 0);
	      } else {
	        this.slides[i].setAttribute('tabindex', 0);
	      }
	    } else {
	      this.slides[i].removeAttribute('tabindex');
	      this.slides[i].setAttribute('aria-hidden', 'true');
	    }
	  }
	}

	function _setActiveClass(index) {
	  for (var i = 0; i < this.slides.length; i++) {
	    if (i === index) {
	      this.slides[i].classList.add(ClassName$c.ACTIVE);
	    } else {
	      this.slides[i].classList.remove(ClassName$c.ACTIVE);
	    }
	  }
	}

	function _setButtonAttributes() {
	  if (!this.loopSlides) {
	    if (_onFirstSlide.bind(this)()) {
	      this.prevBtn.setAttribute('disabled', '');
	      this.prevBtn.setAttribute('tabindex', -1);
	      this.nextBtn.removeAttribute('disabled');
	    } else if (_onLastSlide.bind(this)()) {
	      this.prevBtn.removeAttribute('disabled');
	      this.prevBtn.removeAttribute('tabindex');
	      this.nextBtn.setAttribute('disabled', '');
	    } else {
	      this.prevBtn.removeAttribute('disabled');
	      this.prevBtn.removeAttribute('tabindex');
	      this.nextBtn.removeAttribute('disabled');
	    }
	  }
	}

	function _setStatusMessage(index) {
	  // Currently only product card carousel supports a status message,
	  // but this could be expanded to other types of carousels
	  if (this.el.classList.contains(ClassName$c.PRODUCT_CARD)) {
	    var slideItems = [].slice.call(this.el.querySelectorAll(Selector$g.SLIDE_ITEM));
	    var activeSlide = this.slides[index];
	    var activeSlideItems = activeSlide.querySelectorAll(Selector$g.SLIDE_ITEM);
	    var start = slideItems.indexOf(activeSlideItems[0]) + 1;
	    var separator = '–';
	    var end = slideItems.indexOf(activeSlideItems[activeSlideItems.length - 1]) + 1;
	    var data = {
	      start: start,
	      separator: separator,
	      end: end,
	      total: slideItems.length
	    };
	    this.srStatusContainer.textContent = Util.interpolateString(this.srStatusTemplate, data); // If we are only showing one item, set separator and end to an empty string for the visible template

	    if (start === end) {
	      data.separator = '';
	      data.end = '';
	    }

	    this.visibleStatusContainer.textContent = Util.interpolateString(this.visibleStatusTemplate, data);
	  }
	}

	function _setSlideHeights() {
	  // Enforce consistent height (flexbox messes with animation)
	  var slideArray = [].slice.call(this.slides);
	  var maxHeight = slideArray[0].clientHeight;
	  slideArray.forEach(function (slide) {
	    if (!slide.classList.contains(ClassName$c.ACTIVE)) {
	      slide.classList.add(ClassName$c.GET_HEIGHT);
	    }

	    if (slide.clientHeight > maxHeight) {
	      maxHeight = slide.clientHeight;
	    }

	    slide.classList.remove(ClassName$c.GET_HEIGHT);
	  });
	  slideArray.forEach(function (slide) {
	    slide.style.height = maxHeight + "px";
	  });
	}

	function _removeSlideHeights() {
	  var slideArray = [].slice.call(this.slides);
	  slideArray.forEach(function (slide) {
	    slide.style.height = '';
	  });
	}

	function _recalculateSlideHeights() {
	  var _this2 = this;

	  _removeSlideHeights.bind(this)();

	  imagesloaded(this.el, function () {
	    _setSlideHeights.bind(_this2)();
	  });
	}

	function _handleKeyDown(event) {
	  var keycode = event.keycode || event.which;

	  if (keycode === Util.keyCodes.TAB && this.didSlide) {
	    _focusOnSlide.bind(this)(this.currentSlideIndex);

	    this.didSlide = false;
	    event.preventDefault();
	  }

	  _removeControlEventListeners.bind(this)();
	}

	function _focusOnSlide(index) {
	  this.slides[index].focus();
	}

	function _removeControlEventListeners() {
	  this.didSlide = false;
	  Util.removeEvents(this.nextBtnEvents);
	}

	function _reallocateSlideItems() {
	  var inner = this.el.querySelector(Selector$g.CAROUSEL_INNER);
	  var activeSlide = this.el.querySelector(Selector$g.ACTIVE_ITEM);
	  var slideItemsContainer = activeSlide.querySelector(Selector$g.ROW);
	  var slideItems = [].slice.call(this.el.querySelectorAll(Selector$g.SLIDE_ITEM));
	  var activeSlideItems = activeSlide.querySelectorAll(Selector$g.SLIDE_ITEM);
	  var maxItems = Math.round(slideItemsContainer.clientWidth / activeSlideItems[0].clientWidth);
	  var slidesNeeded = Math.ceil(slideItems.length / maxItems);
	  var slidesToAdd = slidesNeeded - this.slides.length; // Reset CSS properties

	  _removeSlideHeights.bind(this)();

	  this.prevBtn.style.display = '';
	  this.nextBtn.style.display = '';

	  if (this.statusContainer) {
	    this.statusContainer.style.display = '';
	    this.statusContainer.nextElementSibling.style.display = '';
	  }

	  if (slidesToAdd > 0) {
	    // We need to add more slides
	    for (var i = 0; i < slidesToAdd; i++) {
	      var newNode = this.slides[this.slides.length - 1].cloneNode(true);
	      inner.append(newNode);
	      var newParent = newNode.querySelector(Selector$g.ROW); // Clear out duplicated slide items

	      while (newParent.firstChild) {
	        newParent.lastChild.remove();
	      }
	    }
	  } else if (slidesToAdd < 0) {
	    // We need to remove some slides
	    for (var _i = 0; _i > slidesToAdd; _i--) {
	      inner.lastChild.remove();
	    }
	  } // Reallocate the slide items among the slides


	  var slideItemsContainers = this.el.querySelectorAll(Selector$g.ROW);
	  var itemsToAppend;

	  var _loop = function _loop(_i2) {
	    var remainder = slideItems.length % maxItems;

	    if (remainder > 0) {
	      itemsToAppend = slideItems.splice(slideItems.length - remainder, remainder);
	    } else {
	      itemsToAppend = slideItems.splice(slideItems.length - maxItems, maxItems);
	    }

	    itemsToAppend.forEach(function (item) {
	      slideItemsContainers[_i2].append(item);
	    });
	  };

	  for (var _i2 = slideItemsContainers.length - 1; _i2 >= 0; _i2--) {
	    _loop(_i2);
	  } // Update the slides property


	  this.slides = this.el.querySelectorAll(Selector$g.ITEM); // Reset current slide index if it's on a slide that's been removed

	  if (this.currentSlideIndex > this.slides.length - 1) {
	    this.currentSlideIndex = this.slides.length - 1;
	  } // If there is only one slide, hide the controls, status msg, and cta


	  if (this.slides.length === 1) {
	    this.prevBtn.style.display = 'none';
	    this.nextBtn.style.display = 'none';

	    if (this.statusContainer) {
	      this.statusContainer.style.display = 'none';
	      this.statusContainer.nextElementSibling.style.display = 'none';
	    }
	  }

	  _recalculateSlideHeights.bind(this)();
	}

	function _setupDom() {
	  // Reallocate slide items for product card carousel
	  if (this.el.classList.contains(ClassName$c.PRODUCT_CARD)) {
	    _reallocateSlideItems.bind(this)();
	  } // Carousels that aren't layered can't use flexbox to ensure consistent height
	  // so we need an option to set slide height via JS


	  if (this.el.classList.contains(ClassName$c.VARIABLE_HEIGHT)) {
	    _recalculateSlideHeights.bind(this)();
	  } // Make sure slide attributes and indicators are up to date


	  _setSlideAttributes.bind(this)(this.currentSlideIndex);

	  _setActiveClass.bind(this)(this.currentSlideIndex);

	  _setActiveIndicatorElement.bind(this)(this.currentSlideIndex); // For layered carousel layouts, add prev and next classes to slides


	  if (this.el.classList.contains(ClassName$c.SNEAK_PEAK)) {
	    _addNextPrevClasses.bind(this)();
	  } // Update button attributes, for non-looping carousels


	  _setButtonAttributes.bind(this)(); // Update the status message


	  if (this.statusContainer) {
	    _setStatusMessage.bind(this)(this.currentSlideIndex);

	    this.statusContainer.parentNode.classList.remove('d-none');
	  }
	}
	/**
	 * Class representing carousel controls.
	 */


	var CarouselControls = /*#__PURE__*/function () {
	  /**
	   * Create the carousel controls.
	   * @param {Object} opts - The carousel controls options.
	   * @param {Node} opts.el - The carousel DOM node.
	   * @param {Node[]} opts.slides - Array of carousel slides.
	   * @param {number} [opts.initialSlideIndex] - Index of the first carousel slide.
	   * @param {boolean} [opts.loopSlides=true] - Whether the carousel should loop. Defaults to true.
	   * @param {Node} [opts.statusContainer] - Node that contains the status message templates.
	   * @param {Function} [opts.prevOnClick] - Function to override the previous button click handler.
	   * @param {Function} [opts.nextOnClick] - Function to override the next button click handler.
	   */
	  function CarouselControls(opts) {
	    var _this3 = this;

	    this.el = opts.el;
	    this.slides = opts.slides;
	    this.currentSlideIndex = opts.initialSlideIndex || _getInitialSlideIndex.bind(this)();
	    this.loopSlides = typeof opts.loopSlides === 'boolean' ? opts.loopSlides : _shouldLoopSlides.bind(this)();
	    this.statusContainer = opts.statusContainer || _getStatusContainer.bind(this)();
	    this.prevOnClick = opts.prevOnClick || _prevBtnOnClick.bind(this);
	    this.nextOnClick = opts.nextOnClick || _nextBtnOnClick.bind(this); // Internal variables

	    this.isSliding = false;
	    this.didSlide = false;
	    this.touchUtil = new TouchUtil({
	      el: this.el,
	      positiveCallback: this.goToNextSlide.bind(this),
	      negativeCallback: this.goToPrevSlide.bind(this)
	    }); // Select control nodes

	    this.prevBtn = this.el.querySelector(Selector$g.DATA_SLIDE_PREV);
	    this.nextBtn = this.el.querySelector(Selector$g.DATA_SLIDE_NEXT);
	    this.indicators = this.el.querySelector(Selector$g.INDICATORS);
	    this.itemImg = this.el.querySelectorAll(Selector$g.ITEM_IMG);

	    if (this.statusContainer) {
	      this.visibleStatusContainer = this.statusContainer.querySelector('[aria-hidden="true"]');
	      this.visibleStatusTemplate = this.visibleStatusContainer.textContent;
	      this.srStatusContainer = this.statusContainer.querySelector('.sr-only');
	      this.srStatusTemplate = this.srStatusContainer.textContent;
	    } // Attach event listeners


	    this.events = [{
	      el: this.prevBtn,
	      type: 'click',
	      handler: this.prevOnClick
	    }, {
	      el: this.nextBtn,
	      type: 'click',
	      handler: this.nextOnClick
	    }];

	    if (this.itemImg) {
	      this.itemImg.forEach(function (img) {
	        _this3.events.push({
	          el: img,
	          type: 'dragstart',
	          handler: _imgOnDrag
	        });
	      });
	    } // Product card and variable height carousels need an event listener for window resize


	    if (this.el.classList.contains(ClassName$c.PRODUCT_CARD) || this.el.classList.contains(ClassName$c.VARIABLE_HEIGHT)) {
	      this.events.push({
	        el: window,
	        type: 'resize',
	        handler: debounce(300, this.update.bind(this)),
	        options: {
	          passive: true
	        }
	      });
	    }

	    Util.addEvents(this.events);
	    this.touchUtil.addEventListeners(); // Event listeners that need to be added/removed based on user interaction for accessibility
	    // After someone activates the next button, but before the slide animation is over, the next tab keypress
	    // needs to direct focus to the next slide

	    this.nextBtnEvents = [{
	      el: this.nextBtn,
	      type: 'keydown',
	      handler: _handleKeyDown.bind(this)
	    }, {
	      el: this.nextBtn,
	      type: 'blur',
	      handler: _removeControlEventListeners.bind(this)
	    }]; // Create custom events

	    this[EventName$e.ON_CHANGE] = new CustomEvent(EventName$e.ON_CHANGE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$e.ON_UPDATE] = new CustomEvent(EventName$e.ON_UPDATE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$e.ON_REMOVE] = new CustomEvent(EventName$e.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    }); // Fix for product card and variable height carousels placed inside other interactive elements like tabs or modals

	    if (this.el.classList.contains(ClassName$c.PRODUCT_CARD) || this.el.classList.contains(ClassName$c.VARIABLE_HEIGHT)) {
	      this.observer = new IntersectionObserver(_recalculateSlideHeights.bind(this));
	      this.observer.observe(this.el);
	    } // Setup DOM


	    _setupDom.bind(this)();
	  }
	  /**
	   * Remove the carousel controls event handlers.
	   */


	  var _proto = CarouselControls.prototype;

	  _proto.remove = function remove() {
	    // Remove event listeners
	    Util.removeEvents(this.events);
	    this.touchUtil.removeEventListeners();

	    _removeControlEventListeners.bind(this)(); // Disconnect intersection observer


	    if (this.el.classList.contains(ClassName$c.PRODUCT_CARD) || this.el.classList.contains(ClassName$c.VARIABLE_HEIGHT)) {
	      this.observer.disconnect();
	    }

	    this.el.dispatchEvent(this[EventName$e.ON_REMOVE]);
	  }
	  /**
	   * Update the carousel controls instance.
	   */
	  ;

	  _proto.update = function update() {
	    // For layered carousel layouts, remove prev and next classes from existing slides
	    if (this.el.classList.contains(ClassName$c.SNEAK_PEAK)) {
	      _removeNextPrevClasses.bind(this)();
	    } // Update the slides property


	    this.slides = this.el.querySelectorAll(Selector$g.ITEM); // Setup DOM

	    _setupDom.bind(this)();

	    this.el.dispatchEvent(this[EventName$e.ON_UPDATE]);
	  }
	  /**
	   * Go forward to the next slide.
	   */
	  ;

	  _proto.goToNextSlide = function goToNextSlide() {
	    if (!this.isSliding && _shouldGoForward.bind(this)()) {
	      _slide.bind(this)(Direction$1.NEXT, _getNextSlide.bind(this)());

	      this.el.dispatchEvent(this[EventName$e.ON_CHANGE]);
	    }
	  }
	  /**
	   * Go back to the previous slide.
	   */
	  ;

	  _proto.goToPrevSlide = function goToPrevSlide() {
	    if (!this.isSliding && _shouldGoBack.bind(this)()) {
	      _slide.bind(this)(Direction$1.PREV, _getPrevSlide.bind(this)());

	      this.el.dispatchEvent(this[EventName$e.ON_CHANGE]);
	    }
	  }
	  /**
	   * Go to a specific slide.
	   * @param {number} num - 0-based index of the slide to change to.
	   */
	  ;

	  _proto.goToSlide = function goToSlide(num) {
	    if (!this.isSliding) {
	      _slide.bind(this)(Direction$1.PREV, _getSlide.bind(this)(num));

	      this.el.dispatchEvent(this[EventName$e.ON_CHANGE]);
	    }
	  };

	  return CarouselControls;
	}();

	var carousels = [];
	/**
	 * Class representing a carousel.
	 */

	var Carousel = /*#__PURE__*/function () {
	  /**
	   * Create the carousel.
	   * @param {Object} opts - The carousel options.
	   * @param {Node} opts.el - The carousel DOM node.
	   */
	  function Carousel(opts) {
	    this.el = opts.el;
	    this.controls = new CarouselControls(Object.assign({
	      slides: opts.el.querySelectorAll(Selector$g.ITEM)
	    }, opts));
	    carousels.push(this);
	  }
	  /**
	   * Remove the carousel.
	   */


	  var _proto = Carousel.prototype;

	  _proto.remove = function remove() {
	    // remove any references from controls
	    this.controls.remove();
	    delete this.controls; // remove this carousel reference from array of instances

	    var index = carousels.indexOf(this);
	    carousels.splice(index, 1);
	  }
	  /**
	   * Get an array of carousel instances.
	   * @returns {Object[]} Array of carousel instances.
	   */
	  ;

	  Carousel.getInstances = function getInstances() {
	    return carousels;
	  };

	  return Carousel;
	}();

	(function () {
	  Util.initializeComponent(Selector$g.DATA_MOUNT, function (node) {
	    return new Carousel({
	      el: node
	    });
	  });
	})();

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var defineProperty$1 = objectDefineProperty.f;
	var trim = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global$1[NUMBER];
	var NumberPrototype = NativeNumber.prototype;

	// Opera ~12 has broken Object#toString
	var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

	// `ToNumber` abstract operation
	// https://tc39.es/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, false);
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim(it);
	    first = it.charCodeAt(0);
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = it.slice(2);
	      length = digits.length;
	      for (index = 0; index < length; index++) {
	        code = digits.charCodeAt(index);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.es/ecma262/#sec-number-constructor
	if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var dummy = this;
	    return dummy instanceof NumberWrapper
	      // check on 1..constructor(foo) case
	      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
	        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
	  };
	  for (var keys = descriptors ? getOwnPropertyNames(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,' +
	    // ESNext
	    'fromString,range'
	  ).split(','), j = 0, key; keys.length > j; j++) {
	    if (has$1(NativeNumber, key = keys[j]) && !has$1(NumberWrapper, key)) {
	      defineProperty$1(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine(global$1, NUMBER, NumberWrapper);
	}

	var Selector$f = {
	  DATA_MOUNT: '[data-mount="character-count"]'
	};
	var EventName$d = {
	  ON_UPDATE: 'onUpdate',
	  ON_REMOVE: 'onRemove'
	};
	var characterCountInstances = [];
	var UPDATE_RATE_LIMIT = 400; // rate limit in ms for screen reader announcement

	/**
	 * Gets the target form element to monitor
	 * @returns {Node} The target element
	 */

	function _getTarget$2() {
	  // Reads selector from data-target attribute
	  var selector = Util.getSelectorFromElement(this.statusMessage); // There should only be one element targeted, gets the first match

	  return document.querySelector(selector);
	}
	/**
	 * Updates the textContent of a node with the most up to date character count status message
	 * @param {Node} node The node to update the textContent of
	 */


	function _updateStatusMessageText(node) {
	  var msgTemplate = this.isMaxInputReached() ? this.maxMessageTemplate : this.statusMessageTemplate;
	  var inputLength = this.getUserInputLength();
	  node.textContent = Util.interpolateString(msgTemplate, {
	    remaining: this.inputMaxLength - inputLength,
	    entered: inputLength,
	    max: this.inputMaxLength
	  });
	}
	/**
	 * Updates the visual status message only, immediately
	 */


	function _updateVisualStatusMessage() {
	  _updateStatusMessageText.bind(this)(this.statusMessageVisual);
	}
	/**
	 * Updates the screen reader status message only, immediately
	 */


	function _updateScreenReaderStatusMessage() {
	  _updateStatusMessageText.bind(this)(this.statusMessageSR);
	}
	/**
	 * Computes whether key typed is printable
	 * @param {KeyboardEvent} keyboardEventKey
	 * @returns {Boolean} Whether the key entered is printable
	 */


	function _isPrintable(keyboardEventKey) {
	  return /^.$/.test(keyboardEventKey);
	}
	/**
	 * Causes the screen reader status message to narrate
	 */


	function _narrateStatusMessage() {
	  var _this = this;

	  this.statusMessageSR.textContent = '';
	  setTimeout(function () {
	    _updateScreenReaderStatusMessage.bind(_this)();
	  }, 200);
	}
	/**
	 * Narrates the screen reader status message if the given KeyboardEvent represents a printable character
	 * @param {KeyboardEvent} keyboardEvent
	 */


	function _narrateIfMaxInputAndPrintableKey(keyboardEvent) {
	  if (this.isMaxInputReached() && _isPrintable(keyboardEvent.key)) {
	    _narrateStatusMessage.bind(this)();
	  }
	}

	var CharacterCount = /*#__PURE__*/function () {
	  /**
	   * Creates a CharacterCount object
	   * @param {Object} opts The CharacterCount options
	   * @param {Node} opts.statusMessage The node that wraps the status message elements and stores configuration information
	   */
	  function CharacterCount(opts) {
	    var _this2 = this;

	    this.statusMessage = opts.statusMessage;
	    this.statusMessageSR = this.statusMessage.querySelector('.sr-only');
	    this.statusMessageVisual = this.statusMessage.querySelector(':not(.sr-only)');
	    this.target = _getTarget$2.bind(this)();
	    this.inputMaxLength = Number(this.target.getAttribute('maxLength'));
	    this.statusMessageTemplate = this.statusMessage.getAttribute('data-status-msg-template');
	    this.maxMessageTemplate = this.statusMessage.getAttribute('data-max-msg-template');
	    this.debouncedSRUpdate = debounce(UPDATE_RATE_LIMIT, function () {
	      _updateScreenReaderStatusMessage.bind(_this2)();
	    });
	    this.srLowCharWarnLvl = this.statusMessage.getAttribute('data-sr-low-char-warning-lvl');
	    this.userHasBeenWarned = false;
	    this.ariaLiveWasReset = false; // Add event handlers

	    this.events = [{
	      el: this.target,
	      type: 'input',
	      handler: this.updateStatusMessage.bind(this)
	    }, {
	      el: this.target,
	      type: 'keydown',
	      handler: _narrateIfMaxInputAndPrintableKey.bind(this)
	    }, {
	      el: this.target,
	      type: 'focus',
	      handler: _narrateStatusMessage.bind(this)
	    }];
	    Util.addEvents(this.events); // Create custom events.

	    this[EventName$d.ON_UPDATE] = new CustomEvent(EventName$d.ON_UPDATE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$d.ON_REMOVE] = new CustomEvent(EventName$d.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    }); // Initialize visual message

	    _updateVisualStatusMessage.bind(this)(); // push to instances list


	    characterCountInstances.push(this);
	  }
	  /**
	   * Get the length of the current value of the monitored form element
	   * @returns {Number} The length of the value
	   */


	  var _proto = CharacterCount.prototype;

	  _proto.getUserInputLength = function getUserInputLength() {
	    return this.target.value.length;
	  }
	  /**
	   * Determine whether the max input length has been reached
	   * @returns {Boolean} Whether the max input length has been reached
	   */
	  ;

	  _proto.isMaxInputReached = function isMaxInputReached() {
	    return this.getUserInputLength() === this.inputMaxLength;
	  }
	  /**
	   * Determine whether the low character warning level has been met
	   * @returns {Boolean} Whether the low character warning level has been met
	   */
	  ;

	  _proto.isInputAtOrBelowLowCharWarnLvl = function isInputAtOrBelowLowCharWarnLvl() {
	    return this.inputMaxLength - this.getUserInputLength() <= this.srLowCharWarnLvl;
	  }
	  /**
	   * Updates both status messages. The visual one immediatey, the screen reader in a debounced manner.
	   */
	  ;

	  _proto.updateStatusMessage = function updateStatusMessage() {
	    this.debouncedSRUpdate();

	    _updateVisualStatusMessage.bind(this)();

	    if (!this.isMaxInputReached() && this.userHasBeenWarned && !this.ariaLiveWasReset) {
	      this.statusMessageSR.setAttribute('aria-live', 'polite');
	    }

	    if (this.isMaxInputReached() || !this.userHasBeenWarned && this.isInputAtOrBelowLowCharWarnLvl()) {
	      this.debouncedSRUpdate.cancel();
	      this.statusMessageSR.setAttribute('aria-live', 'assertive');

	      _updateScreenReaderStatusMessage.bind(this)();
	    }
	  }
	  /**
	   * Updates the object by re-reading all configuration options stored in the DOM
	   */
	  ;

	  _proto.update = function update() {
	    var _this3 = this;

	    this.target = _getTarget$2.bind(this)();
	    this.inputMaxLength = Number(this.target.getAttribute('maxLength'));
	    this.statusMessageTemplate = this.statusMessage.getAttribute('data-status-msg-template');
	    this.maxMessageTemplate = this.statusMessage.getAttribute('data-max-msg-template');
	    this.debouncedSRUpdate = debounce(UPDATE_RATE_LIMIT, function () {
	      _updateScreenReaderStatusMessage.bind(_this3)();
	    });
	    this.srLowCharWarnLvl = this.statusMessage.getAttribute('data-sr-low-char-warning-lvl');
	    this.userHasBeenWarned = false;
	    this.ariaLiveWasReset = false;
	    this.statusMessage.dispatchEvent(this[EventName$d.ON_UPDATE]);
	  }
	  /**
	   * Removes the CharacterCount instance
	   */
	  ;

	  _proto.remove = function remove() {
	    Util.removeEvents(this.events);
	    var index = characterCountInstances.indexOf(this);
	    characterCountInstances.splice(index, 1);
	    this.statusMessage.dispatchEvent(this[EventName$d.ON_REMOVE]);
	  }
	  /**
	   * Gets the array of CharacterCount instances
	   * @returns {Object[]} Array of CharacterCount instances
	   */
	  ;

	  CharacterCount.getInstances = function getInstances() {
	    return characterCountInstances;
	  };

	  return CharacterCount;
	}();

	(function () {
	  Util.initializeComponent(Selector$f.DATA_MOUNT, function (node) {
	    return new CharacterCount({
	      statusMessage: node
	    });
	  });
	})();

	var Selector$e = {
	  DATA_MOUNT: '[data-mount="click-group"]'
	};
	var EventName$c = {
	  ON_CLICK: 'onClick',
	  ON_REMOVE: 'onRemove'
	};
	var clickGroups = [];
	/**
	 * Private functions.
	 */

	function _getTarget$1() {
	  var selector = this.el.dataset.target;

	  if (selector) {
	    return document.querySelector("#" + selector);
	  }

	  var firstLink = this.el.getElementsByTagName('a')[0];
	  return firstLink ? firstLink : null;
	}

	function _onElClick(e) {
	  if (e.target !== this.target) {
	    this.el.dispatchEvent(this[EventName$c.ON_CLICK]);
	    this.target.click();
	  }
	}
	/**
	 * Class representing a click group.
	 */


	var ClickGroup = /*#__PURE__*/function () {
	  /**
	   * Create the click group.
	   * @param {Object} opts - The click group options.
	   * @param {Node} opts.el - The click group DOM node.
	   * @param {Node} [opts.target] - Node that contains the target of the click group.
	   * @param {Function} [opts.onClick] - Function to override the click group click handler.
	   */
	  function ClickGroup(opts) {
	    this.el = opts.el;
	    this.target = opts.target || _getTarget$1.bind(this)();
	    this.onClick = opts.onClick || _onElClick.bind(this); // Check for multiple links and/or buttons, which would present an a11y problem

	    if (this.el.querySelectorAll('a, button').length > 1) {
	      this.target = null; // TODO: add error message notifying multiple clickable descendants found
	    }

	    if (this.target) {
	      this.el.style.cursor = 'pointer';
	      this.events = [{
	        el: this.el,
	        type: 'click',
	        handler: this.onClick
	      }];
	      Util.addEvents(this.events);
	    } // TODO: add error message in an else block, notifying clickable target not found
	    // Create custom events


	    this[EventName$c.ON_CLICK] = new CustomEvent(EventName$c.ON_CLICK, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$c.ON_REMOVE] = new CustomEvent(EventName$c.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	    clickGroups.push(this);
	  }
	  /**
	   * Remove the click group.
	   */


	  var _proto = ClickGroup.prototype;

	  _proto.remove = function remove() {
	    if (this.target) {
	      this.el.style.cursor = '';
	      Util.removeEvents(this.events);
	    }

	    var index = clickGroups.indexOf(this);
	    clickGroups.splice(index, 1);
	    this.el.dispatchEvent(this[EventName$c.ON_REMOVE]);
	  }
	  /**
	   * Get an array of click group instances.
	   * @returns {Object[]} Array of click group instances.
	   */
	  ;

	  ClickGroup.getInstances = function getInstances() {
	    return clickGroups;
	  };

	  return ClickGroup;
	}();

	(function () {
	  Util.initializeComponent(Selector$e.DATA_MOUNT, function (node) {
	    return new ClickGroup({
	      el: node
	    });
	  });
	})();

	var instances$3 = [];
	var EventName$b = {
	  SHOW: 'onShow',
	  SHOWN: 'onShown',
	  HIDE: 'onHide',
	  HIDDEN: 'onHidden',
	  ON_REMOVE: 'onRemove'
	};
	var ClassName$b = {
	  SHOW: 'show',
	  COLLAPSE: 'collapse',
	  COLLAPSING: 'collapsing',
	  COLLAPSED: 'collapsed'
	};
	var Dimension = {
	  WIDTH: 'width',
	  HEIGHT: 'height'
	};
	var Selector$d = {
	  ACTIVES: '.show, .collapsing',
	  DATA_MOUNT: '[data-mount="collapse"]'
	};

	function _getDimension() {
	  var hasWidth = this.el.classList.contains(Dimension.WIDTH);
	  return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
	}

	function _addAriaAndCollapsedClass(element, triggerArray) {
	  var isOpen = element.classList.contains(ClassName$b.SHOW);

	  if (triggerArray.length) {
	    triggerArray.forEach(function (triggerItem) {
	      triggerItem.classList.toggle(ClassName$b.COLLAPSED, !isOpen);
	      triggerItem.setAttribute('aria-expanded', isOpen);
	    });
	  }
	}

	var Collapse = /*#__PURE__*/function () {
	  /**
	   * Create the Collapse
	   * @param {Object} opts - the Collapse options
	   * @param {Node} opts.el - the Collapse trigger element
	   * @param {boolean} [opts.toggle] - whether to toggle the Collapse on initialization
	   * @param {Node} [opts.parent] - the parent (accordion) element for group management
	   * @param {boolean} [opts.addEventListener] - suppress event listeners on Collapse trigger (when false)
	   */
	  function Collapse(opts) {
	    var _this = this;

	    this.isTransitioning = false;
	    this.isCollapsed = true;
	    this.triggerElement = opts.el;

	    if (this.triggerElement.getAttribute('aria-expanded').toString() === 'true') {
	      this.isCollapsed = false;
	    } // Get the affected selectors


	    var element = Util.getSelectorFromElement(this.triggerElement);
	    this.el = document.querySelector(element);
	    this.toggleOnInit = opts.toggle ? opts.toggle : false;
	    this.toggleArray = [].slice.call(document.querySelectorAll(Selector$d.DATA_MOUNT + "[href=\"#" + this.el.id + "\"]," + Selector$d.DATA_MOUNT + "[data-target=\"#" + this.el.id + "\"]"));
	    this[EventName$b.ON_REMOVE] = new CustomEvent(EventName$b.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$b.SHOWN] = new CustomEvent(EventName$b.SHOWN);
	    this[EventName$b.SHOW] = new CustomEvent(EventName$b.SHOW);
	    this[EventName$b.HIDE] = new CustomEvent(EventName$b.HIDE);
	    this[EventName$b.HIDDEN] = new CustomEvent(EventName$b.HIDDEN);
	    var toggleList = [].slice.call(document.querySelectorAll(Selector$d.DATA_MOUNT));
	    toggleList.forEach(function (elem) {
	      var selector = Util.getSelectorFromElement(elem);
	      var filterElement = [].slice.call(document.querySelectorAll(selector)).filter(function (foundElem) {
	        return foundElem === opts.el;
	      });

	      if (selector !== null && filterElement.length > 0) {
	        _this._selector = selector;

	        _this.toggleArray.push(elem);
	      }
	    });
	    this.parent = this.el.getAttribute('data-parent');

	    if (!opts.parent) {
	      _addAriaAndCollapsedClass.bind(this)(this.el, this.toggleArray);
	    }

	    if (this.toggleOnInit) {
	      this.toggle();
	    } // Add event handlers


	    if (opts.addEventListener !== false) {
	      this.events = [{
	        el: opts.el,
	        type: 'click',
	        handler: function handler(event) {
	          // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
	          if (event.currentTarget.tagName === 'A') {
	            event.preventDefault();
	          }

	          _this.toggle();
	        }
	      }];
	      Util.addEvents(this.events);
	    }

	    instances$3.push(this);
	  }
	  /**
	   * Toggles the collapse from show to hide and vice versa
	   */


	  var _proto = Collapse.prototype;

	  _proto.toggle = function toggle() {
	    if (this.el.classList.contains(ClassName$b.SHOW)) {
	      this.hide();
	    } else {
	      this.show();
	    }
	  }
	  /**
	   * Shows the collapse
	   */
	  ;

	  _proto.show = function show() {
	    var _this2 = this;

	    if (this.isTransitioning || this.el.classList.contains(ClassName$b.SHOW)) {
	      return;
	    }

	    this.el.dispatchEvent(this[EventName$b.SHOW]);

	    if (this[EventName$b.SHOW].defaultPrevented) {
	      return;
	    }

	    var dimension = _getDimension.bind(this)();

	    this.el.classList.remove(ClassName$b.COLLAPSE);
	    this.el.classList.add(ClassName$b.COLLAPSING);
	    this.el.style[dimension] = 0;

	    if (this.toggleArray.length) {
	      this.toggleArray.forEach(function (elem) {
	        elem.classList.remove(ClassName$b.COLLAPSED);
	        elem.setAttribute('aria-expanded', true);
	      });
	    }

	    this.isTransitioning = true; // If we have a parent (group management), hide the other elements when other is shown

	    if (this.parent) {
	      var collapseInstances = Collapse.getInstances();
	      collapseInstances.forEach(function (collapse) {
	        if (collapse !== _this2 && collapse.parent === _this2.parent && !collapse.isCollapsed) {
	          // Hide the collapse
	          collapse.toggle();
	        }
	      });
	    }

	    var complete = function complete() {
	      _this2.el.classList.remove(ClassName$b.COLLAPSING);

	      _this2.el.classList.add(ClassName$b.COLLAPSE);

	      _this2.el.classList.add(ClassName$b.SHOW);

	      _this2.el.style[dimension] = '';
	      _this2.isTransitioning = false;
	      _this2.isCollapsed = false;

	      _this2.el.dispatchEvent(_this2[EventName$b.SHOWN]);
	    };

	    var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
	    var scrollSize = "scroll" + capitalizedDimension;
	    var transitionDuration = Util.getTransitionDurationFromElement(this.el);
	    this.el.addEventListener(Util.TRANSITION_END, complete.bind(this), {
	      once: true
	    });
	    Util.emulateTransitionEnd(this.el, transitionDuration);
	    this.el.style[dimension] = this.el[scrollSize] + "px";
	  }
	  /**
	   * Hides the collapse
	   */
	  ;

	  _proto.hide = function hide() {
	    var _this3 = this;

	    if (this.isTransitioning || !this.el.classList.contains(ClassName$b.SHOW)) {
	      return;
	    }

	    this.el.dispatchEvent(this[EventName$b.HIDE]);

	    if (this[EventName$b.HIDE].defaultPrevented) {
	      return;
	    }

	    var dimension = _getDimension.bind(this)();

	    this.el.style[dimension] = this.el.getBoundingClientRect()[dimension] + "px";
	    Util.reflow(this.el);
	    this.el.classList.add(ClassName$b.COLLAPSING);
	    this.el.classList.remove(ClassName$b.COLLAPSE);
	    this.el.classList.remove(ClassName$b.SHOW);
	    this.toggleArray.forEach(function (toggle) {
	      var toggleSelector = Util.getSelectorFromElement(toggle);

	      if (toggleSelector !== null) {
	        var toggleArray = [].slice.call(document.querySelectorAll(toggleSelector));
	        toggleArray.forEach(function (el) {
	          if (!el.classList.contains(ClassName$b.SHOW)) {
	            toggle.classList.add(ClassName$b.COLLAPSED);
	            toggle.setAttribute('aria-expanded', false);
	          }
	        });
	      }
	    });
	    this.isTransitioning = true;

	    var complete = function complete() {
	      _this3.isTransitioning = false;

	      _this3.el.classList.remove(ClassName$b.COLLAPSING);

	      _this3.el.classList.add(ClassName$b.COLLAPSE);

	      _this3.isCollapsed = true;

	      _this3.el.dispatchEvent(_this3[EventName$b.HIDDEN]);
	    };

	    this.el.style[dimension] = '';
	    var transitionDuration = Util.getTransitionDurationFromElement(this.el);
	    this.el.addEventListener(Util.TRANSITION_END, complete.bind(this), {
	      once: true
	    });
	    Util.emulateTransitionEnd(this.el, transitionDuration);
	  }
	  /**
	   * Remove the event listener and the instance
	   */
	  ;

	  _proto.remove = function remove() {
	    this.el.dispatchEvent(this[EventName$b.ON_REMOVE]);
	    Util.removeEvents(this.events); // remove this collapse reference from array of instances

	    var index = instances$3.indexOf(this);
	    instances$3.splice(index, 1);
	  }
	  /**
	   * Get instances.
	   * @returns {Object[]} An array of instances
	   */
	  ;

	  Collapse.getInstances = function getInstances() {
	    return instances$3;
	  };

	  return Collapse;
	}();

	(function () {
	  Util.initializeComponent(Selector$d.DATA_MOUNT, function (node) {
	    return new Collapse({
	      el: node
	    });
	  });
	})();

	var $find = arrayIteration.find;


	var FIND = 'find';
	var SKIPS_HOLES = true;

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

	// `Array.prototype.find` method
	// https://tc39.es/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	var instances$2 = [];
	var Selector$c = {
	  DATA_MOUNT: '[data-mount="collapse-controls"]',
	  DATA_ACTION_COLLAPSE: '[data-action="collapse"]',
	  DATA_ACTION_EXPAND: '[data-action="expand"]'
	};

	function _getTarget(el) {
	  var selector = Util.getSelectorFromElement(el);
	  return [].slice.call(document.querySelectorAll(selector));
	}

	function _syncDisabledStyle() {
	  var openCount = 0;
	  this.collapseList.forEach(function (collapse) {
	    if (!collapse.isCollapsed) {
	      openCount++;
	    }
	  });

	  if (openCount === this.collapseListCount) {
	    _enableButton(this.collapse);

	    _disableButton(this.expand);
	  } else if (openCount === 0) {
	    _enableButton(this.expand);

	    _disableButton(this.collapse);
	  } else {
	    _enableButton(this.expand);

	    _enableButton(this.collapse);
	  }
	}

	function _disableButton(elem) {
	  elem.setAttribute('aria-pressed', true);
	  elem.setAttribute('aria-disabled', true);
	  elem.classList.add('inactive');
	}

	function _enableButton(elem) {
	  elem.setAttribute('aria-pressed', false);
	  elem.setAttribute('aria-disabled', false);
	  elem.classList.remove('inactive');
	}

	var CollapseControls = /*#__PURE__*/function () {
	  /**
	   * Create the CollapseControls
	   * @param {*} opts - The CollapseControls options
	   * @param {Node} opts.el - The CollapseControls DOM node.
	   */
	  function CollapseControls(opts) {
	    var _this = this;

	    this.el = opts.el;
	    this.accordion = _getTarget(this.el)[0];
	    this.collapse = this.el.querySelector(Selector$c.DATA_ACTION_COLLAPSE);
	    this.expand = this.el.querySelector(Selector$c.DATA_ACTION_EXPAND);
	    this.collapseBtnList = this.accordion.querySelectorAll(Selector$d.DATA_MOUNT);
	    this.collapseList = []; // Get the collapse instances and find the corresponding elements

	    var collapseInstances = Collapse.getInstances();
	    this.collapseBtnList.forEach(function (el) {
	      _this.collapseList.push(collapseInstances.find(function (collapse) {
	        return collapse.triggerElement === el;
	      }));
	    });
	    this.collapseListCount = this.collapseBtnList.length;
	    this.openCount = 0;
	    this[EventName$b.ON_REMOVE] = new CustomEvent(EventName$b.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this.events = [{
	      el: this.collapse,
	      type: 'click',
	      handler: this.collapseAll.bind(this)
	    }, {
	      el: this.expand,
	      type: 'click',
	      handler: this.expandAll.bind(this)
	    }];
	    this.collapseList.forEach(function (collapse) {
	      // Add the click handler to the array
	      _this.events.push({
	        el: collapse.el,
	        type: EventName$b.SHOWN,
	        handler: _syncDisabledStyle.bind(_this)
	      }, {
	        el: collapse.el,
	        type: EventName$b.HIDDEN,
	        handler: _syncDisabledStyle.bind(_this)
	      });
	    });
	    Util.addEvents(this.events);

	    _syncDisabledStyle.bind(this)();
	  }
	  /**
	   * Collapse all the elements
	   */


	  var _proto = CollapseControls.prototype;

	  _proto.collapseAll = function collapseAll() {
	    this.collapseList.forEach(function (element) {
	      element.hide();
	    });
	    this.openCount = 0;

	    _syncDisabledStyle.bind(this)();
	  }
	  /**
	   * Expand all the elements
	   */
	  ;

	  _proto.expandAll = function expandAll() {
	    var _this2 = this;

	    this.collapseList.forEach(function (element) {
	      element.show();
	      _this2.openCount = _this2.collapseListCount;
	    });

	    _syncDisabledStyle.bind(this)();
	  }
	  /**
	   * Remove the event listeners and the instance
	   */
	  ;

	  _proto.remove = function remove() {
	    this.el.dispatchEvent(this[EventName$b.ON_REMOVE]);
	    Util.removeEvents(this.events); // remove this collapse reference from array of instances

	    var index = instances$2.indexOf(this);
	    instances$2.splice(index, 1);
	  }
	  /**
	   * Get instances.
	   * @returns {Object[]} An array of instances
	   */
	  ;

	  CollapseControls.getInstances = function getInstances() {
	    return instances$2;
	  };

	  return CollapseControls;
	}();

	(function () {
	  Util.initializeComponent(Selector$c.DATA_MOUNT, function (node) {
	    return new CollapseControls({
	      el: node
	    });
	  });
	})();

	var controlElements = []; // YIQ Threshold for color changes

	var yiqContrastedThreshold = 128;
	var EventName$a = {
	  ON_CHANGE: 'onChange',
	  ON_REMOVE: 'onRemove',
	  CHANGE: 'change'
	};
	var Selector$b = {
	  COLOR_PICKER_DOT: '.color-picker-dot'
	};
	var Attributes$1 = {
	  DATA_CONTROLS: 'data-controls',
	  IMAGE: 'data-color-picker-image',
	  ID: 'id',
	  SRC: 'src'
	};
	var ClassName$a = {
	  COLOR_LIGHT: 'color-picker-dot-light'
	};
	/**
	 * Perform the calulations to figure out color of elements
	 */

	function _initializeColor() {
	  var id = this.el.getAttribute(Attributes$1.ID);
	  var label = this.el.parentNode.querySelector("label[for=\"" + id + "\"]");
	  var backgroundColor = label.querySelector(Selector$b.COLOR_PICKER_DOT).style.backgroundColor;
	  var rgbObject = Util.getRGB(backgroundColor);
	  var darkColor = {
	    r: 0,
	    g: 0,
	    b: 0
	  };
	  var darkYiq = Util.getYiq(darkColor);
	  var bgYiq = Util.getYiq(rgbObject);

	  if (Math.floor(Math.abs(bgYiq - darkYiq) > yiqContrastedThreshold)) {
	    label.classList.add(ClassName$a.COLOR_LIGHT);
	  }
	}

	var ColorPickerControl = /*#__PURE__*/function () {
	  function ColorPickerControl(opts) {
	    var _this = this;

	    this.el = opts.el;
	    this.containerTarget = opts.containerTarget;

	    _initializeColor.bind(this)();

	    this.events = [{
	      el: this.el,
	      type: EventName$a.CHANGE,
	      handler: function handler(e) {
	        return _this._controlListener(e, _this.containerTarget);
	      }
	    }];
	    Util.addEvents(this.events);
	    controlElements.push(this);
	  }
	  /**
	   * Event handler for change events
	   * @param {event} e Event
	   * @param {string} imageContainer a reference to the image container
	   */


	  var _proto = ColorPickerControl.prototype;

	  _proto._controlListener = function _controlListener(e, imageContainer) {
	    if (imageContainer) {
	      var nodeName = imageContainer.nodeName.toLowerCase();
	      var imageUrl = e.target.getAttribute(Attributes$1.IMAGE);
	      var event = new CustomEvent(EventName$a.ON_CHANGE, {
	        element: imageContainer.getAttribute(Attributes$1.ID),
	        imageUrl: imageUrl
	      });

	      if (imageUrl) {
	        // Figure out whether it's an image element or not
	        if (nodeName === 'img') {
	          imageContainer.setAttribute(Attributes$1.SRC, imageUrl);
	        } else {
	          imageContainer.style.backgroundImage = "url(" + imageUrl + ")";
	        }

	        imageContainer.dispatchEvent(event);
	      }
	    }
	  }
	  /**
	   * Get an array of color picker control instances
	   * @returns {ColorPickerControl[]} color picker control instances
	   */
	  ;

	  ColorPickerControl.getInstances = function getInstances() {
	    return controlElements;
	  }
	  /**
	   * Remove the color picker control instance
	   */
	  ;

	  _proto.remove = function remove() {
	    Util.removeEvents(this.events);
	    var index = controlElements.indexOf(this);
	    controlElements.splice(index, 1);
	    this.el.dispatchEvent(new CustomEvent(EventName$a.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    }));
	  };

	  return ColorPickerControl;
	}();

	var Selector$a = {
	  CONTROL: 'input',
	  DATA_MOUNT: '[data-mount="color-picker"]',
	  CHECKED: ':checked'
	};
	var Attributes = {
	  DATA_CONTROLS: 'data-controls',
	  IMAGE: 'data-color-picker-image'
	};
	var colorPickers = [];

	function _initializeImageSrc() {
	  // Find all the fieldsets that have a target
	  var currentFieldSet = this.el;
	  var nodeName = this.containerTarget ? this.containerTarget.nodeName.toLowerCase() : null;
	  var defaultElement = currentFieldSet.querySelector(Selector$a.CHECKED); // Set the default selected image

	  if (defaultElement) {
	    var imageUrl = defaultElement.getAttribute(Attributes.IMAGE);

	    if (imageUrl && nodeName) {
	      if (nodeName === 'img') {
	        this.containerTarget.setAttribute('src', imageUrl);
	      } else {
	        this.containerTarget.style.backgroundImage = "url(" + imageUrl + ")";
	      }
	    }
	  }
	}
	/**
	 * Initializes an instance, helper for constructor and update function
	 * @param {Object} opts the ColorPicker init options
	 * @returns {Object} the initialized or update instance of ColorPicker
	 */


	function _initInstance(opts) {
	  var _this = this;

	  // TODO remove old "opts.target" API
	  this.el = opts && opts.el || opts && opts.target || this.el;

	  if (opts && opts.target) {
	    console.log('Warning: "target" option for ColorPicker is deprecated and will removed in favor of "el" in a future version');
	  }

	  if (!this.el) {
	    // abort init if no valid base element
	    return this;
	  }

	  var controlElement = this.el.getAttribute(Attributes.DATA_CONTROLS);

	  if (controlElement) {
	    this.containerTarget = document.querySelector("#" + controlElement);

	    _initializeImageSrc.call(this);
	  }

	  this.controls = [];
	  var controls = this.el.querySelectorAll(Selector$a.CONTROL); // Iterate through our controls, adding an event listener to change the image

	  controls.forEach(function (control) {
	    _this.controls.push(new ColorPickerControl({
	      el: control,
	      containerTarget: _this.containerTarget
	    }));
	  });
	  return this;
	}
	/**
	 * Class for ColorPicker overall. Spawns instances of ColorPickerControl for each color
	 */


	var ColorPicker = /*#__PURE__*/function () {
	  /**
	   * Construct instance of ColorPicker
	   * @param {Object} opts - The ColorPicker options.
	   * @param {Node} opts.el - The ColorPicker DOM node.
	   */
	  function ColorPicker(opts) {
	    // initialize the instance and push it to the master list
	    colorPickers.push(_initInstance.call(this, opts));
	  }
	  /**
	   * Get an array of color picker instances
	   * @returns {ColorPicker[]} color picker instances
	   */


	  ColorPicker.getInstances = function getInstances() {
	    return colorPickers;
	  }
	  /**
	   * Re-initializes the instance
	   * @param {Object} opts - The ColorPicker options.
	   * @param {Node} [opts.el] - The ColorPicker DOM node.
	   */
	  ;

	  var _proto = ColorPicker.prototype;

	  _proto.update = function update(opts) {
	    Util.tearDownComponentList(this.controls);

	    _initInstance.call(this, opts);
	  }
	  /**
	   * Remove the color picker instance
	   */
	  ;

	  _proto.remove = function remove() {
	    // Call remove on each of the ColorPickerControls
	    Util.tearDownComponentList(this.controls);
	    var index = colorPickers.indexOf(this);
	    colorPickers.splice(index, 1);
	  };

	  return ColorPicker;
	}();

	(function () {
	  Util.initializeComponent(Selector$a.DATA_MOUNT, function (node) {
	    return new ColorPicker({
	      el: node
	    });
	  });
	})();

	var Selector$9 = {
	  DATA_MOUNT: '[data-mount="content-swap"]'
	};
	var EventName$9 = {
	  ON_SWAP: 'onSwap',
	  ON_HIDE: 'onHide',
	  ON_SHOW: 'onShow',
	  ON_UPDATE: 'onUpdate',
	  ON_REMOVE: 'onRemove'
	};
	var contentSwapInstances = [];

	function _getTargetList() {
	  // Reads selector from data-target attribute
	  var selector = Util.getSelectorFromElement(this.swapTrigger);
	  return [].slice.call(document.querySelectorAll(selector));
	}

	var ContentSwap = /*#__PURE__*/function () {
	  function ContentSwap(opts) {
	    this.swapTrigger = opts.swapTrigger;
	    this.targetList = _getTargetList.bind(this)(); // Add event handlers

	    this.events = [{
	      el: this.swapTrigger,
	      type: 'click',
	      handler: this.swapContent.bind(this)
	    }];
	    Util.addEvents(this.events); // Create custom events.

	    this[EventName$9.ON_SWAP] = new CustomEvent(EventName$9.ON_SWAP, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$9.ON_HIDE] = new CustomEvent(EventName$9.ON_HIDE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$9.ON_SHOW] = new CustomEvent(EventName$9.ON_SHOW, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$9.ON_UPDATE] = new CustomEvent(EventName$9.ON_UPDATE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$9.ON_REMOVE] = new CustomEvent(EventName$9.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    }); // push to instances list

	    contentSwapInstances.push(this);
	  }

	  var _proto = ContentSwap.prototype;

	  _proto.update = function update() {
	    this.targetList = _getTargetList.bind(this)();
	    this.swapTrigger.dispatchEvent(this[EventName$9.ON_UPDATE]);
	  };

	  _proto.remove = function remove() {
	    Util.removeEvents(this.events);
	    var index = contentSwapInstances.indexOf(this);
	    contentSwapInstances.splice(index, 1);
	    this.swapTrigger.dispatchEvent(this[EventName$9.ON_REMOVE]);
	  };

	  _proto.hide = function hide(element) {
	    element.setAttribute('hidden', '');
	    element.dispatchEvent(this[EventName$9.ON_HIDE]);
	  };

	  _proto.show = function show(element) {
	    element.removeAttribute('hidden');
	    element.dispatchEvent(this[EventName$9.ON_SHOW]);
	  };

	  _proto.swapContent = function swapContent() {
	    var _this = this;

	    this.swapTrigger.dispatchEvent(this[EventName$9.ON_SWAP]);
	    this.targetList.forEach(function (element) {
	      if (element.hasAttribute('hidden')) {
	        // unhides the hidden
	        _this.show(element);
	      } else {
	        // hides the unhidden
	        _this.hide(element);
	      }
	    });
	  };

	  ContentSwap.getInstances = function getInstances() {
	    return contentSwapInstances;
	  };

	  return ContentSwap;
	}();

	(function () {
	  Util.initializeComponent(Selector$9.DATA_MOUNT, function (node) {
	    return new ContentSwap({
	      swapTrigger: node
	    });
	  });
	})();

	var Debug = {
	  focusedElement: function focusedElement() {
	    document.addEventListener('focus', function () {
	      /* eslint-disable-next-line no-console */
	      console.log('focused', document.activeElement);
	    }, true);
	  }
	};

	var biDirectional = Util.isBiDirectional();
	var ClassName$9 = {
	  SHOW: 'show',
	  FADE: 'fade',
	  FADING_OUT: 'fading-out',
	  ACTIVE: 'active',
	  FLYOUT: 'flyout'
	};
	var Default$3 = {
	  START: biDirectional ? 'right' : 'left',
	  END: biDirectional ? 'left' : 'right',
	  ALIGNMENT: 'start'
	};
	var DefaultReflow = {
	  left: ['left', 'bottom', 'top', 'right'],
	  right: ['right', 'bottom', 'top', 'left'],
	  top: ['top', 'right', 'bottom', 'left'],
	  bottom: ['bottom', 'right', 'top', 'left']
	};
	/**
	 * Private functions
	 */

	function _hasReflow(node) {
	  if (node.hasAttribute('data-disable-reflow') && node.getAttribute('data-disable-reflow') !== 'false') {
	    return false;
	  }

	  return true;
	}
	/**
	 * Get the placement of a flyout.
	 * @param {string} string - The string to parse.
	 * @param {string} [defaultValue=start] - The default value to fallback to.
	 * @returns {string} The placement of the flyout.
	 */


	function _getPlacement(str, defaultValue) {
	  if (defaultValue === void 0) {
	    defaultValue = Default$3.END;
	  }

	  switch (str) {
	    case 'top':
	    case 'bottom':
	      return str;

	    case 'left':
	    case 'start':
	      return Default$3.START;

	    case 'right':
	    case 'end':
	      return Default$3.END;

	    default:
	      return defaultValue;
	  }
	}
	/**
	 * Get the alignment of a flyout.
	 * @param {string} str - The string to parse.
	 * @param {string} [defaultValue=start] - The default value to fallback to.
	 * @returns {string} The alignment enum of the flyout.
	 */

	function _getAlignment(str, defaultValue) {
	  if (defaultValue === void 0) {
	    defaultValue = Default$3.ALIGNMENT;
	  }

	  switch (str) {
	    case 'center':
	    case 'start':
	    case 'end':
	      return str;

	    default:
	      return defaultValue;
	  }
	}
	/**
	 * Get the related menu for an element.
	 * @param {Node} node - The element to find a related menu for, typically the flyout instance target.
	 * @returns {Node} The menu element.
	 */

	function _getRelatedMenu(node) {
	  if (node.attributes['aria-controls']) {
	    return document.querySelector("#" + node.attributes['aria-controls'].value);
	  }
	}
	/**
	* Get the X distance for menu positioning.
	* @param {string} textAlignment - The text alignment of the flyout's parent. Affects the left/right CSS positioning, therefore changes the translate coordinates.
	* @param {string} placement - Menu's placement in relation to the flyout trigger: 'left', 'right', 'top', or 'bottom'.
	* @param {string} alignment - Menu's alignment with the flyout trigger, correlates to read order: 'center', 'start', 'end'.
	* @param {object} boundingRect - An object containing the getBoundingClientRect() objects for the trigger and the menu.
	* @returns {number} The X distance to translate the menu.
	*/


	function _getTranslateX(textAlignment, placement, alignment, boundingRect, offset) {
	  if (offset === void 0) {
	    offset = 0;
	  }

	  var translateX = 0;
	  /* eslint-disable no-lonely-if */
	  // If text is aligned left

	  if (textAlignment === 'left') {
	    if (placement === 'right') {
	      // Place menu right of trigger
	      translateX += boundingRect.el.width + offset;
	    } else if (placement === 'left') {
	      // Place menu left of trigger
	      translateX -= boundingRect.menu.width + offset;
	    } else {
	      // Adjust alignment for top and bottom menus
	      if (alignment === 'center') {
	        translateX -= (boundingRect.menu.width - boundingRect.el.width) / 2;
	      } else if (alignment === 'end' && !biDirectional || alignment === 'start' && biDirectional) {
	        translateX -= boundingRect.menu.width - boundingRect.el.width;
	      }
	    } // If text is aligned right

	  } else {
	    if (placement === 'right') {
	      translateX += boundingRect.menu.width + offset;
	    } else if (placement === 'left') {
	      translateX -= boundingRect.el.width + offset;
	    } else {
	      if (alignment === 'center') {
	        translateX += (boundingRect.menu.width - boundingRect.el.width) / 2;
	      } else if (alignment === 'start' && !biDirectional || alignment === 'end' && biDirectional) {
	        translateX += boundingRect.menu.width - boundingRect.el.width;
	      }
	    }
	  }
	  /* eslint-enable no-lonely-if */


	  return translateX;
	}
	/**
	 * Get the Y distance for menu positioning.
	 * @param {string} placement - Menu's placement in relation to the flyout trigger: 'left', 'right', 'top', or 'bottom'.
	 * @param {string} alignment - Menu's alignment with the flyout trigger, correlates to read order: 'center', 'start', 'end'.
	 * @param {object} boundingRect - An object containing the getBoundingClientRect() objects for the trigger and the menu.
	 * @returns {number} The Y distance to translate the menu.
	 */


	function _getTranslateY(placement, alignment, boundingRect, offset) {
	  if (offset === void 0) {
	    offset = 0;
	  }

	  var translateY = 0; // Place menu above trigger

	  if (placement === 'top') {
	    translateY -= boundingRect.menu.height + offset; // Place menu below trigger
	  } else if (placement === 'bottom') {
	    translateY += boundingRect.el.height + offset;
	  } else {
	    // Adjust alignment for left and right menus

	    /* eslint-disable no-lonely-if */
	    if (alignment === 'center') {
	      translateY -= (boundingRect.menu.height - boundingRect.el.height) / 2;
	    } else if (alignment === 'end') {
	      translateY -= boundingRect.menu.height - boundingRect.el.height;
	    }
	    /* eslint-enable no-lonely-if */

	  }

	  return translateY;
	}

	var Flyout = /*#__PURE__*/function () {
	  /**
	   * Create a flyout
	   * @param {Object} opts - The flyout options
	   * @param {Node} opts.el - The element that toggles the flyout
	   * @param {Node} [opts.menu] - The element that defines the flyout menu
	   * @param {string} [opts.placement=right] - A string that defines the placement of the menu
	   * @param {string} [opts.alignment=start] - A string that defines the alignment of the menu
	   * @param {number} [opts.offset=0] - The number of pixels the menu should be offset from the trigger
	   * @param {boolean} [opts.enableReflow=true] - Whether the menu should reflow to fit within the window as best as possible
	   * @param {boolean} [opts.enableFade=true] - Whether the menu should fade in and out
	   */
	  function Flyout(opts) {
	    this.el = opts.el; // the toggle

	    this.menu = opts.menu || _getRelatedMenu(this.el); // the flyout menu

	    this.parent = this.el.offsetParent || this.el.parentElement;
	    this.placement = _getPlacement(opts.placement || this.el.getAttribute('data-placement'));
	    this.alignment = _getAlignment(opts.alignment || this.el.getAttribute('data-alignment'));
	    this.offset = opts.offset ? parseInt(opts.offset, 10) : 0;
	    this.enableReflow = typeof opts.enableReflow === 'boolean' ? opts.enableReflow : _hasReflow(this.el);
	    this.enableFade = typeof opts.enableFade === 'boolean' ? opts.enableFade : this.menu.classList.contains(ClassName$9.FADE);
	    this.shown = false; // Ensure position is set on parent element, needed for absolute positioning of menu

	    var parentPositionProperty = window.getComputedStyle(this.parent).position;

	    if (parentPositionProperty !== 'relative' && parentPositionProperty !== 'absolute') {
	      this.parent.style.position = 'relative';
	    } // Setup fade animation based on options supplied


	    if (opts.enableFade === true) {
	      this.menu.classList.add(ClassName$9.FADE);
	    } else if (opts.enableFade === false) {
	      this.menu.classList.remove(ClassName$9.FADE);
	    }
	  }
	  /**
	   * Get the current position of the menu based on enableReflow setting
	   * @returns {object} The instance's position object
	   */


	  var _proto = Flyout.prototype;

	  /**
	   * Calculates and sets the reflow position value (placement and alignment)
	   */
	  _proto.calcReflowPosition = function calcReflowPosition() {
	    // Calculate the distance of the trigger from each side of the window
	    var distFrom = {
	      top: this.boundingRect.el.top,
	      bottom: window.innerHeight - this.boundingRect.el.bottom,
	      left: this.boundingRect.el.left,
	      right: document.body.clientWidth - this.boundingRect.el.right
	    }; // Add the menu offset spacing to the width and height of the menu

	    var menuWidth = this.boundingRect.menu.width + this.offset;
	    var menuHeight = this.boundingRect.menu.height + this.offset;
	    var placements = DefaultReflow[this.placement].slice(); // Calculate the distance needed for the menu to fit inside the window

	    var distX = menuWidth - this.boundingRect.el.width;
	    var distY = menuHeight - this.boundingRect.el.height;

	    if (this.alignment === 'center') {
	      distX /= 2;
	      distY /= 2;
	    } // Copy values so we don't override original instance property


	    var placement = this.placement,
	        alignment = this.alignment; // Eliminate the placements that won't fit

	    if (distFrom.left < menuWidth) {
	      placements.splice(placements.indexOf('left'), 1);
	    }

	    if (distFrom.right < menuWidth) {
	      placements.splice(placements.indexOf('right'), 1);
	    }

	    if (distFrom.top < menuHeight) {
	      placements.splice(placements.indexOf('top'), 1);
	    }

	    if (distFrom.bottom < menuHeight) {
	      placements.splice(placements.indexOf('bottom'), 1);
	    }

	    placement = placements.length ? placements.shift() : 'bottom'; // fallback placement is always bottom
	    // Adjust the alignment of the chosen placement
	    // NOTE: Keep this logic as is for readability and sanity

	    if (placement === 'bottom' || placement === 'top') {
	      // If neither side is ideal
	      if (distFrom.left < distX && distFrom.right < distX) {
	        // Align to the Read order
	        alignment = 'start'; // LTR: If distFrom.left < distX
	      } else if (distFrom[Default$3.START] < distX) {
	        alignment = 'start';
	      } else if (distFrom[Default$3.END] <= distX) {
	        alignment = 'end';
	      }
	    } else {
	      // If placement is 'left' or 'right'
	      // If neither above nor below is ideal

	      /* eslint-disable no-lonely-if */
	      if (distFrom.top < distY && distFrom.bottom < distY) {
	        // Force the beginning of the menu content to be in view,
	        // which should force window to grow, enabling user to scroll to view entire menu
	        alignment = 'start';
	      } else if (distFrom.top < distY) {
	        alignment = 'start';
	      } else if (distFrom.bottom <= distY) {
	        alignment = 'end';
	      }
	      /* eslint-enable no-lonely-if */

	    }

	    this.reflowPosition = {
	      placement: placement,
	      alignment: alignment
	    };
	  }
	  /**
	   * Position the flyout menu
	   */
	  ;

	  _proto.positionMenu = function positionMenu() {
	    if (this.enableReflow) {
	      this.calcReflowPosition();
	    }

	    var position = this.currentPosition; // TODO - make this more robust to check box alignment (Grid/Flex) as well as inline alignment (text-align)
	    // Get the direction of text flow (affected by cascade of text-align css property and/or RTL)

	    var textAlignProperty = window.getComputedStyle(this.parent).textAlign;
	    var textAlignment = Default$3.START;

	    if (textAlignProperty === 'left' || textAlignProperty === 'right') {
	      textAlignment = textAlignProperty;
	    } else if (textAlignProperty === 'end') {
	      textAlignment = Default$3.END;
	    } // Set the transformation's "origin" based on text alignment


	    this.menu.style.top = Math.round(this.boundingRect.el.top - this.boundingRect.parent.top) + 'px';

	    if (textAlignment === 'left') {
	      this.menu.style.left = Math.round(this.boundingRect.el.left - this.boundingRect.parent.left) + 'px';
	      this.menu.style.right = 'auto';
	    } else {
	      this.menu.style.left = 'auto';
	      this.menu.style.right = -Math.round(this.boundingRect.el.right - this.boundingRect.parent.right) + 'px';
	    } // Fixes menu width to a minimun incase menu content shifts or reflows


	    this.menu.style.minWidth = Math.round(this.boundingRect.menu.width) + 'px'; // Calculate the x and y distances needed to push the menu to the correct position.

	    var x = _getTranslateX(textAlignment, position.placement, position.alignment, this.boundingRect, this.offset);

	    var y = _getTranslateY(position.placement, position.alignment, this.boundingRect, this.offset); // Set the transform style


	    this.menu.style.transform = "translate(" + Math.round(x) + "px, " + Math.round(y) + "px)"; // Reset menu classes associated with position

	    this.menu.classList.remove(ClassName$9.FLYOUT + "-left", ClassName$9.FLYOUT + "-right", ClassName$9.FLYOUT + "-top", ClassName$9.FLYOUT + "-bottom", ClassName$9.FLYOUT + "-align-start", ClassName$9.FLYOUT + "-align-end", ClassName$9.FLYOUT + "-align-center"); // Set the menu classes associated with position

	    this.menu.classList.add(ClassName$9.FLYOUT + "-" + position.placement, ClassName$9.FLYOUT + "-align-" + position.alignment);
	  }
	  /**
	   * Show the menu
	   */
	  ;

	  _proto.show = function show() {
	    this.shown = true;
	    this.el.classList.add(ClassName$9.ACTIVE);
	    this.menu.classList.add(ClassName$9.SHOW); // Store the coordinates of the associated elements for ease of reuse now that the menu has layout

	    this.boundingRect = {
	      el: this.el.getBoundingClientRect(),
	      menu: this.menu.getBoundingClientRect(),
	      parent: this.parent.getBoundingClientRect()
	    };
	    this.positionMenu();
	  }
	  /**
	   * Hide the menu
	   * @param {string} [opts={}] - Options for hiding the menu
	   * @param {boolean} [opts.setFocus=true] - Whether or not the focus should be set on the toggling element; defaults to true
	   */
	  ;

	  _proto.hide = function hide(opts) {
	    var _this = this;

	    if (opts === void 0) {
	      opts = {};
	    }

	    // Default behavior should be to set focus on toggling element
	    var setFocus = typeof opts.setFocus === 'boolean' ? opts.setFocus : true;
	    this.shown = false;
	    this.el.classList.remove(ClassName$9.ACTIVE);
	    this.menu.classList.remove(ClassName$9.SHOW); // 1. Add a class that triggers a CSS animation
	    // 2. Create an event listener that removes the class once it's animation is complete

	    if (this.enableFade) {
	      this.menu.addEventListener('animationend', function () {
	        _this.menu.classList.remove(ClassName$9.FADING_OUT);
	      }, {
	        once: true
	      }); // 2.

	      this.menu.classList.add(ClassName$9.FADING_OUT); // 1.
	    }

	    if (setFocus) {
	      // Set focus on the toggle
	      this.el.focus();
	    }
	  }
	  /**
	   * Toggle the menu state
	   */
	  ;

	  _proto.toggle = function toggle() {
	    if (this.shown) {
	      this.hide();
	    } else {
	      this.show();
	    }
	  }
	  /**
	   * Update the flyout instance
	   * @param {string} [opts={}] - Options for updating the flyout instance
	   */
	  ;

	  _proto.update = function update(opts) {
	    if (opts === void 0) {
	      opts = {};
	    }

	    // Change the placement of the menu
	    if (opts.placement) {
	      this.placement = _getPlacement(opts.placement);
	    } // Change the alignment of the menu


	    if (opts.alignment) {
	      this.alignment = _getAlignment(opts.alignment);
	    } // Change the offset of the menu


	    if (typeof opts.offset !== 'undefined') {
	      var offset = parseInt(opts.offset, 10);

	      if (!isNaN(offset)) {
	        this.offset = offset;
	      }
	    } // Change whether the menu should reflow


	    if (typeof opts.enableReflow === 'boolean') {
	      this.enableReflow = opts.enableReflow;
	    } // Change whether the menu should enable a fade animation


	    if (typeof opts.enableFade === 'boolean' && opts.enableFade !== this.enableFade) {
	      this.enableFade = opts.enableFade;
	      this.menu.classList.toggle(ClassName$9.FADE);
	    } // Update the menu position if its open


	    if (this.shown) {
	      this.positionMenu();
	    }
	  };

	  _createClass(Flyout, [{
	    key: "currentPosition",
	    get: function get() {
	      var position = {
	        placement: this.placement,
	        alignment: this.alignment
	      };

	      if (this.enableReflow) {
	        return this.reflowPosition || position; // fallback to original position, if undefined
	      }

	      return position;
	    }
	  }]);

	  return Flyout;
	}();

	var Selector$8 = {
	  DATA_MOUNT: '[data-mount="dropdown"]',
	  MENU: '.dropdown-menu'
	};
	var EventName$8 = {
	  ON_HIDE: 'onHide',
	  ON_SHOW: 'onShow',
	  ON_UPDATE: 'onUpdate',
	  ON_REMOVE: 'onRemove'
	};
	var ClassName$8 = {
	  SHOW: 'show',
	  ACTIVE: 'active',
	  BOTTOM: 'dropdown',
	  TOP: 'dropup',
	  RIGHT: 'dropright',
	  LEFT: 'dropleft',
	  MENU_RIGHT: 'dropdown-menu-right',
	  MENU_LEFT: 'dropdown-menu-left'
	};
	var Default$2 = Object.assign({}, Default$3, {
	  PLACEMENT: 'bottom'
	});
	var dropdowns = [];
	/**
	 * The event handler for when the target element is clicked.
	 * @param {MouseEvent} event - The event object.
	 */

	function _elOnClick$2(event) {
	  // Prevent page from trying to scroll to a page anchor.
	  event.preventDefault();
	  this.toggle();
	}
	/**
	 * The event handler for when a key is pressed on the target element.
	 * @param {KeyboardEvent} event - The event object.
	 */


	function _elOnKeydown$1(event) {
	  // Override keyboard functionality if element is an anchor.
	  if (event.keyCode === Util.keyCodes.SPACE || event.keyCode === Util.keyCodes.ENTER) {
	    // Trigger the same event as a click for consistency.
	    event.preventDefault();

	    _elOnClick$2.bind(this)(event);
	  } // Events for when the menu is open.


	  if (this.shown) {
	    // Menu should close with the Esc key.
	    if (event.keyCode === Util.keyCodes.ESC) {
	      this.hide();
	    }

	    if (this.arrowableItems && event.keyCode === Util.keyCodes.ARROW_DOWN) {
	      // Prevent scrolling page on down arrow.
	      event.preventDefault(); // Set focus to first focusable element in menu.

	      this.arrowableItems[0].focus();
	    }
	  }
	}
	/**
	 * The event handler for when a key is pressed on the menu
	 * @param {KeyboardEvent} event - The event object
	 */


	function _menuOnKeydown$1(event) {
	  if (event.keyCode === Util.keyCodes.ESC) {
	    this.hide();
	  }

	  if (this.arrowableItems && (event.keyCode === Util.keyCodes.ARROW_DOWN || event.keyCode === Util.keyCodes.ARROW_UP)) {
	    // Prevent scrolling page on down arrow.
	    event.preventDefault();

	    if (event.keyCode === Util.keyCodes.ARROW_DOWN && document.activeElement !== this.arrowableItems[this.arrowableItems.length - 1]) {
	      // If the down key is pressed and its NOT on the last item in the list
	      this.arrowableItems[this.arrowableItems.indexOf(document.activeElement) + 1].focus();
	    } else if (event.keyCode === Util.keyCodes.ARROW_UP && document.activeElement !== this.arrowableItems[0]) {
	      // If the up key is pressed and its NOT on the first item in the list
	      this.arrowableItems[this.arrowableItems.indexOf(document.activeElement) - 1].focus();
	    } else {
	      this.hide();
	    }
	  }
	}
	/**
	 * The event handler for when mousedown is triggered on the document.
	 * Happens before mouseup, click, and focusin to control closing of the menu without conflicting with other events.
	 * @param {Event} event - The event object
	 */


	function _documentOnMousedown$1(event) {
	  if (this.shown && !this.menu.contains(event.target) && !this.el.contains(event.target)) {
	    this.hide({
	      setFocus: false
	    });
	  }
	}
	/**
	 * The event handler for when the document receives focus
	 * @param {Event} event - The event object
	 */


	function _documentOnFocusin$1(event) {
	  if (this.shown && !this.menu.contains(event.target)) {
	    this.hide();
	  }
	}
	/**
	 * Get the placement of a dropdown from the parent node class
	 * @param {Node} node - The element to check for a placement class
	 * @returns {string} The placement of the dropdown
	 */


	function _getPlacementFromClass(node) {
	  for (var i = 0; i < node.classList.length; i++) {
	    switch (node.classList[i]) {
	      case ClassName$8.BOTTOM:
	        return 'bottom';

	      case ClassName$8.TOP:
	        return 'top';

	      case ClassName$8.LEFT:
	        return 'start';

	      case ClassName$8.RIGHT:
	        return 'end';
	    }
	  }
	}
	/**
	 * Apply the correct `drop{direction}` class according to the placement
	 * @param {Node} node - The element to apply the class to
	 * @returns {string} The placement enum of the dropdown
	 */


	function _updatePlacementClass(node, placement) {
	  var className = ClassName$8[placement.toUpperCase()];
	  node.classList.remove(ClassName$8.BOTTOM, ClassName$8.TOP, ClassName$8.RIGHT, ClassName$8.LEFT);
	  node.classList.add(className);
	}

	var Dropdown = /*#__PURE__*/function (_Flyout) {
	  _inheritsLoose(Dropdown, _Flyout);

	  /**
	   * Create a dropdown, inherited from flyout
	   * @param {Object} opts - The flyout options
	   * @param {Node} opts.el - The element that toggles the flyout
	   * @param {Node} [opts.menu] - The element that defines the flyout menu
	   * @param {string} [opts.placement=bottom] - A string that defines the placement of the menu
	   * @param {string} [opts.alignment=start] - A string that defines the alignment of the menu
	   * @param {number} [opts.offset=0] - The number of pixels the menu should be offset from the trigger
	   * @param {boolean} [opts.enableReflow=true] - Whether the menu should reflow to fit within the window as best as possible
	   */
	  function Dropdown(opts) {
	    var _this;

	    // Set super options
	    var flyoutOpts = Object.assign({}, opts);
	    var parent = flyoutOpts.el.offsetParent || flyoutOpts.el.parentElement;

	    var placementFromClass = _getPlacementFromClass(parent);

	    flyoutOpts.placement = opts.placement || placementFromClass || flyoutOpts.el.getAttribute('data-placement') || Default$2.PLACEMENT;
	    flyoutOpts.enableFade = false;
	    _this = _Flyout.call(this, flyoutOpts) || this; // Dropdown-specific setup
	    // Ensure `drop` class matches the placement of the menu
	    // Invert

	    var invertedPlacement = _getPlacement(_this.placement, Default$2.PLACEMENT);

	    _updatePlacementClass(_this.parent, invertedPlacement);

	    if (_this.menu.nodeName.toLowerCase() === 'ul' || _this.menu.nodeName.toLowerCase() === 'ol') {
	      _this.arrowableItems = Util.getTabbableElements(_this.menu);
	    } // Add event handlers.


	    _this.events = [{
	      el: _this.el,
	      type: 'click',
	      handler: _elOnClick$2.bind(_assertThisInitialized(_this))
	    }, {
	      el: _this.el,
	      type: 'keydown',
	      handler: _elOnKeydown$1.bind(_assertThisInitialized(_this))
	    }, {
	      el: _this.menu,
	      type: 'keydown',
	      handler: _menuOnKeydown$1.bind(_assertThisInitialized(_this))
	    }, {
	      el: document,
	      type: 'mousedown',
	      handler: _documentOnMousedown$1.bind(_assertThisInitialized(_this))
	    }, {
	      el: document,
	      type: 'focusin',
	      handler: _documentOnFocusin$1.bind(_assertThisInitialized(_this))
	    }];
	    Util.addEvents(_this.events); // Add mutation observers.

	    _this.menuObserver = new MutationObserver(_this.update);

	    _this.menuObserver.observe(_this.menu, {
	      childList: true,
	      subtree: true
	    }); // Create custom events.


	    _this[EventName$8.ON_HIDE] = new CustomEvent(EventName$8.ON_HIDE, {
	      bubbles: true,
	      cancelable: true
	    });
	    _this[EventName$8.ON_SHOW] = new CustomEvent(EventName$8.ON_SHOW, {
	      bubbles: true,
	      cancelable: true
	    });
	    _this[EventName$8.ON_UPDATE] = new CustomEvent(EventName$8.ON_UPDATE, {
	      bubbles: true,
	      cancelable: true
	    });
	    _this[EventName$8.ON_REMOVE] = new CustomEvent(EventName$8.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	    dropdowns.push(_assertThisInitialized(_this));
	    return _this;
	  }
	  /**
	   * Show the menu
	   */


	  var _proto = Dropdown.prototype;

	  _proto.show = function show() {
	    _Flyout.prototype.show.call(this);

	    this.el.setAttribute('aria-expanded', this.shown);
	    this.el.dispatchEvent(this[EventName$8.ON_SHOW]);
	  }
	  /**
	   * Hide the menu
	   * @param {string} [opts={}] - Options for hiding the menu
	   * @param {boolean} [opts.setFocus=true] - Whether or not the focus should be set on the toggling element; defaults to true
	   */
	  ;

	  _proto.hide = function hide(opts) {
	    if (opts === void 0) {
	      opts = {};
	    }

	    _Flyout.prototype.hide.call(this, opts);

	    this.el.setAttribute('aria-expanded', this.shown);
	    this.el.dispatchEvent(this[EventName$8.ON_HIDE]);
	  }
	  /**
	   * Update the dropdown instance
	   * @param {string} [opts={}] - Options for updating the instance
	   */
	  ;

	  _proto.update = function update(opts) {
	    if (opts === void 0) {
	      opts = {};
	    }

	    var flyoutOpts = Object.assign({}, opts);
	    flyoutOpts.enableFade = false; // disable flyout fade feature

	    if (typeof this.arrowableItems !== 'undefined') {
	      // Update the list of known focusable items within the menu.
	      this.arrowableItems = Util.getTabbableElements(this.menu);
	    }

	    if (opts.placement) {
	      flyoutOpts.placement = _getPlacement(opts.placement, Default$2.PLACEMENT);
	    }

	    _Flyout.prototype.update.call(this, flyoutOpts); // Invert dropleft/dropright classes that switch orientation in RTL


	    var invertedPlacement = _getPlacement(this.placement, Default$2.PLACEMENT);

	    _updatePlacementClass(this.parent, invertedPlacement);

	    this.el.dispatchEvent(this[EventName$8.ON_UPDATE]);
	  }
	  /**
	   * Remove the dropdown instance
	   */
	  ;

	  _proto.remove = function remove() {
	    // Remove event handlers, observers, etc.
	    Util.removeEvents(this.events); // Remove this reference from the array of instances

	    var index = dropdowns.indexOf(this);
	    dropdowns.splice(index, 1);
	    this.el.dispatchEvent(this[EventName$8.ON_REMOVE]);
	  }
	  /**
	   * Get an array of dropdown instances
	   * @returns {Object[]} Array of dropdown instances
	   */
	  ;

	  Dropdown.getInstances = function getInstances() {
	    return dropdowns;
	  };

	  return Dropdown;
	}(Flyout);

	(function () {
	  Util.initializeComponent(Selector$8.DATA_MOUNT, function (node) {
	    return new Dropdown({
	      el: node
	    });
	  });
	})();

	var formStars = [];
	var Selector$7 = {
	  DATA_MOUNT: '[data-mount="form-star"]',
	  INPUTS: '.form-star-input',
	  LABEL: 'data-checked-label',
	  TEXT: '.form-star-text'
	};
	var ClassName$7 = {
	  EMPTY: 'form-star-empty'
	};
	var EventName$7 = {
	  ON_REMOVE: 'onRemove'
	};
	/**
	  * Remove empty class
	  */

	function _removeEmptyStyles() {
	  this.el.classList.remove(ClassName$7.EMPTY);
	}
	/**
	  * Mouse leave event
	  */


	function _onMouseLeave() {
	  if (!this.getCheckedInputs().length) {
	    this.el.classList.add(ClassName$7.EMPTY);
	  }
	}
	/**
	 * Change event
	 */


	function _onChange(e) {
	  this.checkedLabel.textContent = e.target.labels[0].querySelector(Selector$7.TEXT).textContent;

	  _removeEmptyStyles.bind(this)();
	}
	/**
	 * Check for disabled form elements
	 * @returns {boolean} true if fieldset or all radios are disabled
	 */


	function _isDisabled() {
	  var disabled = [].slice.call(this.inputs).filter(function (input) {
	    return input.disabled === true;
	  });
	  return disabled.length === this.inputs.length || this.el.closest('fieldset').disabled;
	}
	/**
	 * HTMLInputElement.labels for unsupported browsers
	 */


	function _setLabels() {
	  if (!this.inputs[0].labels) {
	    var labels = this.el.querySelectorAll('label');
	    [].slice.call(labels).forEach(function (label) {
	      if (label.htmlFor) {
	        var input = document.getElementById(label.htmlFor);

	        if (input) {
	          input.labels = [label];
	        }
	      }
	    });
	  }
	}
	/**
	  * Class representing form star.
	  */


	var FormStar = /*#__PURE__*/function () {
	  /**
	    * Initialize form star.
	    * @param {Object} opts - The form star options.
	    * @param {Node} opts.el - The form star wrapping element.
	    * @param {Node} opts.checkedLabel - The visible container for the checked input label text.
	    */
	  function FormStar(opts) {
	    var _this = this;

	    this.el = opts.el;
	    this.inputs = this.el.querySelectorAll(Selector$7.INPUTS);
	    this.checkedLabel = opts.checkedLabel || document.getElementById(this.el.getAttribute(Selector$7.LABEL));
	    this.isDisabled = _isDisabled.bind(this)();
	    this.events = [{
	      el: this.el,
	      type: 'mouseenter',
	      handler: _removeEmptyStyles.bind(this)
	    }, {
	      el: this.el,
	      type: 'mouseleave',
	      handler: _onMouseLeave.bind(this)
	    }, {
	      el: this.el,
	      type: 'change',
	      handler: function handler(e) {
	        _onChange.bind(_this)(e);
	      }
	    }];

	    if (this.isDisabled) {
	      this.events = [];
	    }

	    formStars.push(this);

	    _setLabels.bind(this)();

	    var checked = this.getCheckedInputs();

	    if (checked.length) {
	      this.checkedLabel.textContent = checked[0].labels[0].querySelector(Selector$7.TEXT).textContent;
	    } else {
	      this.el.classList.add(ClassName$7.EMPTY);
	    } // Add event handlers.


	    Util.addEvents(this.events); // Create custom events.

	    this[EventName$7.ON_REMOVE] = new CustomEvent(EventName$7.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	  }
	  /**
	    * Filters for checked inputs
	    * @returns {array} checked inputs
	    */


	  var _proto = FormStar.prototype;

	  _proto.getCheckedInputs = function getCheckedInputs() {
	    return [].slice.call(this.inputs).filter(function (input) {
	      return input.checked === true;
	    });
	  }
	  /**
	    * Remove the form star.
	    */
	  ;

	  _proto.remove = function remove() {
	    // Remove event handlers.
	    Util.removeEvents(this.events); // remove this form star reference from array of instances

	    var index = formStars.indexOf(this);
	    formStars.splice(index, 1);
	    this.el.dispatchEvent(this[EventName$7.ON_REMOVE]);
	  }
	  /**
	    * Get an array of form star instances.
	    * @returns {Object[]} Array of form star instances.
	    */
	  ;

	  FormStar.getInstances = function getInstances() {
	    return formStars;
	  };

	  return FormStar;
	}();

	(function () {
	  Util.initializeComponent(Selector$7.DATA_MOUNT, function (node) {
	    return new FormStar({
	      el: node
	    });
	  });
	})();

	var quot = /"/g;

	// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	// https://tc39.es/ecma262/#sec-createhtml
	var createHtml = function (string, tag, attribute, value) {
	  var S = String(requireObjectCoercible(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};

	// check the existence of a method, lowercase
	// of a tag and escaping quotes in arguments
	var stringHtmlForced = function (METHOD_NAME) {
	  return fails(function () {
	    var test = ''[METHOD_NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  });
	};

	// `String.prototype.link` method
	// https://tc39.es/ecma262/#sec-string.prototype.link
	_export({ target: 'String', proto: true, forced: stringHtmlForced('link') }, {
	  link: function link(url) {
	    return createHtml(this, 'a', 'href', url);
	  }
	});

	var defineProperty = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aFunction(callbackfn);
	    var O = toObject(that);
	    var self = indexedObject(O);
	    var length = toLength(O.length);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError('Reduce of empty array with no initial value');
	      }
	    }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduce
	  left: createMethod(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
	  right: createMethod(true)
	};

	var $reduce = arrayReduce.left;




	var STRICT_METHOD = arrayMethodIsStrict('reduce');
	// Chrome 80-82 has a critical bug
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
	var CHROME_BUG = !engineIsNode && engineV8Version > 79 && engineV8Version < 83;

	// `Array.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-array.prototype.reduce
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD || CHROME_BUG }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var Selector$6 = {
	  DATA_MOUNT: '.needs-validation, [data-mount="validation"]',
	  INPUTS: 'input, select, textarea',
	  SUBMIT: '[type="submit"]',
	  FEEDBACK_LIST: '[data-mount="feedback-list"]',
	  FEEDBACK_EL: 'data-feedback',
	  FEEDBACK_CONTENT: 'data-feedback-content',
	  CHECKBOX_REQUIRED: 'data-form-check-required',
	  CHECKBOX_MAX: 'data-form-check-max'
	};
	var EventName$6 = {
	  ON_VALID: 'onValid',
	  ON_REMOVE: 'onRemove'
	};
	var ClassName$6 = {
	  DISPLAY: {
	    NONE: 'd-none'
	  },
	  IS_INVALID: 'is-invalid'
	};
	var formValidations = [];
	/**
	 * Private functions.
	 */

	/**
	 * Create link to input field with feedback at bottom of form
	 * @param {Node} input - The form input field.
	 */

	function _createFeedbackLink(input) {
	  if (!input.feedback.link) {
	    var feedbackItem = document.createElement('li');
	    var feedbackLink = document.createElement('a');
	    var feedbackTextNode = document.createTextNode(input.feedback.content);
	    feedbackLink.setAttribute('href', "#" + input.id);
	    input.feedback.focusControls = new Util.FocusControls({
	      el: feedbackLink
	    });
	    feedbackLink.append(feedbackTextNode);
	    feedbackItem.append(feedbackLink);
	    input.feedback.link = feedbackItem;

	    if (input.group) {
	      input.group.siblings.forEach(function (sibling) {
	        sibling.feedback.link = feedbackItem;
	        sibling.feedback.focusControls = input.feedback.focusControls;
	      });
	    }
	  }

	  this.feedbackList.append(input.feedback.link);

	  if (!input.feedback.focusControls) {
	    input.feedback.focusControls = new Util.FocusControls({
	      el: input.feedback.link.querySelector('a')
	    });
	  }

	  input.feedback.linkRemoved = false;

	  if (input.group) {
	    input.group.siblings.forEach(function (sibling) {
	      sibling.feedback.linkRemoved = false;
	    });
	  }

	  this.feedbackListContainer.classList.remove(ClassName$6.DISPLAY.NONE);
	}
	/**
	 * Remove link to input field with feedback at bottom of form
	 * @param {Node} input - The form input field.
	 */


	function _removeFeedbackLink(input) {
	  if (input.group) {
	    input.group.siblings.forEach(function (sibling) {
	      sibling.feedback.linkRemoved = true;
	      sibling.feedback.focusControls.remove();
	    });
	  } else {
	    input.feedback.linkRemoved = true;
	    input.feedback.focusControls.remove();
	  }

	  input.feedback.link.remove();

	  if (this.feedbackList.children.length === 0) {
	    this.feedbackListContainer.classList.add(ClassName$6.DISPLAY.NONE);
	  }
	}
	/**
	 * Generate feedback data object from data attrbutes
	 * @param {Node} input - The form input field.
	 * @returns {Object} Object with feedback data.
	 */


	function _getFeedbackData(input) {
	  var feedback = {
	    id: input.getAttribute(Selector$6.FEEDBACK_EL)
	  };

	  if (feedback.id) {
	    feedback.content = input.getAttribute(Selector$6.FEEDBACK_CONTENT);
	    feedback.el = this.el.querySelector("#" + feedback.id);
	    feedback.linkRemoved = true;
	  }

	  return feedback;
	}
	/**
	 * Events for when input is valid
	 * @param {Node} input - The form input field.
	 */


	function _onValid(input) {
	  input.classList.remove(ClassName$6.IS_INVALID);
	  input.setAttribute('aria-invalid', false);

	  if (input.group) {
	    input.group.siblings.forEach(function (sibling) {
	      sibling.classList.remove(ClassName$6.IS_INVALID);
	      sibling.setAttribute('aria-invalid', false);
	    });
	  }

	  if (input.feedback.el) {
	    input.feedback.el.classList.remove(ClassName$6.IS_INVALID);
	    input.feedback.el.textContent = '';

	    if (this.feedbackList && input.feedback.link && !input.feedback.linkRemoved) {
	      _removeFeedbackLink.bind(this)(input);
	    }
	  }
	}
	/**
	 * Events for when input is invalid
	 * @param {Node} input - The form input field.
	 * @param {Object} feedback - The feedback options.
	 * @param {Node} feedback.el - The input feedback element.
	 * @param {string} feedback.content - The feedback content.
	 */


	function _onInvalid(input) {
	  input.classList.add(ClassName$6.IS_INVALID);
	  input.setAttribute('aria-invalid', true);

	  if (input.group) {
	    input.group.siblings.forEach(function (sibling) {
	      sibling.classList.add(ClassName$6.IS_INVALID);
	      sibling.setAttribute('aria-invalid', true);
	    });
	  }

	  if (input.feedback.el && input.feedback.content) {
	    input.feedback.el.classList.add(ClassName$6.IS_INVALID);
	    input.feedback.el.textContent = input.feedback.content;

	    if (this.feedbackList && input.feedback.linkRemoved) {
	      _createFeedbackLink.bind(this)(input);
	    }
	  }
	}
	/**
	 * Generate group data object from input
	 * @param {Node} input - The form input field.
	 * @returns {Object} Object with group data.
	 */


	function _inputCheckReducer(input) {
	  var name = input.name,
	      type = input.type;
	  return [].slice.call(this.inputs).reduce(function (obj, _input) {
	    if (_input.type === type && _input.name === name) {
	      if (obj.siblings) {
	        obj.siblings.push(_input);
	      } else {
	        obj.siblings = [_input];
	      }

	      var requiredMin = _input.getAttribute(Selector$6.CHECKBOX_REQUIRED);

	      var maxValid = _input.getAttribute(Selector$6.CHECKBOX_MAX); // Selector.CHECKBOX_REQUIRED attribute accepts either a boolean or integer
	      // If it's a boolean convert to an integer


	      if (requiredMin) {
	        var requiredMinInt = Number(requiredMin);

	        if (isNaN(requiredMinInt)) {
	          requiredMinInt = requiredMin === 'true' ? 1 : 0;
	        }

	        obj.requiredMin = requiredMinInt;
	      }

	      if (maxValid) {
	        var maxValidInt = Number(maxValid);
	        var maxValidIntIsNaN = isNaN(maxValidInt);

	        if (!maxValidIntIsNaN) {
	          obj.maxValid = maxValidInt;
	        }
	      }

	      if (_input.getAttribute(Selector$6.FEEDBACK_EL)) {
	        if (obj.feedback) {
	          obj.feedback.push(_input);
	        } else {
	          obj.feedback = [_input];
	        }
	      }
	    }

	    return obj;
	  }, {});
	}
	/**
	 * Setup inputs with required data.
	 * @param {Node} input - The form input field.
	 */


	function _inputInit(input) {
	  var type = input.type;
	  var feedbackEl = input;

	  if (input.required) {
	    // the default aria-invalid attribute is false but some screenreaders do not respect this
	    input.setAttribute('aria-invalid', false);
	  }

	  if (type === 'radio' || type === 'checkbox') {
	    var group = _inputCheckReducer.bind(this)(input);

	    var feedback = group.feedback,
	        _group = _objectWithoutPropertiesLoose(group, ["feedback"]);

	    if (_group.siblings.length > 1) {
	      input.group = _group;
	    }

	    if (feedback) {
	      feedbackEl = feedback[0];
	    }
	  }

	  input.feedback = _getFeedbackData.bind(this)(feedbackEl);
	}
	/**
	 * Setup inputs with required data.
	 * @param {Node} input - The form input field.
	 */


	function _setFeedbackListFocusEl() {
	  var tagNames = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'];
	  var prevEl = this.feedbackList.previousElementSibling;
	  this.feedbackListFocusEl = this.feedbackListContainer;

	  if (prevEl && tagNames.indexOf(prevEl.tagName) > -1) {
	    this.feedbackListFocusEl = prevEl;
	  }

	  this.feedbackListFocusEl.tabIndex = -1;
	}
	/**
	 * Class representing form validation.
	 */


	var FormValidation = /*#__PURE__*/function () {
	  /**
	   * Initialize form validation.
	   * @param {Object} opts - The form validation options.
	   * @param {Node} opts.el - The form DOM node.
	   * @param {Boolean} opts.preventFormSubmission - flag to prevent form submission
	   * @param {Node} opts.feedbackListContainer - The feedback list container DOM node.
	   */
	  function FormValidation(opts) {
	    var _this = this;

	    this.el = opts.el;
	    this.preventFormSubmission = opts.preventFormSubmission || this.el.dataset.preventFormSubmission !== undefined;
	    this.allowEmptySubmit = opts.allowEmptySubmit || this.el.dataset.allowEmptySubmit !== undefined;
	    this.inputs = this.el.querySelectorAll(Selector$6.INPUTS);
	    this.submit = this.el.querySelector(Selector$6.SUBMIT);
	    this.feedbackListContainer = opts.feedbackListContainer || this.el.querySelector(Selector$6.FEEDBACK_LIST);

	    if (this.feedbackListContainer) {
	      this.feedbackList = this.feedbackListContainer.querySelector('ol');

	      _setFeedbackListFocusEl.bind(this)();
	    }

	    this.events = [{
	      el: this.el,
	      type: 'submit',
	      handler: function handler(e) {
	        _this.onSubmit(e);
	      }
	    }];
	    formValidations.push(this); // Hide empty feedback list

	    if (this.feedbackList && this.feedbackList.children.length === 0) {
	      this.feedbackListContainer.classList.add(ClassName$6.DISPLAY.NONE);
	    } // Set up inputs


	    this.inputs.forEach(function (input) {
	      _inputInit.bind(_this)(input);

	      _this.events.push({
	        el: input,
	        type: 'blur',
	        handler: function handler() {
	          setTimeout(function () {
	            _this.validate(input, true);
	          }, 0);
	        }
	      }, {
	        el: input,
	        type: 'change',
	        handler: function handler() {
	          _this.validate(input, true);
	        }
	      });
	    }); // Add event handlers.

	    Util.addEvents(this.events); // Create custom events.

	    this[EventName$6.ON_REMOVE] = new CustomEvent(EventName$6.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$6.ON_VALID] = new CustomEvent(EventName$6.ON_VALID, {
	      bubbles: true,
	      cancelable: true
	    });
	  }
	  /**
	   * Validate form input
	   * @param {Node} input - The form input field.
	   * @param {boolean} onlyOnValid - Only runs if valid.
	   */


	  var _proto = FormValidation.prototype;

	  _proto.validate = function validate(input, onlyOnValid) {
	    var activeEl = document.activeElement;

	    if (!input.name || input.name !== activeEl.name) {
	      if (this.isInputValid(input)) {
	        _onValid.bind(this)(input);
	      } else if (!onlyOnValid) {
	        _onInvalid.bind(this)(input);
	      }
	    }
	  }
	  /**
	   * Check if input is valid
	   * @param {Node} input - The form input field.
	   * @returns {Boolean} - true if input is valid.
	   */
	  ;

	  _proto.isInputValid = function isInputValid(input) {
	    // Radio and check groups
	    if (input.group && (input.group.requiredMin || input.group.maxValid)) {
	      // get number of checked inputs in the group
	      var checked = input.group.siblings.filter(function (sibling) {
	        return sibling.checked === true;
	      }); // compare against required min or max

	      if (input.group.requiredMin && checked.length < input.group.requiredMin || input.group.maxValid && checked.length > input.group.maxValid) {
	        return false;
	      }

	      return true;
	    }

	    return input.checkValidity();
	  }
	  /**
	   * Check if form is valid
	   * @returns {Boolean} - true if all form inputs are valid.
	   */
	  ;

	  _proto.isFormValid = function isFormValid() {
	    var _this2 = this;

	    var checkValidity = [].slice.call(this.inputs).some(function (input) {
	      return _this2.isInputValid(input) === false;
	    });
	    return !checkValidity;
	  }
	  /**
	   * Check if form is empty
	   * @returns {Boolean} - false if any form inputs are checked or have a value.
	   */
	  ;

	  _proto.isFormEmpty = function isFormEmpty() {
	    var notEmpty = [].slice.call(this.inputs).some(function (input) {
	      var type = input.type;

	      if (type === 'radio' || type === 'checkbox') {
	        if (input.checked) {
	          return true;
	        }
	      } else if (input.value !== null && input.value !== undefined && input.value.trim().length) {
	        return true;
	      }

	      return false;
	    });
	    return !notEmpty;
	  }
	  /**
	   * Submit form
	   * @param {Event} e - The event object.
	   */
	  ;

	  _proto.onSubmit = function onSubmit(e) {
	    var _this3 = this;

	    e.preventDefault();
	    this.inputs.forEach(function (input) {
	      _this3.validate(input);
	    });

	    if (this.isFormValid()) {
	      this.el.dispatchEvent(this[EventName$6.ON_VALID]);

	      if (!this.preventFormSubmission && (!this.isFormEmpty() || this.allowEmptySubmit)) {
	        this.el.submit();
	      }
	    } else if (this.feedbackListFocusEl) {
	      this.feedbackListFocusEl.focus();
	    }
	  }
	  /**
	   * Remove the form validation.
	   */
	  ;

	  _proto.remove = function remove() {
	    // Remove event handlers
	    Util.removeEvents(this.events); // remove this form validation reference from array of instances

	    var index = formValidations.indexOf(this);
	    formValidations.splice(index, 1);
	    this.el.dispatchEvent(this[EventName$6.ON_REMOVE]);
	  }
	  /**
	   * Get an array of form validation instances.
	   * @returns {Object[]} Array of form validation instances.
	   */
	  ;

	  FormValidation.getInstances = function getInstances() {
	    return formValidations;
	  };

	  return FormValidation;
	}();

	(function () {
	  Util.initializeComponent(Selector$6.DATA_MOUNT, function (node) {
	    return new FormValidation({
	      el: node
	    });
	  });
	})();

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var freezing = !fails(function () {
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	var defineProperty = objectDefineProperty.f;



	var METADATA = uid('meta');
	var id = 0;

	var isExtensible = Object.isExtensible || function () {
	  return true;
	};

	var setMetadata = function (it) {
	  defineProperty(it, METADATA, { value: {
	    objectID: 'O' + ++id, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has$1(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData = function (it, create) {
	  if (!has$1(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (freezing && meta.REQUIRED && isExtensible(it) && !has$1(it, METADATA)) setMetadata(it);
	  return it;
	};

	var meta = module.exports = {
	  REQUIRED: false,
	  fastKey: fastKey,
	  getWeakData: getWeakData,
	  onFreeze: onFreeze
	};

	hiddenKeys$1[METADATA] = true;
	});

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var ArrayPrototype = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR$2] === it);
	};

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1]
	    || it['@@iterator']
	    || iterators[classof(it)];
	};

	var iteratorClose = function (iterator) {
	  var returnMethod = iterator['return'];
	  if (returnMethod !== undefined) {
	    return anObject(returnMethod.call(iterator)).value;
	  }
	};

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var iterate = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = functionBindContext(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose(iterator);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    } return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = toLength(iterable.length); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && result instanceof Result) return result;
	      } return new Result(false);
	    }
	    iterator = iterFn.call(iterable);
	  }

	  next = iterator.next;
	  while (!(step = next.call(iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose(iterator);
	      throw error;
	    }
	    if (typeof result == 'object' && result && result instanceof Result) return result;
	  } return new Result(false);
	};

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  } return it;
	};

	var ITERATOR = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal -- required for testing
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = global$1[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var nativeMethod = NativePrototype[KEY];
	    redefine(NativePrototype, KEY,
	      KEY == 'add' ? function add(value) {
	        nativeMethod.call(this, value === 0 ? 0 : value);
	        return this;
	      } : KEY == 'delete' ? function (key) {
	        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'get' ? function get(key) {
	        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'has' ? function has(key) {
	        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : function set(key, value) {
	        nativeMethod.call(this, key === 0 ? 0 : key, value);
	        return this;
	      }
	    );
	  };

	  var REPLACE = isForced_1(
	    CONSTRUCTOR_NAME,
	    typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
	      new NativeConstructor().entries().next();
	    }))
	  );

	  if (REPLACE) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    internalMetadata.REQUIRED = true;
	  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new -- required for testing
	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (dummy, iterable) {
	        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
	        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
	        if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

	    // weak collections should not contains .clear method
	    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  _export({ global: true, forced: Constructor != NativeConstructor }, exported);

	  setToStringTag(Constructor, CONSTRUCTOR_NAME);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};

	var getWeakData = internalMetadata.getWeakData;








	var setInternalState$1 = internalState.set;
	var internalStateGetterFor = internalState.getterFor;
	var find = arrayIteration.find;
	var findIndex = arrayIteration.findIndex;
	var id = 0;

	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function (store) {
	  return store.frozen || (store.frozen = new UncaughtFrozenStore());
	};

	var UncaughtFrozenStore = function () {
	  this.entries = [];
	};

	var findUncaughtFrozen = function (store, key) {
	  return find(store.entries, function (it) {
	    return it[0] === key;
	  });
	};

	UncaughtFrozenStore.prototype = {
	  get: function (key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) return entry[1];
	  },
	  has: function (key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function (key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) entry[1] = value;
	    else this.entries.push([key, value]);
	  },
	  'delete': function (key) {
	    var index = findIndex(this.entries, function (it) {
	      return it[0] === key;
	    });
	    if (~index) this.entries.splice(index, 1);
	    return !!~index;
	  }
	};

	var collectionWeak = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, CONSTRUCTOR_NAME);
	      setInternalState$1(that, {
	        type: CONSTRUCTOR_NAME,
	        id: id++,
	        frozen: undefined
	      });
	      if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	    });

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var data = getWeakData(anObject(key), true);
	      if (data === true) uncaughtFrozenStore(state).set(key, value);
	      else data[state.id] = value;
	      return that;
	    };

	    redefineAll(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function (key) {
	        var state = getInternalState(this);
	        if (!isObject(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
	        return data && has$1(data, state.id) && delete data[state.id];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has(key) {
	        var state = getInternalState(this);
	        if (!isObject(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state).has(key);
	        return data && has$1(data, state.id);
	      }
	    });

	    redefineAll(C.prototype, IS_MAP ? {
	      // 23.3.3.3 WeakMap.prototype.get(key)
	      get: function get(key) {
	        var state = getInternalState(this);
	        if (isObject(key)) {
	          var data = getWeakData(key);
	          if (data === true) return uncaughtFrozenStore(state).get(key);
	          return data ? data[state.id] : undefined;
	        }
	      },
	      // 23.3.3.5 WeakMap.prototype.set(key, value)
	      set: function set(key, value) {
	        return define(this, key, value);
	      }
	    } : {
	      // 23.4.3.1 WeakSet.prototype.add(value)
	      add: function add(value) {
	        return define(this, value, true);
	      }
	    });

	    return C;
	  }
	};

	createCommonjsModule(function (module) {






	var enforceIternalState = internalState.enforce;


	var IS_IE11 = !global$1.ActiveXObject && 'ActiveXObject' in global$1;
	var isExtensible = Object.isExtensible;
	var InternalWeakMap;

	var wrapper = function (init) {
	  return function WeakMap() {
	    return init(this, arguments.length ? arguments[0] : undefined);
	  };
	};

	// `WeakMap` constructor
	// https://tc39.es/ecma262/#sec-weakmap-constructor
	var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak);

	// IE11 WeakMap frozen keys fix
	// We can't use feature detection because it crash some old IE builds
	// https://github.com/zloirock/core-js/issues/485
	if (nativeWeakMap && IS_IE11) {
	  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
	  internalMetadata.REQUIRED = true;
	  var WeakMapPrototype = $WeakMap.prototype;
	  var nativeDelete = WeakMapPrototype['delete'];
	  var nativeHas = WeakMapPrototype.has;
	  var nativeGet = WeakMapPrototype.get;
	  var nativeSet = WeakMapPrototype.set;
	  redefineAll(WeakMapPrototype, {
	    'delete': function (key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeDelete.call(this, key) || state.frozen['delete'](key);
	      } return nativeDelete.call(this, key);
	    },
	    has: function has(key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) || state.frozen.has(key);
	      } return nativeHas.call(this, key);
	    },
	    get: function get(key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
	      } return nativeGet.call(this, key);
	    },
	    set: function set(key, value) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
	      } else nativeSet.call(this, key, value);
	      return this;
	    }
	  });
	}
	});

	var charAt = stringMultibyte.charAt;



	var STRING_ITERATOR = 'String Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	var instances$1 = [];
	var EventName$5 = {
	  HIDE: 'onHide',
	  HIDDEN: 'onHidden',
	  SHOW: 'onShow',
	  SHOWN: 'onShown',
	  ON_REMOVE: 'onRemove',
	  FOCUSIN: 'focusin',
	  RESIZE: 'resize',
	  CLICK_DISMISS: 'click.dismiss',
	  KEYDOWN: 'keydown'
	};
	var ClassName$5 = {
	  SCROLLABLE: 'modal-dialog-scrollable',
	  SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
	  BACKDROP: 'modal-backdrop',
	  OPEN: 'modal-open',
	  FADE: 'fade',
	  SHOW: 'show'
	};
	var Selector$5 = {
	  DIALOG: '.modal-dialog',
	  MODAL_BODY: '.modal-body',
	  MODAL: '[data-mount="modal"]',
	  DATA_DISMISS: '[data-dismiss="modal"]',
	  FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
	  STICKY_CONTENT: '.sticky-top'
	}; // Event Handlers

	/**
	 * Handler for keydown event
	 * @param {Event} event The event fired by the listener
	 */

	function keydownEvent(event) {
	  switch (Util.getKeyCode(event)) {
	    case Util.keyCodes.ESC:
	      event.preventDefault();
	      this.hide();
	      break;

	    case Util.keyCodes.TAB:
	      if ((document.activeElement === this.firstTabbableElement || document.activeElement === this.el) && event.shiftKey) {
	        event.preventDefault();
	        this.lastTabbableElement.focus();
	      }

	      if (document.activeElement === this.lastTabbableElement && !event.shiftKey) {
	        event.preventDefault();
	        this.firstTabbableElement.focus();
	      }

	      break;
	  }
	}
	/**
	 * Handler for focus event
	 * @param {Event} event The event fired by the listener
	 */


	function focusEvent(event) {
	  if (document !== event.target && this.el !== event.target && !this.el.contains(event.target)) {
	    this.el.focus();
	  }
	}
	/**
	 * Handler for backdrop event
	 * @param {Event} event The event fired by the listener
	 */


	function backdropEvent(event) {
	  if (!this.dialog.contains(event.target)) {
	    // create and dispatch the event
	    this.el.dispatchEvent(this[EventName$5.CLICK_DISMISS]);
	  }
	}
	/**
	 * Handler for dismiss click event
	 * @param {Event} event The event fired by the listener
	 */


	function clickDismissHandler(event) {
	  if (this.ignoreBackdropClick) {
	    this.ignoreBackdropClick = false;
	    return;
	  }

	  if (event.target !== event.currentTarget) {
	    return;
	  }

	  this.hide();
	}
	/**
	 * Handles the internal logic for showing an element
	 */


	function _showElement() {
	  var _this = this;

	  var transition = this.el.classList.contains(ClassName$5.FADE);

	  if (!this.el.parentNode || this.el.parentNode.nodeType !== Node.ELEMENT_NODE) {
	    // Don't move modal's DOM position
	    document.body.append(this.el);
	  }

	  this.el.style.display = 'block';
	  this.el.removeAttribute('aria-hidden');
	  this.el.setAttribute('aria-modal', true);

	  if (this.dialog.classList.contains(ClassName$5.SCROLLABLE)) {
	    this.dialog.querySelector(Selector$5.MODAL_BODY).scrollTop = 0;
	  } else {
	    this.el.scrollTop = 0;
	  }

	  if (transition) {
	    Util.reflow(this.el);
	  }

	  this.el.classList.add(ClassName$5.SHOW);

	  _enforceFocus.call(this);

	  var transitionComplete = function transitionComplete() {
	    var modalHeader = _this.el.querySelector('.modal-header'); // For accessibility purposes, scrollable modals will have the focus set to the header if the following conditions are met:
	    // 1) Modal is scrollable
	    // 2) There is a value for title.
	    // If there is no value for title, then there will be no text in the header. So, focus will be set to the modal window.
	    // Implemented for instances such as image gallery, where content is automatically read by screen readers when shown (2439).


	    var elementReceivingFocus = modalHeader.getAttribute('tabindex') === '-1' ? modalHeader : _this.el;
	    elementReceivingFocus.focus();
	    _this.isTransitioning = false;

	    _this.el.dispatchEvent(_this[EventName$5.SHOWN]);
	  };

	  if (transition) {
	    var transitionDuration = Util.getTransitionDurationFromElement(this.dialog);
	    this.dialog.addEventListener(Util.TRANSITION_END, transitionComplete.bind(this), {
	      once: true
	    });
	    Util.emulateTransitionEnd(this.dialog, transitionDuration);
	  } else {
	    transitionComplete.call(this);
	  }
	}
	/**
	 * Ensures the the focus is enforced on an element
	 */


	function _enforceFocus() {
	  document.removeEventListener(EventName$5.FOCUSIN, focusEvent); // Guard against infinite focus loop

	  document.addEventListener(EventName$5.FOCUSIN, focusEvent.bind(this));
	}
	/**
	 * Add and remove the event listeners for the keydown event
	 */


	function _setKeydownEvents() {
	  if (this.isShown) {
	    this.el.addEventListener(EventName$5.KEYDOWN, keydownEvent.bind(this));
	  } else {
	    this.el.removeEventListener(EventName$5.KEYDOWN, keydownEvent);
	  }
	}
	/**
	 * Add and remove the resize event
	 */


	function _setResizeEvent() {
	  var _this2 = this;

	  if (this.isShown) {
	    window.addEventListener(EventName$5.RESIZE, function (event) {
	      return _this2.handleUpdate(event);
	    });
	  } else {
	    window.removeEventListener(EventName$5.RESIZE, function (event) {
	      return _this2.handleUpdate(event);
	    });
	  }
	}
	/**
	 * Private handler for hiding a modal
	 */


	function _hideModal() {
	  var _this3 = this;

	  this.el.style.display = 'none';
	  this.el.setAttribute('aria-hidden', true);
	  this.el.removeAttribute('aria-modal');
	  this.isTransitioning = false;

	  _showBackdrop.call(this, function () {
	    document.body.classList.remove(ClassName$5.OPEN);

	    _resetAdjustments.call(_this3);

	    _resetScrollbar.call(_this3);

	    _this3.el.dispatchEvent(_this3[EventName$5.HIDDEN]);

	    document.body.removeEventListener('click', backdropEvent);
	  });
	}
	/**
	 * Remove backdrop from DOM
	 */


	function _removeBackdrop() {
	  if (this.backdrop) {
	    this.backdrop.remove();
	    this.backdrop = null;
	  } // Return the focus to the trigger


	  if (this.trigger) {
	    this.trigger.focus();
	  }
	}
	/**
	 * Show Backdrop
	 * @param {*} callback Function to callback once backdrop is shown
	 */


	function _showBackdrop(callback) {
	  var _this4 = this;

	  var animate = this.el.classList.contains(ClassName$5.FADE) ? ClassName$5.FADE : '';

	  if (this.isShown) {
	    this.backdrop = document.createElement('div');
	    this.backdrop.className = ClassName$5.BACKDROP;

	    if (animate) {
	      this.backdrop.classList.add(animate);
	    }

	    document.body.append(this.backdrop);
	    document.body.addEventListener('click', backdropEvent.bind(this));
	    this.el.addEventListener(EventName$5.CLICK_DISMISS, clickDismissHandler.bind(this));

	    if (animate) {
	      Util.reflow(this.backdrop);
	    }

	    this.backdrop.classList.add(ClassName$5.SHOW);

	    if (!callback) {
	      return;
	    }

	    if (!animate) {
	      callback();
	      return;
	    }

	    var backdropTransitionDuration = Util.getTransitionDurationFromElement(this.backdrop);
	    this.backdrop.addEventListener(Util.TRANSITION_END, callback, {
	      once: true
	    });
	    Util.emulateTransitionEnd(this.backdrop, backdropTransitionDuration);
	  } else if (!this.isShown && this.backdrop) {
	    this.backdrop.classList.remove(ClassName$5.SHOW);

	    var callbackRemove = function callbackRemove() {
	      _removeBackdrop.call(_this4);

	      if (callback) {
	        callback();
	      }
	    };

	    if (this.el.classList.contains(ClassName$5.FADE)) {
	      var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this.backdrop);

	      this.backdrop.addEventListener(Util.TRANSITION_END, callbackRemove, {
	        once: true
	      });
	      Util.emulateTransitionEnd(this.backdrop, _backdropTransitionDuration);
	    } else {
	      callbackRemove();
	    }
	  } else if (callback) {
	    callback();
	  }
	} // ----------------------------------------------------------------------
	// the following methods are used to handle overflowing modals
	// ----------------------------------------------------------------------


	function _adjustDialog() {
	  var isModalOverflowing = this.el.scrollHeight > document.documentElement.clientHeight;

	  if (!this.isBodyOverflowing && isModalOverflowing) {
	    this.el.style.paddingLeft = this.scrollbarWidth + "px";
	  }

	  if (this.isBodyOverflowing && !isModalOverflowing) {
	    this.el.style.paddingRight = this.scrollbarWidth + "px";
	  }
	}

	function _resetAdjustments() {
	  this.el.style.paddingLeft = '';
	  this.el.style.paddingRight = '';
	}

	function _checkScrollbar() {
	  var rect = document.body.getBoundingClientRect();
	  this.isBodyOverflowing = rect.left + rect.right < window.innerWidth;
	  this.scrollbarWidth = _getScrollbarWidth();
	}

	function _setScrollbar() {
	  var _this5 = this;

	  if (this.isBodyOverflowing) {
	    // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
	    var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));
	    var stickyContent = [].slice.call(document.querySelectorAll(Selector$5.STICKY_CONTENT)); // Adjust fixed content padding

	    fixedContent.forEach(function (element) {
	      var actualPadding = element.style.paddingRight ? element.style.paddingRight : 0;
	      var calculatedPadding = getComputedStyle(element)['padding-right'];

	      _this5.data.set({
	        element: element,
	        attribute: 'padding-right'
	      }, actualPadding);

	      element.style.paddingRight = parseFloat(calculatedPadding) + _this5.scrollbarWidth + "px";
	    }); // Adjust sticky content margin

	    stickyContent.forEach(function (element) {
	      var actualMargin = element.style.marginRight ? element.style.marginRight : 0;
	      var calculatedMargin = getComputedStyle(element)['margin-right'];

	      _this5.data.set({
	        element: element,
	        attribute: 'margin-right'
	      }, actualMargin);

	      element.style.marginRight = parseFloat(calculatedMargin) - _this5.scrollbarWidth + "px";
	    }); // Adjust body padding

	    var actualPadding = document.body.style.paddingRight ? document.body.style.paddingRight : 0;
	    var calculatedPadding = getComputedStyle(document.body)['padding-right'];
	    this.data.set({
	      element: document.body,
	      attribute: 'padding-right'
	    }, actualPadding);
	    document.body.style.paddingRight = parseFloat(calculatedPadding) + this.scrollbarWidth + "px";
	  }

	  document.body.classList.add(ClassName$5.OPEN);
	}

	function _resetScrollbar() {
	  var _this6 = this;

	  // Restore fixed content padding
	  var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));
	  fixedContent.forEach(function (element) {
	    var key = {
	      element: element,
	      attribute: 'padding-right'
	    }; // Retrieve the element from the Map

	    var padding = _this6.data.get(key);

	    element.style.paddingRight = padding ? padding : ''; // Remove the item from the map

	    _this6.data.delete(key);
	  }); // Restore sticky content

	  var elements = [].slice.call(document.querySelectorAll("" + Selector$5.STICKY_CONTENT));
	  elements.forEach(function (element) {
	    var key = {
	      element: element,
	      attribute: 'margin-right'
	    }; // Retrieve the element from the Map

	    var margin = _this6.data.get(key);

	    if (typeof margin !== 'undefined') {
	      element.style.marginRight = margin;

	      _this6.data.delete(key);
	    }
	  }); // Restore body padding

	  var key = {
	    element: document.body,
	    attribute: 'padding-right'
	  };
	  var padding = this.data.get(key);
	  this.data.delete(key);
	  document.body.style.paddingRight = padding ? padding : '';
	}

	function _getScrollbarWidth() {
	  // thx d.walsh
	  var scrollDiv = document.createElement('div');
	  scrollDiv.className = ClassName$5.SCROLLBAR_MEASURER;
	  document.body.append(scrollDiv);
	  var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
	  scrollDiv.remove();
	  return scrollbarWidth;
	}
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */


	var Modal = /*#__PURE__*/function () {
	  /**
	   * Create a Modal.
	   * @param {Object} opts - The modal options.
	   * @param {Node} opts.el - The modal.
	   */
	  function Modal(opts) {
	    var _this7 = this;

	    // Modal element
	    this.el = opts.el; // Toggle button for modal

	    this.button = document.querySelector("[data-target=\"#" + this.el.id + "\"]");
	    this.dialog = this.el.querySelector(Selector$5.DIALOG);
	    this.backdrop = null;
	    this.isShown = false;
	    this.isBodyOverflowing = false;
	    this.ignoreBackdropClick = false;
	    this.isTransitioning = false;
	    this.scrollbarWidth = 0;
	    this.data = new WeakMap(); // Used for circular tabbing in while modal is open.

	    this.tabbableElements = Util.getTabbableElements(this.dialog);
	    this.firstTabbableElement = this.tabbableElements[0];
	    this.lastTabbableElement = this.tabbableElements[this.tabbableElements.length - 1];
	    this[EventName$5.ON_REMOVE] = new CustomEvent(EventName$5.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$5.SHOWN] = new CustomEvent(EventName$5.SHOWN, {
	      detail: this.el
	    });
	    this[EventName$5.SHOW] = new CustomEvent(EventName$5.SHOW, {
	      detail: this.el
	    });
	    this[EventName$5.HIDE] = new CustomEvent(EventName$5.HIDE);
	    this[EventName$5.HIDDEN] = new CustomEvent(EventName$5.HIDDEN);
	    this[EventName$5.CLICK_DISMISS] = new CustomEvent(EventName$5.CLICK_DISMISS); // Add event handlers

	    this.events = [];

	    if (this.button) {
	      this.events = [{
	        el: this.button,
	        type: 'click',
	        handler: function handler(event) {
	          _this7.toggle(event);
	        }
	      }];
	      Util.addEvents(this.events);
	    }

	    if (opts.displayOnInit || this.el.dataset.displayOnInit === 'true') {
	      this.show();
	    }

	    instances$1.push(this);
	  }
	  /**
	   * Toggle hide and show states of the modal
	   * @param {Event} event - The event that fired the toggle
	   */


	  var _proto = Modal.prototype;

	  _proto.toggle = function toggle(event) {
	    if (event) {
	      this.trigger = event.target;
	    }

	    return this.isShown ? this.hide() : this.show();
	  }
	  /**
	   * Show the modal
	   */
	  ;

	  _proto.show = function show() {
	    var _this8 = this;

	    if (this.isShown || this.isTransitioning) {
	      return;
	    }

	    if (this.el.classList.contains(ClassName$5.FADE)) {
	      this.isTransitioning = true;
	    }

	    this.el.dispatchEvent(this[EventName$5.SHOW]);

	    if (this.isShown || this[EventName$5.SHOW].defaultPrevented) {
	      return;
	    }

	    this.isShown = true;

	    _checkScrollbar.call(this);

	    _setScrollbar.call(this);

	    _adjustDialog.call(this);

	    _setKeydownEvents.call(this);

	    _setResizeEvent.call(this); // Add event listeners to the dismiss action


	    this.el.addEventListener(EventName$5.CLICK_DISMISS, function (event) {
	      return _this8.hide(event);
	    }); // Find all the dismiss attribute elements and cause the modal to hide

	    this.el.querySelectorAll(Selector$5.DATA_DISMISS).forEach(function (_element) {
	      return _element.addEventListener('click', function (event) {
	        return _this8.hide(event);
	      });
	    });

	    _showBackdrop.call(this, function () {
	      return _showElement.call(_this8);
	    });
	  }
	  /**
	   * Hide the modal
	   * @param {Event} event the event that triggered the hide
	   */
	  ;

	  _proto.hide = function hide(event) {
	    var _this9 = this;

	    if (event) {
	      event.preventDefault();
	    }

	    if (!this.isShown || this.isTransitioning) {
	      return;
	    }

	    this.el.dispatchEvent(this[EventName$5.HIDE]);

	    if (!this.isShown || this[EventName$5.HIDE].defaultPrevented) {
	      return;
	    }

	    this.isShown = false;
	    var transition = this.el.classList.contains(ClassName$5.FADE);

	    if (transition) {
	      this.isTransitioning = true;
	    }

	    _setKeydownEvents.call(this);

	    _setResizeEvent.call(this);

	    var mainContent = document.querySelector('body > main');

	    if (mainContent && mainContent.getAttribute('aria-hidden') === 'true') {
	      mainContent.removeAttribute('aria-hidden');
	    }

	    document.removeEventListener(EventName$5.FOCUSIN, focusEvent);
	    this.el.classList.remove(ClassName$5.SHOW);
	    this.el.removeEventListener(EventName$5.CLICK_DISMISS, clickDismissHandler);

	    if (transition) {
	      var transitionDuration = Util.getTransitionDurationFromElement(this.el);
	      this.el.addEventListener(Util.TRANSITION_END, function (event) {
	        return _hideModal.call(_this9, event);
	      }, {
	        once: true
	      });
	      Util.emulateTransitionEnd(this.el, transitionDuration);
	    } else {
	      _hideModal.call(this);
	    }
	  }
	  /**
	   * Handle update that happens with the modal
	   */
	  ;

	  _proto.handleUpdate = function handleUpdate() {
	    _adjustDialog.call(this);
	  }
	  /**
	   * Remove the event handlers
	   */
	  ;

	  _proto.remove = function remove() {
	    // Remove event handlers, observers, etc.
	    Util.removeEvents(this.events);
	    document.removeEventListener(EventName$5.FOCUSIN, focusEvent); // Remove this reference from the array of instances.

	    var index = instances$1.indexOf(this);
	    instances$1.splice(index, 1);
	    this.el.dispatchEvent(this[EventName$5.ON_REMOVE]);
	  }
	  /**
	   * Get the modal instances.
	   * @returns {Object[]} An array of modal instances
	   */
	  ;

	  Modal.getInstances = function getInstances() {
	    return instances$1;
	  };

	  return Modal;
	}();

	(function () {
	  Util.initializeComponent(Selector$5.MODAL, function (node) {
	    return new Modal({
	      el: node
	    });
	  });
	})();

	var Selector$4 = {
	  DATA_MOUNT: '[data-mount="popover"]'
	};
	var EventName$4 = {
	  ON_HIDE: 'onHide',
	  ON_SHOW: 'onShow',
	  ON_UPDATE: 'onUpdate',
	  ON_REMOVE: 'onRemove'
	};
	var ClassName$4 = Object.assign({}, ClassName$9, {
	  POPOVER: 'popover',
	  CLOSE: 'close',
	  ARROW: 'arrow'
	});
	var Default$1 = Object.assign({}, Default$3, {
	  CLOSE_LABEL: 'Close dialog',
	  ALIGNMENT: 'center'
	});
	var popovers = [];
	/**
	 * The event handler for when the target element is clicked
	 * @param {MouseEvent} event - The event object
	 */

	function _elOnClick$1(event) {
	  // Prevent page from trying to scroll to a page anchor
	  event.preventDefault();
	  this.toggle();
	}
	/**
	 * The event handler for when a key is pressed on the target element
	 * @param {KeyboardEvent} event - The event object
	 */


	function _elOnKeydown(event) {
	  if (event.keyCode === Util.keyCodes.SPACE || event.keyCode === Util.keyCodes.ENTER) {
	    // Trigger the same event as a click for consistency.
	    // Note: Since focus should be trapped within the menu while open, these events should only ever apply when the menu is closed.
	    // If somehow a keyboard event is triggered on the target element, go a head and close the menu as if it was clicked.
	    event.preventDefault();

	    _elOnClick$1.bind(this)(event);
	  }
	}
	/**
	 * The event handler for when a key is pressed on the menu
	 * @param {KeyboardEvent} event - The event object
	 */


	function _menuOnKeydown(event) {
	  if (event.keyCode === Util.keyCodes.ESC) {
	    this.hide();
	  }
	}
	/**
	 * The event handler for when the close button is clicked.
	 * Note: browser also triggers this when space or enter is pressed on a button.
	 * @param {MouseEvent} event - The event object
	 */


	function _closeOnClick(event) {
	  // Prevent page from trying to scroll to a page anchor
	  event.preventDefault();
	  this.hide();
	}
	/**
	 * The event handler for when mousedown is triggered on the document.
	 * Happens before mouseup, click, and focusin to control closing of the menu without conflicting with other events.
	 * @param {Event} event - The event object
	 */


	function _documentOnMousedown(event) {
	  if (this.shown && !this.menu.contains(event.target) && !this.el.contains(event.target)) {
	    this.hide({
	      setFocus: false
	    });
	  }
	}
	/**
	 * The event handler for when the document receives focus
	 * @param {Event} event - The event object
	 */


	function _documentOnFocusin(event) {
	  if (this.shown && !this.menu.contains(event.target)) {
	    // Trap keyboard focus within the menu until the popover is closed by the user
	    this.menu.focus();
	  }
	}
	/**
	 * Gets the related menu or creates one if none is associated
	 * @param {Node} node - The element associated with the menu, typically the popover trigger
	 * @returns {Node} The menu element
	 */


	function _getOrCreateMenu$1(node) {
	  if (node.attributes['aria-controls']) {
	    return document.querySelector("#" + node.attributes['aria-controls'].value);
	  }

	  if (node.attributes['data-content']) {
	    var menu = document.createElement('div');
	    var menuId = ClassName$4.POPOVER + "_" + Util.getUid();
	    /* eslint-disable quotes */

	    var menuContents = "<div class=\"popover-content\">" + ("<div class=\"popover-body\">" + node.getAttribute('data-content') + "</div>") + "</div>";
	    /* eslint-enable quotes */

	    menu.setAttribute('id', menuId);
	    menu.classList.add(ClassName$4.POPOVER);
	    menu.setAttribute('role', 'dialog');
	    menu.setAttribute('tabindex', '-1');
	    menu.setAttribute('aria-labelledby', node.id);
	    menu.innerHTML = menuContents;
	    menu.prepend(_createCloseBtn({
	      label: node.getAttribute('data-close-label')
	    }));
	    node.setAttribute('aria-expanded', 'false');
	    node.setAttribute('aria-controls', menuId);
	    node.after(menu);
	    return menu;
	  }
	}
	/**
	 * Create a close button element
	 * @param {Object} [opts={}] - Options for the button element
	 * @param {string} [opts.label=Default.CLOSE_LABEL] - The aria-label value for the button
	 * @returns {Node} The a close button element
	 */


	function _createCloseBtn(opts) {
	  if (opts === void 0) {
	    opts = {};
	  }

	  var btn = document.createElement('button');
	  btn.classList.add(ClassName$4.CLOSE);
	  btn.setAttribute('aria-label', opts.label || Default$1.CLOSE_LABEL);
	  return btn;
	}
	/**
	 * Creates a decorative arrow element for the menu
	 * @param {Node} node - The element to add the arrow to, typically the menu
	 * @returns {Node} The arrow element
	 */


	function _createPopoverArrow(node) {
	  var arrow = document.createElement('div');
	  arrow.classList.add(ClassName$4.ARROW);
	  node.append(arrow);
	  return arrow;
	}

	var Popover = /*#__PURE__*/function (_Flyout) {
	  _inheritsLoose(Popover, _Flyout);

	  /**
	   * Create a popover, inherited from flyout
	   * @param {Object} opts - The flyout options
	   * @param {Node} opts.el - The element that toggles the flyout
	   * @param {Node} [opts.menu] - The element that defines the flyout menu
	   * @param {string} [opts.placement=right] - A string that defines the placement of the menu
	   * @param {string} [opts.alignment=center] - A string that defines the alignment of the menu
	   * @param {number} [opts.offset=16] - The number of pixels the menu should be offset from the trigger
	   * @param {boolean} [opts.enableReflow=true] - Whether the menu should reflow to fit within the window as best as possible
	   * @param {boolean} [opts.enableFade=true] - Whether the menu should fade in and out
	   */
	  function Popover(opts) {
	    var _this;

	    // Set super options
	    var flyoutOpts = Object.assign({}, opts);
	    flyoutOpts.menu = opts.menu || _getOrCreateMenu$1(flyoutOpts.el);
	    flyoutOpts.alignment = _getAlignment(opts.alignment || flyoutOpts.el.getAttribute('data-alignment'), Default$1.ALIGNMENT);
	    flyoutOpts.offset = opts.offset ? parseInt(opts.offset, 10) : 16;
	    flyoutOpts.enableFade = typeof opts.enableFade === 'boolean' ? opts.enableFade : true;
	    _this = _Flyout.call(this, flyoutOpts) || this; // Popover-specific setup

	    _this.arrow = _createPopoverArrow(_this.menu); // Get the "close" button within the menu

	    var closeBtn = _this.menu.querySelector('button.close');

	    if (!closeBtn) {
	      closeBtn = _createCloseBtn({
	        label: _this.el.getAttribute('data-close-label')
	      });

	      _this.menu.prepend(closeBtn);
	    } // Add event handlers


	    _this.events = [{
	      el: _this.el,
	      type: 'click',
	      handler: _elOnClick$1.bind(_assertThisInitialized(_this))
	    }, {
	      el: _this.el,
	      type: 'keydown',
	      handler: _elOnKeydown.bind(_assertThisInitialized(_this))
	    }, {
	      el: _this.menu,
	      type: 'keydown',
	      handler: _menuOnKeydown.bind(_assertThisInitialized(_this))
	    }, {
	      el: closeBtn,
	      type: 'click',
	      handler: _closeOnClick.bind(_assertThisInitialized(_this))
	    }, {
	      el: document,
	      type: 'mousedown',
	      handler: _documentOnMousedown.bind(_assertThisInitialized(_this))
	    }, {
	      el: document,
	      type: 'focusin',
	      handler: _documentOnFocusin.bind(_assertThisInitialized(_this))
	    }];
	    Util.addEvents(_this.events); // Create custom events

	    _this[EventName$4.ON_HIDE] = new CustomEvent(EventName$4.ON_HIDE, {
	      bubbles: true,
	      cancelable: true
	    });
	    _this[EventName$4.ON_SHOW] = new CustomEvent(EventName$4.ON_SHOW, {
	      bubbles: true,
	      cancelable: true
	    });
	    _this[EventName$4.ON_UPDATE] = new CustomEvent(EventName$4.ON_UPDATE, {
	      bubbles: true,
	      cancelable: true
	    });
	    _this[EventName$4.ON_REMOVE] = new CustomEvent(EventName$4.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	    popovers.push(_assertThisInitialized(_this));
	    return _this;
	  }
	  /**
	   * Position the flyout menu
	   */


	  var _proto = Popover.prototype;

	  _proto.positionMenu = function positionMenu() {
	    _Flyout.prototype.positionMenu.call(this);

	    this.positionMenuArrow();
	  }
	  /**
	   * Position the menu's arrow
	   */
	  ;

	  _proto.positionMenuArrow = function positionMenuArrow() {
	    var position = this.currentPosition; // Reset positioning

	    this.arrow.style.top = null;
	    this.arrow.style.bottom = null;
	    this.arrow.style.left = null;
	    this.arrow.style.right = null; // Top and bottom menus

	    if (position.placement === 'top' || position.placement === 'bottom') {
	      if (position.alignment === 'start') {
	        this.arrow.style[Default$1.START] = Math.round(this.boundingRect.el.width / 2) - this.arrow.offsetWidth / 2 + 'px';
	      } else if (position.alignment === 'end') {
	        this.arrow.style[Default$1.END] = Math.round(this.boundingRect.el.width / 2) - this.arrow.offsetWidth / 2 + 'px';
	      } else {
	        this.arrow.style.left = Math.round(this.boundingRect.menu.width / 2) - this.arrow.offsetWidth / 2 + 'px';
	      } // Left and right menus

	    } else if (position.alignment === 'start') {
	      this.arrow.style.top = Math.round(this.boundingRect.el.height / 2) - this.arrow.offsetWidth / 2 + 'px';
	    } else if (position.alignment === 'end') {
	      this.arrow.style.bottom = Math.round(this.boundingRect.el.height / 2) - this.arrow.offsetWidth / 2 + 'px';
	    } else {
	      this.arrow.style.top = Math.round(this.boundingRect.menu.height / 2) - this.arrow.offsetWidth / 2 + 'px';
	    }
	  }
	  /**
	   * Show the menu
	   */
	  ;

	  _proto.show = function show() {
	    _Flyout.prototype.show.call(this);

	    this.el.setAttribute('aria-expanded', this.shown);
	    this.menu.focus();
	    this.el.dispatchEvent(this[EventName$4.ON_SHOW]);
	  }
	  /**
	   * Hide the menu
	   * @param {string} [opts={}] - Options for hiding the menu
	   * @param {boolean} [opts.setFocus=true] - Whether or not the focus should be set on the toggling element; defaults to true
	   */
	  ;

	  _proto.hide = function hide(opts) {
	    if (opts === void 0) {
	      opts = {};
	    }

	    _Flyout.prototype.hide.call(this, opts);

	    this.el.setAttribute('aria-expanded', this.shown);
	    this.el.dispatchEvent(this[EventName$4.ON_HIDE]);
	  }
	  /**
	   * Update the popover instance
	   * @param {string} [opts={}] - Options for updating the instance
	   */
	  ;

	  _proto.update = function update(opts) {
	    if (opts === void 0) {
	      opts = {};
	    }

	    var flyoutOpts = Object.assign({}, opts); // Enforce popover's default alignment as fallback

	    if (opts.alignment) {
	      flyoutOpts.alignment = _getAlignment(opts.alignment, Default$1.ALIGNMENT);
	    }

	    _Flyout.prototype.update.call(this, flyoutOpts);

	    this.el.dispatchEvent(this[EventName$4.ON_UPDATE]);
	  }
	  /**
	   * Remove the popover instance
	   */
	  ;

	  _proto.remove = function remove() {
	    // Remove event handlers, observers, etc.
	    Util.removeEvents(this.events); // Remove this reference from the array of instances

	    var index = popovers.indexOf(this);
	    popovers.splice(index, 1);
	    this.el.dispatchEvent(this[EventName$4.ON_REMOVE]);
	  }
	  /**
	   * Get an array of popover instances
	   * @returns {Object[]} Array of popover instances
	   */
	  ;

	  Popover.getInstances = function getInstances() {
	    return popovers;
	  };

	  return Popover;
	}(Flyout);

	(function () {
	  Util.initializeComponent(Selector$4.DATA_MOUNT, function (node) {
	    return new Popover({
	      el: node
	    });
	  });
	})();

	var Selector$3 = {
	  TOGGLE: '.show-more-show-less-toggle',
	  ELLIPSIS: '.show-more-show-less-ellipsis',
	  TOGGLEABLE_CONTENT: '.show-more-show-less-toggleable-content',
	  DATA_MOUNT: '[data-mount="show-more-show-less"]'
	};
	var ClassName$3 = {
	  DISPLAY_NONE: 'd-none'
	};
	var EventName$3 = {
	  ON_HIDE: 'onHide',
	  ON_SHOW: 'onShow',
	  ON_REMOVE: 'onRemove',
	  ON_UPDATE: 'onUpdate'
	};
	var instances = [];

	function _elOnClick() {
	  this.toggle();
	} // Makes hidden content untabbable after hide()


	function _toggleableContentOnFocusOut(element) {
	  element.removeAttribute('tabindex');
	}

	var ShowMoreShowLess = /*#__PURE__*/function () {
	  /**
	   * Create a show-more-show-less component.
	   * @param {Object} opts - The show-more-show-less options.
	   * @param {Node} opts.el - The container element for content that will be hidden/shown.
	   * @returns {Object} show-more-show-less instance.
	   */
	  function ShowMoreShowLess(opts) {
	    /**
	     * Defines which variant should be instantiated.
	     */
	    if (opts.el.hasAttribute('data-count')) {
	      // eslint-disable-next-line no-constructor-return
	      return new ShowMoreShowLessMultiElement({
	        el: opts.el,
	        hideAfter: opts.el.getAttribute('data-count')
	      });
	    } // eslint-disable-next-line no-constructor-return


	    return new ShowMoreShowLessSingleElement({
	      el: opts.el
	    });
	  }
	  /**
	   * Return the number of instances.
	   * @returns {Object[]} an array of active instances.
	   */


	  ShowMoreShowLess.getInstances = function getInstances() {
	    return instances;
	  };

	  return ShowMoreShowLess;
	}();

	var ShowMoreShowLessBase = /*#__PURE__*/function () {
	  /**
	   * Defines a show-more-show-less base component.
	   * @param {Object} opts - The show-more-show-less options.
	   */
	  function ShowMoreShowLessBase(opts) {
	    /**
	     * The container element for content that will be hidden/shown.
	     */
	    this.el = opts.el;
	    /**
	     * The element bound with the toggle event handler.
	     */

	    this.control = this.el.querySelector(Selector$3.TOGGLE);
	    /**
	     * The control text values.
	     */

	    this.showMoreText = opts.showMoreText || this.control.textContent;
	    this.showLessText = opts.showLessText || this.control.getAttribute('data-show-less-text');
	    /**
	     * The element demarking shown and hidden content.
	     */

	    this.ellipsis = this.el.querySelector(Selector$3.ELLIPSIS);
	    this.shown = false;
	    /**
	     * Event binders.
	     */

	    this.events = [{
	      el: this.control,
	      type: 'click',
	      handler: _elOnClick.bind(this)
	    }];
	    /**
	     * Custom events to track component state.
	     */

	    this[EventName$3.ON_HIDE] = new CustomEvent(EventName$3.ON_HIDE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$3.ON_SHOW] = new CustomEvent(EventName$3.ON_SHOW, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$3.ON_REMOVE] = new CustomEvent(EventName$3.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$3.ON_UPDATE] = new CustomEvent(EventName$3.ON_UPDATE, {
	      bubbles: true,
	      cancelable: true
	    });
	    instances.push(this);
	  }
	  /**
	   * Focus new element when show and hide.
	   * @param {Node} element. The element to focus.
	   */


	  var _proto = ShowMoreShowLessBase.prototype;

	  _proto.setFocusToElement = function setFocusToElement(element) {
	    element.setAttribute('tabindex', 0);
	    document.activeElement.blur();
	    element.focus();
	  }
	  /**
	   * Show toggleable content.
	   */
	  ;

	  _proto.show = function show() {
	    this.shown = true;

	    if (this.ellipsis) {
	      this.ellipsis.classList.add(ClassName$3.DISPLAY_NONE);
	    }

	    this.control.setAttribute('aria-expanded', true);
	    this.control.textContent = this.showLessText;
	    this.control.dispatchEvent(this[EventName$3.ON_SHOW]);
	  }
	  /**
	   * Hide toggleable content.
	   */
	  ;

	  _proto.hide = function hide() {
	    this.shown = false;

	    if (this.ellipsis) {
	      this.ellipsis.classList.remove(ClassName$3.DISPLAY_NONE);
	    }

	    this.control.setAttribute('aria-expanded', false);
	    this.control.textContent = this.showMoreText;
	    this.control.dispatchEvent(this[EventName$3.ON_HIDE]);
	  }
	  /**
	   * Event handler for control click event.
	   */
	  ;

	  _proto.toggle = function toggle() {
	    if (this.shown) {
	      this.hide();
	    } else {
	      this.show();
	    }
	  }
	  /**
	   * Removes active instance of component.
	   */
	  ;

	  _proto.remove = function remove() {
	    Util.removeEvents(this.events); // Remove this reference from the array of instances.

	    var index = instances.indexOf(this);
	    instances.splice(index, 1);
	    this.control.dispatchEvent(this[EventName$3.ON_REMOVE]);
	  };

	  return ShowMoreShowLessBase;
	}();

	var ShowMoreShowLessSingleElement = /*#__PURE__*/function (_ShowMoreShowLessBase) {
	  _inheritsLoose(ShowMoreShowLessSingleElement, _ShowMoreShowLessBase);

	  /**
	   * Create a single-element variant, inherits from ShowMoreShowLessBase.
	   *  @param {Object} opts - The show-more-show-less options.
	   */
	  function ShowMoreShowLessSingleElement(opts) {
	    var _this;

	    _this = _ShowMoreShowLessBase.call(this, opts) || this;
	    /**
	     * The content that will be shown/hidden.
	     */

	    _this.toggleableContent = _this.el.querySelector(Selector$3.TOGGLEABLE_CONTENT);

	    _this.events.push({
	      el: _this.toggleableContent,
	      type: 'focusout',
	      handler: _toggleableContentOnFocusOut.bind(null, _this.toggleableContent)
	    });

	    Util.addEvents(_this.events);

	    _this.toggleableContent.setAttribute('tabindex', -1);

	    _this.toggleableContent.classList.add(ClassName$3.DISPLAY_NONE);

	    return _this;
	  }
	  /**
	   * Show toggleable content.
	   */


	  var _proto2 = ShowMoreShowLessSingleElement.prototype;

	  _proto2.show = function show() {
	    _ShowMoreShowLessBase.prototype.show.call(this);

	    this.toggleableContent.classList.remove(ClassName$3.DISPLAY_NONE);

	    _ShowMoreShowLessBase.prototype.setFocusToElement.call(this, this.toggleableContent);
	  }
	  /**
	   * Hide toggleable content.
	   */
	  ;

	  _proto2.hide = function hide() {
	    _ShowMoreShowLessBase.prototype.hide.call(this);

	    this.toggleableContent.classList.add(ClassName$3.DISPLAY_NONE);
	    this.toggleableContent.setAttribute('tabindex', -1);
	  }
	  /**
	   * Updates component element if content changes dynamically.
	   * @param {Object} opts The options defined for the updated component.
	   */
	  ;

	  _proto2.update = function update(opts) {
	    if (opts === void 0) {
	      opts = {};
	    }

	    var _self = opts._self || this;

	    if (_self.toggleableContent.innerHTML) {
	      _self.control.classList.remove(ClassName$3.DISPLAY_NONE);

	      _self.hide();
	    } else {
	      _self.control.classList.add(ClassName$3.DISPLAY_NONE);

	      _self.ellipsis.classList.add(ClassName$3.DISPLAY_NONE);
	    }

	    _self.el.dispatchEvent(_self[EventName$3.ON_UPDATE]);
	  };

	  return ShowMoreShowLessSingleElement;
	}(ShowMoreShowLessBase);

	var ShowMoreShowLessMultiElement = /*#__PURE__*/function (_ShowMoreShowLessBase2) {
	  _inheritsLoose(ShowMoreShowLessMultiElement, _ShowMoreShowLessBase2);

	  /**
	   * Create a multi-element variant, inherits from ShowMoreShowLessBase.
	   * @param {Object} opts - The show-more-show-less options.
	   * @param {Number} opts.hideAfter - The index of the element in the multi-element variant after which elements will be toggleable.
	   */
	  function ShowMoreShowLessMultiElement(opts) {
	    var _this2;

	    _this2 = _ShowMoreShowLessBase2.call(this, opts) || this;
	    _this2.hideAfter = opts.hideAfter || null;

	    _this2.setChildren();

	    var focusOuttarget = _this2.toggleableContent[0];

	    _this2.events.push({
	      el: _this2.toggleableContent[0],
	      type: 'focusout',
	      handler: _toggleableContentOnFocusOut.bind(null, focusOuttarget)
	    });

	    Util.addEvents(_this2.events); // Set attributes on html elements
	    // Tabindex set to -1 so content can be focused when shown.

	    _this2.toggleableContent[0].setAttribute('tabindex', -1); // Set default state to hidden.


	    _this2.toggleableContent.forEach(function (node) {
	      node.classList.add(ClassName$3.DISPLAY_NONE);
	    }); // Add mutation observers.


	    _this2.childObserver = new MutationObserver(function () {
	      _this2.update({
	        _self: _assertThisInitialized(_this2)
	      });
	    });

	    _this2.childObserver.observe(_this2.el.querySelector(Selector$3.TOGGLEABLE_CONTENT), {
	      childList: true,
	      subtree: true
	    });

	    return _this2;
	  }
	  /**
	   * Define visible and non-visible children in toggleable content based on data-count attribute passed to constructor.
	   */


	  var _proto3 = ShowMoreShowLessMultiElement.prototype;

	  _proto3.setChildren = function setChildren() {
	    this.visibleContent = this.el.querySelectorAll(Selector$3.TOGGLEABLE_CONTENT + ' > :nth-child(-n+' + (this.hideAfter - 1) + ')');
	    this.toggleableContent = this.el.querySelectorAll(Selector$3.TOGGLEABLE_CONTENT + ' > :nth-child(n+' + this.hideAfter + ')');
	  }
	  /**
	   * Show toggleable child elements.
	   */
	  ;

	  _proto3.show = function show() {
	    _ShowMoreShowLessBase2.prototype.show.call(this);

	    this.toggleableContent.forEach(function (node) {
	      node.classList.remove(ClassName$3.DISPLAY_NONE);
	    });

	    if (this.toggleableContent) {
	      _ShowMoreShowLessBase2.prototype.setFocusToElement.call(this, this.toggleableContent[0]);
	    }
	  }
	  /**
	   * Hide toggleable child elements.
	   */
	  ;

	  _proto3.hide = function hide() {
	    _ShowMoreShowLessBase2.prototype.hide.call(this);

	    if (this.toggleableContent.length > 0) {
	      this.toggleableContent.forEach(function (node) {
	        node.classList.add(ClassName$3.DISPLAY_NONE);
	      });
	      this.toggleableContent[0].setAttribute('tabindex', -1);
	    }
	  }
	  /**
	   * Updates the visible and nonvisible children if elements are added/removed dynamically.
	   * @param {Object} opts the options for the updated component.
	   */
	  ;

	  _proto3.update = function update(opts) {
	    if (opts === void 0) {
	      opts = {};
	    }

	    var _self = opts._self || this;

	    _self.setChildren();

	    _self.visibleContent.forEach(function (node) {
	      if (node.classList.contains(ClassName$3.DISPLAY_NONE)) {
	        node.classList.remove(ClassName$3.DISPLAY_NONE);
	      }

	      if (node.hasAttribute('tabindex')) {
	        node.removeAttribute('tabindex');
	      }
	    });

	    if (_self.toggleableContent.length > 0) {
	      _self.hide();
	    }

	    if (_self.toggleableContent.length > 1) {
	      var hasTabIndex = false;

	      _self.toggleableContent.forEach(function (node) {
	        if (hasTabIndex) {
	          node.removeAttribute('tabindex');
	        }

	        if (node.hasAttribute('tabindex')) {
	          hasTabIndex = true;
	        }
	      });
	    }

	    if (_self.toggleableContent.length === 0 && !_self.el.classList.contains(ClassName$3.DISPLAY_NONE)) {
	      _self.el.classList.add(ClassName$3.DISPLAY_NONE);
	    }

	    if (_self.toggleableContent.length > 0 && _self.el.classList.contains(ClassName$3.DISPLAY_NONE)) {
	      _self.el.classList.remove(ClassName$3.DISPLAY_NONE);
	    }

	    _self.el.dispatchEvent(this[EventName$3.ON_UPDATE]);
	  }
	  /**
	   * Remove instance of ShowMoreShowLess.
	   */
	  ;

	  _proto3.remove = function remove() {
	    _ShowMoreShowLessBase2.prototype.remove.call(this);

	    this.childObserver.disconnect();
	  };

	  return ShowMoreShowLessMultiElement;
	}(ShowMoreShowLessBase);

	(function () {
	  Util.initializeComponent(Selector$3.DATA_MOUNT, function (node) {
	    return new ShowMoreShowLess({
	      el: node
	    });
	  });
	})();

	/**
	 * ------------------------------------------------------------------------
	 * Constants
	 * ------------------------------------------------------------------------
	 */

	var tabs = [];
	var EventName$2 = {
	  HIDE: 'onHide',
	  HIDDEN: 'onHidden',
	  SHOW: 'onShow',
	  SHOWN: 'onShown',
	  CLICK_DATA_API: 'click',
	  KEYDOWN_DATA_API: 'keydown',
	  ON_REMOVE: 'onRemove'
	};
	var Attribute = {
	  HIDDEN: 'hidden'
	};
	var ClassName$2 = {
	  DROPDOWN_MENU: 'dropdown-menu',
	  ACTIVE: 'active',
	  DISABLED: 'disabled',
	  FADE: 'fade',
	  SHOW: 'show'
	};
	var Selector$2 = {
	  DROPDOWN: '.dropdown',
	  NAV_LIST_GROUP: '.nav, .list-group, .tab-group',
	  ACTIVE: '.active',
	  ACTIVE_UL: 'li .active',
	  DATA_MOUNT: '[data-mount="tab"]',
	  DROPDOWN_TOGGLE: '.dropdown-toggle',
	  DROPDOWN_ACTIVE_CHILD: '.dropdown-menu .active',
	  BACK_TO_TABS: '[data-focus="back-to-tabs"]'
	}; // Private

	function _activate(element, container, callback) {
	  var _this = this;

	  var activeElements;

	  if (container && (container.nodeName === 'UL' || container.nodeName === 'OL')) {
	    activeElements = container.querySelector(Selector$2.ACTIVE_UL);
	  } else {
	    // make sure that any selected tab panel .active element is a direct descendant of the tab panel container
	    activeElements = [].slice.call(container.children).filter(function (e) {
	      return e.classList.contains(ClassName$2.ACTIVE);
	    });
	  }

	  var active = activeElements[0];
	  var isTransitioning = callback && active && active.classList.contains(ClassName$2.FADE);

	  var complete = function complete() {
	    return _transitionComplete.bind(_this)(element, active, callback);
	  };

	  if (active && isTransitioning) {
	    var transitionDuration = Util.getTransitionDurationFromElement(active);
	    active.classList.remove(ClassName$2.SHOW);
	    active.addEventListener(Util.TRANSITION_END, complete, {
	      once: true
	    });
	    Util.emulateTransitionEnd(active, transitionDuration);
	  } else {
	    complete();
	  }
	}

	function _transitionComplete(element, active, callback) {
	  if (active) {
	    active.classList.remove(ClassName$2.ACTIVE);
	    var dropdownChild = active.parentNode.querySelector(Selector$2.DROPDOWN_ACTIVE_CHILD);

	    if (dropdownChild) {
	      dropdownChild[0].classList.remove(ClassName$2.ACTIVE);
	    }

	    if (active.getAttribute('role') === 'tab') {
	      active.setAttribute('aria-selected', false);
	      active.setAttribute('tabindex', '-1');
	    } else if (active.getAttribute('role') === 'tabpanel') {
	      active.hidden = true;
	    }
	  }

	  element.classList.add(ClassName$2.ACTIVE);

	  if (element.getAttribute('role') === 'tab') {
	    element.setAttribute('aria-selected', true);
	    element.setAttribute('tabindex', '0');
	  } else if (element.getAttribute('role') === 'tabpanel') {
	    element.removeAttribute(Attribute.HIDDEN); // Scroll back to top of panel if necessary

	    var activePanelTop = element.getBoundingClientRect().top;
	    var documentElementNode = document.documentElement;
	    var documentScrollPaddingTop = documentElementNode.style.scrollPaddingTop ? parseInt(documentElementNode.style.scrollPaddingTop, 10) : 0;

	    if (activePanelTop < 0) {
	      var scrollOffset = activePanelTop - documentElementNode.getBoundingClientRect().top - documentScrollPaddingTop;
	      window.scrollTo(0, scrollOffset);
	    }

	    if (this.backToTabs) {
	      this.backToTabs.focusControls.remove();
	      this.backToTabs.href = "#" + element.id + "-tab";
	      this.backToTabs.focusControls = new Util.FocusControls({
	        el: this.backToTabs
	      });
	    }
	  }

	  Util.reflow(element);

	  if (element.classList.contains(ClassName$2.FADE)) {
	    element.classList.add(ClassName$2.SHOW);
	  }

	  if (element.parentNode && element.parentNode.classList.contains(ClassName$2.DROPDOWN_MENU)) {
	    var dropdownElement = element.closest(Selector$2.DROPDOWN)[0];

	    if (dropdownElement) {
	      var dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(Selector$2.DROPDOWN_TOGGLE));
	      dropdownToggleList.classList.add(ClassName$2.ACTIVE);
	    }

	    element.setAttribute('aria-expanded', true);
	  }

	  if (callback) {
	    callback();
	  }
	}

	function _onKeycodeEvent(event) {
	  var keycode = Util.getKeyCode(event);

	  if (keycode === Util.keyCodes.SPACE || keycode === Util.keyCodes.ENTER) {
	    event.preventDefault();
	    this.show(event);
	  } else if (keycode === Util.keyCodes.ARROW_LEFT) {
	    if (this.isRTL) {
	      _onKeycodeRight.bind(this)();
	    } else {
	      _onKeycodeLeft.bind(this)();
	    }
	  } else if (keycode === Util.keyCodes.ARROW_RIGHT) {
	    if (this.isRTL) {
	      _onKeycodeLeft.bind(this)();
	    } else {
	      _onKeycodeRight.bind(this)();
	    }
	  }
	}

	function _onKeycodeLeft() {
	  if (this.tabIndex === 0) {
	    return;
	  }

	  this.listNodeList[this.tabIndex - 1].focus();
	}

	function _onKeycodeRight() {
	  if (this.tabIndex === this.listNodeList.length - 1) {
	    return;
	  }

	  this.listNodeList[this.tabIndex + 1].focus();
	}
	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */


	var Tab = /*#__PURE__*/function () {
	  /**
	   * Create a tab
	   * @param {*} opts - The tab options
	   * @param {Node} opts.el - The tab DOM node
	   */
	  function Tab(opts) {
	    this.el = opts.el;
	    this.listGroup = this.el.closest(Selector$2.NAV_LIST_GROUP);
	    this.isRTL = document.dir === 'rtl';
	    this.backToTabs = document.querySelector(Selector$2.BACK_TO_TABS); // set back to tab href to active tab's id

	    if (this.el.classList.contains(ClassName$2.ACTIVE) && this.backToTabs) {
	      this.backToTabs.href = "#" + this.el.id;
	      this.backToTabs.focusControls = new Util.FocusControls({
	        el: this.backToTabs
	      });
	    } // prevents error if tab is not within a list group


	    if (this.listGroup) {
	      this.listNodeList = this.listGroup.querySelectorAll("[data-mount=" + this.el.dataset.mount + "]") || [];
	      this.nodeListArray = [].slice.call(this.listNodeList);
	      this.tabIndex = this.nodeListArray.indexOf(this.el);
	    } // attach event listeners


	    this.events = [{
	      el: this.el,
	      type: EventName$2.CLICK_DATA_API,
	      handler: this.show.bind(this)
	    }, {
	      el: this.el,
	      type: EventName$2.KEYDOWN_DATA_API,
	      handler: _onKeycodeEvent.bind(this)
	    }]; // add event listeners

	    Util.addEvents(this.events);
	    tabs.push(this); // Create custom events

	    this[EventName$2.ON_REMOVE] = new CustomEvent(EventName$2.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	  } // Public

	  /**
	  * Shows a tab panel based on the tab clicked and hides other panels
	  * @param {event} e event trigger
	  */


	  var _proto = Tab.prototype;

	  _proto.show = function show(e) {
	    var _this2 = this;

	    if (e) {
	      e.preventDefault();
	    }

	    if (this.el.parentNode && this.el.parentNode.nodeType === Node.ELEMENT_NODE && this.el.classList.contains(ClassName$2.ACTIVE) || this.el.classList.contains(ClassName$2.DISABLED)) {
	      return;
	    }

	    var target;
	    var previous;
	    var listElement = this.el.closest(Selector$2.NAV_LIST_GROUP);
	    var selector = Util.getSelectorFromElement(this.el);

	    if (listElement) {
	      var itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? Selector$2.ACTIVE_UL : Selector$2.ACTIVE;
	      previous = this.el.querySelector(itemSelector);
	    }

	    var hideEvent = new CustomEvent(EventName$2.HIDE, {
	      detail: {
	        relatedTarget: this.el
	      }
	    });
	    var showEvent = new CustomEvent(EventName$2.SHOW, {
	      detail: {
	        relatedTarget: previous
	      }
	    });

	    if (previous) {
	      previous.dispatchEvent(hideEvent);
	    }

	    this.el.dispatchEvent(showEvent);

	    if (showEvent.defaultPrevented || hideEvent.defaultPrevented) {
	      return;
	    }

	    if (selector) {
	      target = document.querySelector(selector);
	    }

	    _activate.bind(this)(this.el, listElement);

	    var complete = function complete() {
	      var hiddenEvent = new CustomEvent(EventName$2.HIDDEN, {
	        detail: {
	          relatedTarget: _this2.el
	        }
	      });
	      var shownEvent = new CustomEvent(EventName$2.SHOWN, {
	        detail: {
	          relatedTarget: previous
	        }
	      });

	      if (previous) {
	        previous.dispatchEvent(hiddenEvent);
	      }

	      _this2.el.dispatchEvent(shownEvent);
	    };

	    if (target) {
	      _activate.bind(this)(target, target.parentNode, complete);
	    } else {
	      complete();
	    }
	  }
	  /**
	   * Remove event handlers.
	   */
	  ;

	  _proto.remove = function remove() {
	    Util.removeEvents(this.events); // remove this reference from array of instances

	    var index = tabs.indexOf(this);
	    tabs.splice(index, 1);
	    this.el.dispatchEvent(this[EventName$2.ON_REMOVE]);
	  }
	  /**
	   * Get instances.
	   * @returns {Object[]} A array of tab instances
	   */
	  ;

	  Tab.getInstances = function getInstances() {
	    return tabs;
	  };

	  return Tab;
	}();
	/**
	 * ------------------------------------------------------------------------
	 * Data Api implementation
	 * ------------------------------------------------------------------------
	 */


	(function () {
	  Util.initializeComponent(Selector$2.DATA_MOUNT, function (node) {
	    return new Tab({
	      el: node
	    });
	  });
	})();

	var tabSliders = [];
	var EventName$1 = {
	  CLICK_DATA_API: 'click',
	  RESIZE_DATA_API: 'resize',
	  FOCUS_DATA_API: 'focus',
	  SCROLL_DATA_API: 'scroll',
	  ON_SCROLL: 'onScroll',
	  ON_REMOVE: 'onRemove'
	};
	var Direction = {
	  LEFT: 'left',
	  RIGHT: 'right'
	};
	var ClassName$1 = {
	  ACTIVE: 'active',
	  ARROWS: 'tab-arrows',
	  ARROW_PREV: 'arrow-prev',
	  ARROW_NEXT: 'arrow-next',
	  TAB_OVERFLOW: 'tab-overflow',
	  TAB_WINDOW: 'tab-window',
	  TAB_GROUP: 'tab-group',
	  JUSTIFY_CENTER: 'justify-content-center',
	  MOBILE_ARROWS: 'mobile-arrows'
	};
	var Selector$1 = {
	  ACTIVE: "." + ClassName$1.ACTIVE,
	  ARROWS: "." + ClassName$1.ARROWS,
	  ARROW_PREV: "." + ClassName$1.ARROW_PREV,
	  ARROW_NEXT: "." + ClassName$1.ARROW_NEXT,
	  TAB_OVERFLOW: "." + ClassName$1.TAB_OVERFLOW,
	  TAB_WINDOW: "." + ClassName$1.TAB_WINDOW,
	  TAB_GROUP: "." + ClassName$1.TAB_GROUP,
	  DATA_MOUNT: '[data-mount="tab-slider"]'
	};
	/**
	 * Private functions.
	 */

	/**
	 * Helper function to check if single tab element is within tab window.
	 * @param {node}  tabBounds             Single tab element.
	 * @param {node}  tabListWindowBounds   Tab window.
	 * @return {boolean} Returns true if the tab element is visible within the tab window.
	 */

	function _inTabWindow(tab, tabListWindow) {
	  var tabBounds = tab.getBoundingClientRect();
	  var tabListWindowBounds = tabListWindow.getBoundingClientRect();
	  return Math.ceil(tabBounds.left) >= Math.ceil(tabListWindowBounds.left) && Math.ceil(tabBounds.right) < Math.ceil(tabListWindowBounds.right);
	}
	/**
	 * Helper function to hide and/or show arrows dependent on visible tabs.
	 */


	function _showHideArrow() {
	  var tabListWindowBounds = this.el;
	  var scrollLeftVal = this.scrollElement.scrollLeft;
	  var arrowTarget1 = this.isRTL ? this.arrowNext : this.arrowPrev;
	  var arrowTarget2 = this.isRTL ? this.arrowPrev : this.arrowNext;

	  if (_inTabWindow.bind(this)(this.tabListItems[0], tabListWindowBounds) || !this.isRTL && scrollLeftVal === 0) {
	    arrowTarget1.style.display = 'none';
	    arrowTarget2.style.display = 'block';
	  } else if (_inTabWindow.bind(this)(this.tabListItems[this.tabListItems.length - 1], tabListWindowBounds)) {
	    arrowTarget1.style.display = 'block';
	    arrowTarget2.style.display = 'none';
	  } else {
	    this.arrowNext.style.display = 'block';
	    this.arrowPrev.style.display = 'block';
	  }
	}
	/**
	 * Helper function to keep focus on arrow that is clicked when slider moves.
	 */


	function _onArrowFocus() {
	  var arrowTarget1 = this.isRTL ? this.arrowNext : this.arrowPrev;
	  var arrowTarget2 = this.isRTL ? this.arrowPrev : this.arrowNext;

	  if (this.arrowDirection === Direction.LEFT) {
	    if (arrowTarget1.style.display === 'block') {
	      arrowTarget1.focus();
	    } else {
	      arrowTarget2.focus();
	    }
	  } else if (this.arrowDirection === Direction.RIGHT) {
	    if (arrowTarget2.style.display === 'block') {
	      arrowTarget2.focus();
	    } else {
	      arrowTarget1.focus();
	    }
	  }
	}
	/**
	 * Event trigger on click to move the slide left or right depending on which arrow has been clicked.
	 * @param {event} event javascript event.
	 * @return {boolean} returns false if target is undefined
	 */


	function _onArrowClick(event) {
	  event.preventDefault();
	  this.isArrowClicked = true;

	  _updateTabWindowWidth.bind(this)(); // check for which arrow has been clicked


	  if (event.target.matches(Selector$1.ARROW_NEXT)) {
	    this.arrowDirection = this.isRTL ? Direction.LEFT : Direction.RIGHT;
	  } else {
	    this.arrowDirection = this.isRTL ? Direction.RIGHT : Direction.LEFT;
	  }

	  var slideToTarget = _getSlideToTarget.bind(this)();

	  if (!slideToTarget) {
	    return false;
	  }

	  _setScrollLeft.bind(this)(slideToTarget);
	}
	/**
	 * Set left position of tab window to left position of target element.
	 * @param {node} slideToTarget target element to set left position to.
	 */


	function _setScrollLeft(slideToTarget) {
	  var arrowPadding = parseInt(getComputedStyle(this.arrowPrev).paddingLeft, 10) || parseInt(getComputedStyle(this.arrowNext).paddingLeft, 10);
	  var scrollElementLeft = Math.floor(this.scrollElement.scrollLeft);
	  var slideToTargetVal = Math.floor(_getBiDirectionBoundingRectValue.bind(this)(slideToTarget, true));
	  var scrollElementVal = Math.floor(_getBiDirectionBoundingRectValue.bind(this)(this.scrollElement, true));
	  var scrollAmount;

	  if (this.isRTL) {
	    if (this.arrowDirection === Direction.LEFT) {
	      scrollAmount = scrollElementLeft + slideToTargetVal + scrollElementVal + arrowPadding;
	    } else {
	      scrollAmount = scrollElementLeft - slideToTargetVal - scrollElementVal + arrowPadding;
	    }
	  } else {
	    scrollAmount = scrollElementLeft + slideToTargetVal - scrollElementVal - arrowPadding;
	  }

	  try {
	    this.scrollElement.scrollTo({
	      left: scrollAmount,
	      behavior: 'smooth'
	    });
	  } catch (_unused) {
	    this.scrollElement.scrollLeft = scrollAmount;
	  }
	}
	/**
	 * Set left position of tab window to left position of target element.
	 * @return {node} returns node of element to set left position to or undefined if no element is found
	 */


	function _getSlideToTarget() {
	  var tabTarget;
	  var i;
	  var widthRemaining;
	  var tabBounds;
	  var tabListWindowBounds = this.el.getBoundingClientRect();

	  if (this.arrowDirection === Direction.RIGHT) {
	    i = this.tabListItems.length;
	    /**
	     * Start at right most tab and decrement until
	     * the first tab not in the tab window is found
	     * */

	    while (i--) {
	      tabBounds = this.tabListItems[i].getBoundingClientRect(); // break if last tab is within tab window

	      if (i === this.tabListItems.length - 1 && _inTabWindow.bind(this)(this.tabListItems[i], this.el)) {
	        break;
	      } // update to track the left most tab within the tab window


	      if (_getBiDirectionBoundingRectValue.bind(this)(this.tabListItems[i], false) >= _getBiDirectionBoundingRectValue.bind(this)(this.el, false)) {
	        tabTarget = this.tabListItems[i]; // update left most tab shown in tab window

	        this.tabSlideTarget.el = tabTarget;
	        this.tabSlideTarget.index = i;
	      } else {
	        break;
	      }
	    }
	  } else {
	    /**
	     * Start at left most tab in tab window, decrement and find
	     * out how many tabs can fit within the tab window.
	     * */
	    i = this.tabSlideTarget.index;
	    widthRemaining = tabListWindowBounds.width;

	    if (i === -1) {
	      return false;
	    }

	    while (i-- && widthRemaining >= 0) {
	      tabBounds = this.tabListItems[i].getBoundingClientRect(); // break if first tab is within tab window

	      if (i === 0 && _inTabWindow.bind(this)(this.tabListItems[i], this.el)) {
	        break;
	      }

	      widthRemaining -= tabBounds.width; // subtract tab width from tab window

	      tabTarget = this.tabListItems[i]; // update left most tab shown in tab window

	      this.tabSlideTarget.el = tabTarget;
	      this.tabSlideTarget.index = i; // break if the tab before this tab element creates a negative value

	      if (this.tabListItems[i - 1] && widthRemaining - this.tabListItems[i - 1].getBoundingClientRect().width < 0) {
	        break;
	      }
	    }
	  }

	  return tabTarget;
	}
	/**
	 * Function to initialize contstructor on load and also handle window resize.
	 * Sets container width, shows/hides arrows depending on visible tabs, and resets
	 * styles when slider is not needed.
	 */


	function _onWindowResize() {
	  // width of tab container - left/right padding
	  var tabContainerWidth = this.el.offsetWidth - parseInt(getComputedStyle(this.el).paddingLeft, 10) * 2;
	  var arrowsStyleDisplay = getComputedStyle(this.arrows).display; // don't do anything if container is large enough to hold tabs

	  if (tabContainerWidth >= this.tabListWidth) {
	    // reset values
	    if (arrowsStyleDisplay === 'block' || this.tabWindow.style.width) {
	      this.arrows.style.display = 'none';
	      this.tabWindow.style.width = ''; // add justify center class if it existed

	      if (this.tabContentCentered) {
	        this.tabGroup.classList.add(ClassName$1.JUSTIFY_CENTER);
	      }
	    }

	    return;
	  } // create container overflow for tabs


	  if (!this.tabWindow.style.width || this.tabWindow.style.width === '') {
	    this.tabWindow.style.width = this.tabListWidthBuffer + 'px'; // align tabs to the left when arrows appear

	    if (this.tabContentCentered) {
	      this.tabGroup.classList.remove(ClassName$1.JUSTIFY_CENTER);
	    } // update tab list and last tab bounds


	    this.tabListItems = this.el.querySelectorAll(Selector$2.DATA_MOUNT);
	    this.lastTabBounds = this.tabListItems[this.tabListItems.length - 1].getBoundingClientRect();
	  } // show arrows when the right most tab is out of bounds of the container by 40px (arrow width)


	  var lastTabBoundsRightVal = _getBiDirectionBoundingRectValue.bind(this)(this.tabListItems[this.tabListItems.length - 1], false);

	  var tabMountBoundsRightVal = _getBiDirectionBoundingRectValue.bind(this)(this.el, false);

	  if (arrowsStyleDisplay === 'none' && tabMountBoundsRightVal - this.arrowOffsetWidth <= lastTabBoundsRightVal - this.arrowOffsetWidth) {
	    this.arrows.style.display = 'block';
	  } // hide arrows before shifting left position


	  _showHideArrow.bind(this)();
	}
	/**
	 * Event trigger on focus to move slider position if focused tab is not visible within the tab window.
	 * @param {event}  event javascript event.
	 */


	function _onFocus(event) {
	  if (event.target.matches(Selector$2.DATA_MOUNT)) {
	    _updateTabWindowWidth.bind(this)();

	    var slideToTarget = event.target;
	    var nodeListArray = [].slice.call(this.tabListItems); // update left most tab shown in tab window

	    this.tabSlideTarget.el = slideToTarget;
	    this.tabSlideTarget.index = nodeListArray.indexOf(slideToTarget);
	  }
	}
	/**
	 * Event trigger on scroll to capture scroll event and move slider if it is triggered by keyboard events: left/right, tab/shift+tab.
	 */


	function _onScroll() {
	  var _this = this;

	  if (this.scrollTimeout !== null) {
	    clearTimeout(this.scrollTimeout);
	  }

	  this.scrollTimeout = setTimeout(function () {
	    _updateTabWindowWidth.bind(_this)();

	    _showHideArrow.bind(_this)(); // focus on the arrow only if an arrow was clicked (prevents keyboard presses from activating arrow focus)


	    if (_this.arrowDirection && (document.activeElement === _this.arrowNext || document.activeElement === _this.arrowPrev)) {
	      _onArrowFocus.bind(_this)();
	    } // prevent scroll event from doing additional variable updates


	    if (_this.isArrowClicked) {
	      _this.isArrowClicked = false;
	      return false;
	    } // update left most tab shown in tab window


	    for (var i = _this.tabSlideTarget.index; i < _this.tabListItems.length; i++) {
	      if (_this.tabListItems[i].getBoundingClientRect().left > 0) {
	        _this.tabSlideTarget.el = _this.tabListItems[i];
	        _this.tabSlideTarget.index = i;
	        break;
	      }
	    }
	  }, 100);
	}
	/**
	 * Helper function to accurately calculate all elements that make up the tab width.
	 * @param {node}  tab  tab element
	 * @return {number} returns tab width value
	 */


	function _getTabWidth(tab) {
	  var eleStyleObj = getComputedStyle(tab);
	  var marginLeft = Math.abs(parseInt(eleStyleObj.marginLeft, 10)) || 0;
	  var marginRight = Math.abs(parseInt(eleStyleObj.marginRight, 10)) || 0;
	  var borderLeft = parseInt(eleStyleObj.borderLeftWidth, 10) || 0;
	  var borderRight = parseInt(eleStyleObj.borderRightWidth, 10) || 0;
	  return tab.offsetWidth + (marginLeft + marginRight) + (borderLeft + borderRight);
	}
	/**
	 * Update tab window width.
	 *
	 * On page load whitespace buffer is created to account for tab widths when letter-spacing increases,
	 * but tab window should be readjusted to remove whitespace
	 */


	function _updateTabWindowWidth() {
	  var _this2 = this;

	  // assumes that letter spacing will be toggled only once before tab interaction
	  if (!this.isTabWindowWidthAdjusted && this.tabWindow.style.width) {
	    this.tabListWidth = 0;
	    this.tabListItems.forEach(function (tab) {
	      _this2.tabListWidth += _getTabWidth(tab);
	    });
	    this.tabListWidthBuffer = this.tabListWidth; // create a buffer of the tab window width

	    this.tabWindow.style.width = this.tabListWidthBuffer + 'px';
	    this.isTabWindowWidthAdjusted = true;
	  }
	}
	/**
	 * Helper function to return left or right rectangle bounding values in LTR vs RTL.
	 * @param {node}  tab  tab element
	 * @param {boolean}  getLeftBoundsValue set to true if you want .left or fase if .right value
	 * @return {number} left or right value of element bounding rectangle
	 */


	function _getBiDirectionBoundingRectValue(element, getLeftBoundsValue) {
	  var tabBounds = element.getBoundingClientRect();

	  if (getLeftBoundsValue) {
	    if (this.isRTL) {
	      var elementStyles = getComputedStyle(element);
	      var borderRight = parseInt(elementStyles.borderRightWidth, 10);
	      var marginRight = parseInt(elementStyles.marginRight, 10);
	      return Math.abs(tabBounds.right + borderRight + marginRight - window.innerWidth);
	    }

	    return tabBounds.left;
	  }

	  if (this.isRTL) {
	    return Math.abs(tabBounds.left - window.innerWidth);
	  }

	  return tabBounds.right;
	}
	/**
	 * Tab slider
	 */


	var TabSlider = /*#__PURE__*/function () {
	  /**
	   * Create the tab slider controls.
	   * @param {Object} opts   The tab slider control options.
	   * @param {node} opts.el The tab slider DOM node.
	   * @param {function} [opts.onPrevArrowClick]  Function to override the previous button click handler.
	   * @param {function} [opts.onNextArrowClick]  Function to override the next button click handler.
	   * @param {function} [opts.onFocusEvent] Function to override the focus event handler.
	   * @param {function} [opts.onScrollEvent] Function to override the scroll event handler.
	   * @param {function} [opts.onWindowResize]  Function to override the resize handler.
	   */
	  function TabSlider(opts) {
	    var _this3 = this;

	    // select control nodes
	    this.el = opts.el;
	    this.tabListItems = this.el.querySelectorAll(Selector$2.DATA_MOUNT);
	    this.scrollElement = this.el.querySelector(Selector$1.TAB_OVERFLOW);
	    this.tabWindow = this.el.querySelector(Selector$1.TAB_WINDOW);
	    this.tabGroup = this.el.querySelector(Selector$1.TAB_GROUP);
	    this.tabContentCentered = this.tabGroup.classList.contains(ClassName$1.JUSTIFY_CENTER);
	    this.arrows = this.el.querySelector(Selector$1.ARROWS);
	    this.arrowPrev = this.el.querySelector(Selector$1.ARROW_PREV);
	    this.arrowNext = this.el.querySelector(Selector$1.ARROW_NEXT);
	    this.arrowOffsetWidth = parseInt(this.el.querySelector(Selector$1.ARROW_NEXT).dataset.width, 10) || 40; // event controls

	    this.onPrevArrowClick = opts.onPrevArrowClick || _onArrowClick.bind(this);
	    this.onNextArrowClick = opts.onNextArrowClick || _onArrowClick.bind(this);
	    this.onFocusEvent = opts.onFocusEvent || _onFocus.bind(this);
	    this.onScrollEvent = opts.onScrollEvent || _onScroll.bind(this);
	    this.onWindowResize = opts.onWindowResize || _onWindowResize.bind(this); // internal variables

	    this.isRTL = document.dir === 'rtl';
	    this.isTabWindowWidthAdjusted = false;
	    this.isArrowClicked = false;
	    this.arrowDirection = Direction.LEFT;
	    this.scrollTimeout = null;
	    this.tabListWidth = 0;
	    this.tabListWidthBuffer = 0; // a11y fix to increase tab list window width to allow for increased letter spacing

	    this.lastTabBounds = this.tabListItems[this.tabListItems.length - 1].getBoundingClientRect(); // keep track of tab that is on the far left of the tab window

	    this.tabSlideTarget = {
	      el: this.isRTL ? this.tabListItems[this.tabListItems.length - 1] : this.tabListItems[0],
	      index: this.isRTL ? this.tabListItems.length - 1 : 0
	    }; // get width of all tabs; include borders and margins

	    this.tabListItems.forEach(function (tab) {
	      _this3.tabListWidth += _getTabWidth(tab);
	    }); // create a buffer of the tab window width on page load

	    this.tabListWidthBuffer = this.tabListWidth * 1.5; // add class name to arrows for mobile only

	    if (Util.detectMobile(true)) {
	      this.arrows.classList.add(ClassName$1.MOBILE_ARROWS);
	    } // attach event listeners


	    this.events = [{
	      el: this.arrowPrev,
	      type: EventName$1.CLICK_DATA_API,
	      handler: this.onPrevArrowClick
	    }, {
	      el: this.arrowNext,
	      type: EventName$1.CLICK_DATA_API,
	      handler: this.onNextArrowClick
	    }, {
	      el: window,
	      type: EventName$1.RESIZE_DATA_API,
	      handler: throttle(100, this.onWindowResize)
	    }, {
	      el: this.scrollElement,
	      type: EventName$1.SCROLL_DATA_API,
	      handler: throttle(100, this.onScrollEvent)
	    }];
	    this.tabListItems.forEach(function (tab) {
	      _this3.events.push({
	        el: tab,
	        type: EventName$1.FOCUS_DATA_API,
	        handler: _this3.onFocusEvent
	      });
	    });
	    Util.addEvents(this.events);
	    tabSliders.push(this); // initialize slider if necessary on load

	    this.onWindowResize(); // Create custom events

	    this[EventName$1.ON_SCROLL] = new CustomEvent(EventName$1.ON_SCROLL, {
	      bubbles: true,
	      cancelable: true
	    });
	    this[EventName$1.ON_REMOVE] = new CustomEvent(EventName$1.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	  }
	  /**
	   * Remove event handlers.
	   */


	  var _proto = TabSlider.prototype;

	  _proto.remove = function remove() {
	    Util.removeEvents(this.events); // remove this reference from array of instances

	    var index = tabSliders.indexOf(this);
	    tabSliders.splice(index, 1);
	    this.el.dispatchEvent(this[EventName$1.ON_REMOVE]);
	  }
	  /**
	   * Go to next tabs
	   */
	  ;

	  _proto.onClickNextArrow = function onClickNextArrow() {
	    this.arrowNext.click();
	    this.el.dispatchEvent(this[EventName$1.ON_SCROLL]);
	  }
	  /**
	   * Go to previous tabs
	   */
	  ;

	  _proto.onClickPrevArrow = function onClickPrevArrow() {
	    this.arrowPrev.click();
	    this.el.dispatchEvent(this[EventName$1.ON_SCROLL]);
	  }
	  /**
	   * Get instances.
	   * @returns {Object} A object instance
	   */
	  ;

	  TabSlider.getInstances = function getInstances() {
	    return tabSliders;
	  };

	  return TabSlider;
	}();
	/**
	 * ------------------------------------------------------------------------
	 * Data Api implementation
	 * ------------------------------------------------------------------------
	 */


	(function () {
	  Util.initializeComponent(Selector$1.DATA_MOUNT, function (node) {
	    return new TabSlider({
	      el: node
	    });
	  });
	})();

	var Selector = {
	  DATA_MOUNT: '[data-mount="tooltip"]'
	};
	var EventName = {
	  ON_HIDE: 'onHide',
	  ON_SHOW: 'onShow',
	  ON_UPDATE: 'onUpdate',
	  ON_REMOVE: 'onRemove'
	};
	var ClassName = Object.assign({}, ClassName$9, {
	  TOOLTIP: 'tooltip',
	  ARROW: 'arrow'
	});
	var Default = Object.assign({}, Default$3, {
	  SR_CLOSE: 'Press escape to close tooltip',
	  ALIGNMENT: 'center'
	});
	var tooltips = [];
	/**
	 * The event handler for when the trigger is hovered over
	 */

	function _onEnter() {
	  this.show();
	}
	/**
	 * The event handler for when the trigger or menu is hovered over
	 * @param {MouseEvent} event - The event object
	 */


	function _onLeave(event) {
	  // Note: must check if `this.shown` is true for edge case when the mouse is hovered on the menu, but user tabs away from the trigger.
	  // This results in an infinite `mouseleave` event on the menu unless we've tripped the `this.shown` flag to false.
	  if (this.shown && !this.el.contains(event.relatedTarget) && !this.menu.contains(event.relatedTarget)) {
	    this.hide();
	  }
	}
	/**
	 * The event handler for when a key is pressed on the trigger
	 * @param {KeyboardEvent} event - The event object
	 */


	function _onKeydown(event) {
	  if (this.shown && event.keyCode === Util.keyCodes.ESC) {
	    this.hide();
	  } else if (!this.shown && event.keyCode === Util.keyCodes.ENTER) {
	    this.show();
	  }
	}
	/**
	 * The event handler for when a touch point is placed on the trigger
	 * @param {TouchEvent} event - The event object
	 */


	function _onTouchstart(event) {
	  // Prevent mouse events such as "click" from happening
	  event.preventDefault();
	  this.show();
	}
	/**
	 * The event handler for when a touch point is removed from the trigger
	 * Note: The event's target will be the element in which the touch occurred
	 */


	function _onTouchend() {
	  if (this.shown) {
	    this.hide();
	  }
	}
	/**
	 * The generic event handler for the document
	 * @param {Event} event - The event object
	 */


	function _documentEventHandler(event) {
	  if (this.shown && !this.el.contains(event.target) && !this.menu.contains(event.target)) {
	    this.hide();
	  }
	}
	/**
	 * Gets the related menu or creates one if none is associated
	 * @param {Node} node - The element associated with the menu, typically the tooltip trigger
	 * @returns {Node} The menu element
	 */


	function _getOrCreateMenu(node) {
	  if (node.attributes['aria-describedby']) {
	    return document.querySelector("#" + node.attributes['aria-describedby'].value);
	  }

	  if (node.attributes.title) {
	    var menu = document.createElement('div');
	    var menuId = ClassName.TOOLTIP + "_" + Util.getUid();
	    /* eslint-disable quotes */

	    var menuContents = "<div class=\"tooltip-inner\">" + ("" + node.getAttribute('title')) + ("<span class=\"sr-only\">" + (node.getAttribute('data-sr-close') || Default.SR_CLOSE) + "</span>") + "</div>";
	    /* eslint-enable quotes */

	    menu.classList.add(ClassName.TOOLTIP);
	    menu.setAttribute('id', menuId);
	    menu.setAttribute('role', 'tooltip');
	    menu.innerHTML = menuContents;
	    node.removeAttribute('title'); // Remove the default browser tooltip

	    node.setAttribute('aria-describedby', menuId);
	    node.after(menu);
	    return menu;
	  }
	}
	/**
	 * Creates a decorative arrow element for the menu
	 * @param {Node} node - The element to add the arrow to, typically the menu
	 * @returns {Node} The arrow element
	 */


	function _createTooltipArrow(node) {
	  var arrow = document.createElement('span');
	  var wrapper = document.createElement('div');
	  arrow.classList.add("" + ClassName.ARROW);
	  wrapper.classList.add(ClassName.ARROW + "-wrapper");
	  wrapper.append(arrow);
	  node.append(wrapper);
	  return arrow;
	}

	var Tooltip = /*#__PURE__*/function (_Flyout) {
	  _inheritsLoose(Tooltip, _Flyout);

	  /**
	   * Create a tooltip, inherited from flyout
	   * @param {Object} opts - The flyout options
	   * @param {Node} opts.el - The element that toggles the flyout
	   * @param {Node} [opts.menu] - The element that defines the flyout menu
	   * @param {string} [opts.direction=right] - A string that defines the direction of the menu
	   */
	  function Tooltip(opts) {
	    var _this;

	    // Set super options
	    var flyoutOpts = Object.assign({}, opts);
	    flyoutOpts.menu = opts.menu || _getOrCreateMenu(flyoutOpts.el);
	    flyoutOpts.alignment = _getAlignment(opts.alignment || flyoutOpts.el.getAttribute('data-alignment'), Default.ALIGNMENT);
	    flyoutOpts.offset = opts.offset ? parseInt(opts.offset, 10) : 16;
	    flyoutOpts.enableFade = typeof opts.enableFade === 'boolean' ? opts.enableFade : true;
	    _this = _Flyout.call(this, flyoutOpts) || this; // Tooltip-specific setup

	    _this.arrow = _createTooltipArrow(_this.menu);
	    _this.events = [{
	      el: _this.el,
	      type: 'mouseenter',
	      handler: _onEnter.bind(_assertThisInitialized(_this))
	    }, {
	      el: _this.el,
	      type: 'focusin',
	      handler: _onEnter.bind(_assertThisInitialized(_this))
	    }, {
	      el: _this.el,
	      type: 'mouseleave',
	      handler: _onLeave.bind(_assertThisInitialized(_this))
	    }, {
	      el: _this.menu,
	      type: 'mouseleave',
	      handler: _onLeave.bind(_assertThisInitialized(_this))
	    }, {
	      el: _this.el,
	      type: 'keydown',
	      handler: _onKeydown.bind(_assertThisInitialized(_this))
	    }, {
	      el: _this.el,
	      type: 'touchstart',
	      handler: _onTouchstart.bind(_assertThisInitialized(_this))
	    }, {
	      el: _this.el,
	      type: 'touchend',
	      handler: _onTouchend.bind(_assertThisInitialized(_this))
	    }, {
	      el: document,
	      type: 'mousedown',
	      handler: _documentEventHandler.bind(_assertThisInitialized(_this))
	    }, {
	      el: document,
	      type: 'focusin',
	      handler: _documentEventHandler.bind(_assertThisInitialized(_this))
	    }];
	    Util.addEvents(_this.events); // Create custom events

	    _this[EventName.ON_HIDE] = new CustomEvent(EventName.ON_HIDE, {
	      bubbles: true,
	      cancelable: true
	    });
	    _this[EventName.ON_SHOW] = new CustomEvent(EventName.ON_SHOW, {
	      bubbles: true,
	      cancelable: true
	    });
	    _this[EventName.ON_UPDATE] = new CustomEvent(EventName.ON_UPDATE, {
	      bubbles: true,
	      cancelable: true
	    });
	    _this[EventName.ON_REMOVE] = new CustomEvent(EventName.ON_REMOVE, {
	      bubbles: true,
	      cancelable: true
	    });
	    tooltips.push(_assertThisInitialized(_this));
	    return _this;
	  }
	  /**
	   * Position the flyout menu
	   */


	  var _proto = Tooltip.prototype;

	  _proto.positionMenu = function positionMenu() {
	    _Flyout.prototype.positionMenu.call(this);

	    this.positionMenuArrow();
	  }
	  /**
	   * Position the menu's arrow
	   */
	  ;

	  _proto.positionMenuArrow = function positionMenuArrow() {
	    var position = this.currentPosition;
	    var wrapper = this.menu.querySelector("." + ClassName.ARROW + "-wrapper");

	    if (wrapper !== null) {
	      if (position.placement === 'top' || position.placement === 'bottom') {
	        wrapper.style.width = null;
	        wrapper.style.height = this.offset + 'px';
	      } else {
	        wrapper.style.width = this.offset + 'px';
	        wrapper.style.height = null;
	      }
	    } // Reset positioning


	    this.arrow.style.top = null;
	    this.arrow.style.bottom = null;
	    this.arrow.style.left = null;
	    this.arrow.style.right = null; // Top and bottom menus

	    if (position.placement === 'top' || position.placement === 'bottom') {
	      if (position.alignment === 'start') {
	        this.arrow.style[Default.START] = Math.round(this.boundingRect.el.width / 2) - this.arrow.offsetWidth / 2 + 'px';
	      } else if (position.alignment === 'end') {
	        this.arrow.style[Default.END] = Math.round(this.boundingRect.el.width / 2) - this.arrow.offsetWidth / 2 + 'px';
	      } else {
	        this.arrow.style.left = Math.round(this.boundingRect.menu.width / 2) - this.arrow.offsetWidth / 2 + 'px';
	      } // Left and right menus

	    } else if (position.alignment === 'start') {
	      this.arrow.style.top = Math.round(this.boundingRect.el.height / 2) - this.arrow.offsetWidth / 2 + 'px';
	    } else if (position.alignment === 'end') {
	      this.arrow.style.bottom = Math.round(this.boundingRect.el.height / 2) - this.arrow.offsetWidth / 2 + 'px';
	    } else {
	      this.arrow.style.top = Math.round(this.boundingRect.menu.height / 2) - this.arrow.offsetWidth / 2 + 'px';
	    }
	  }
	  /**
	   * Show the menu
	   */
	  ;

	  _proto.show = function show() {
	    _Flyout.prototype.show.call(this);

	    this.el.focus();
	    this.el.dispatchEvent(this[EventName.ON_SHOW]);
	  }
	  /**
	   * Hide the menu
	   */
	  ;

	  _proto.hide = function hide() {
	    // Never automatically set focus to Tooltip trigger when closing the tooltip
	    _Flyout.prototype.hide.call(this, {
	      setFocus: false
	    });

	    this.el.dispatchEvent(this[EventName.ON_HIDE]);
	  }
	  /**
	   * Update the tooltip instance
	   * @param {object} [opts={}] - Options for updating the instance
	   */
	  ;

	  _proto.update = function update(opts) {
	    if (opts === void 0) {
	      opts = {};
	    }

	    var flyoutOpts = Object.assign({}, opts); // Enforce tooltips default alignment as fallback

	    if (opts.alignment) {
	      flyoutOpts.alignment = _getAlignment(opts.alignment, Default.ALIGNMENT);
	    }

	    _Flyout.prototype.update.call(this, flyoutOpts);

	    this.el.dispatchEvent(this[EventName.ON_UPDATE]);
	  }
	  /**
	   * Remove the tooltip instance
	   */
	  ;

	  _proto.remove = function remove() {
	    // Remove event handlers, observers, etc.
	    Util.removeEvents(this.events); // Remove this reference from the array of instances

	    var index = tooltips.indexOf(this);
	    tooltips.splice(index, 1);
	    this.el.dispatchEvent(this[EventName.ON_REMOVE]);
	  }
	  /**
	   * Get an array of tooltip instances
	   * @returns {Object[]} Array of tooltip instances
	   */
	  ;

	  Tooltip.getInstances = function getInstances() {
	    return tooltips;
	  };

	  return Tooltip;
	}(Flyout);

	(function () {
	  Util.initializeComponent(Selector.DATA_MOUNT, function (node) {
	    return new Tooltip({
	      el: node
	    });
	  });
	})();

	var version = "1.3.1";

	exports.Alert = Alert;
	exports.AutoComplete = AutoComplete;
	exports.BackToTop = BackToTop;
	exports.Carousel = Carousel;
	exports.CharacterCount = CharacterCount;
	exports.ClickGroup = ClickGroup;
	exports.Collapse = Collapse;
	exports.CollapseControls = CollapseControls;
	exports.ColorPicker = ColorPicker;
	exports.ContentSwap = ContentSwap;
	exports.Debug = Debug;
	exports.Dropdown = Dropdown;
	exports.FormStar = FormStar;
	exports.FormValidation = FormValidation;
	exports.Modal = Modal;
	exports.Popover = Popover;
	exports.ShowMoreShowLess = ShowMoreShowLess;
	exports.Sticky = Sticky;
	exports.Tab = Tab;
	exports.TabSlider = TabSlider;
	exports.Tooltip = Tooltip;
	exports.Util = Util;
	exports.version = version;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
