(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  /*!
  Copyright (C) 2013-2015 by Andrea Giammarchi - @WebReflection

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

  */
  (function(window){  /* jshint loopfunc: true, noempty: false*/
    // http://www.w3.org/TR/dom/#element

    function createDocumentFragment() {
      return document.createDocumentFragment();
    }

    function createElement(nodeName) {
      return document.createElement(nodeName);
    }

    function enoughArguments(length, name) {
      if (!length) throw new Error(
        'Failed to construct ' +
          name +
        ': 1 argument required, but only 0 present.'
      );
    }

    function mutationMacro(nodes) {
      if (nodes.length === 1) {
        return textNodeIfPrimitive(nodes[0]);
      }
      for (var
        fragment = createDocumentFragment(),
        list = slice.call(nodes),
        i = 0; i < nodes.length; i++
      ) {
        fragment.appendChild(textNodeIfPrimitive(list[i]));
      }
      return fragment;
    }

    function textNodeIfPrimitive(node) {
      return typeof node === 'object' ? node : document.createTextNode(node);
    }

    for(var
      head,
      property,
      TemporaryPrototype,
      TemporaryTokenList,
      wrapVerifyToken,
      document = window.document,
      hOP = Object.prototype.hasOwnProperty,
      defineProperty = Object.defineProperty || function (object, property, descriptor) {
        if (hOP.call(descriptor, 'value')) {
          object[property] = descriptor.value;
        } else {
          if (hOP.call(descriptor, 'get'))
            object.__defineGetter__(property, descriptor.get);
          if (hOP.call(descriptor, 'set'))
            object.__defineSetter__(property, descriptor.set);
        }
        return object;
      },
      indexOf = [].indexOf || function indexOf(value){
        var length = this.length;
        while(length--) {
          if (this[length] === value) {
            break;
          }
        }
        return length;
      },
      // http://www.w3.org/TR/domcore/#domtokenlist
      verifyToken = function (token) {
        if (!token) {
          throw 'SyntaxError';
        } else if (spaces.test(token)) {
          throw 'InvalidCharacterError';
        }
        return token;
      },
      DOMTokenList = function (node) {
        var
          noClassName = typeof node.className === 'undefined',
          className = noClassName ?
            (node.getAttribute('class') || '') : node.className,
          isSVG = noClassName || typeof className === 'object',
          value = (isSVG ?
            (noClassName ? className : className.baseVal) :
            className
          ).replace(trim, '')
        ;
        if (value.length) {
          properties.push.apply(
            this,
            value.split(spaces)
          );
        }
        this._isSVG = isSVG;
        this._ = node;
      },
      classListDescriptor = {
        get: function get() {
          return new DOMTokenList(this);
        },
        set: function(){}
      },
      trim = /^\s+|\s+$/g,
      spaces = /\s+/,
      SPACE = '\x20',
      CLASS_LIST = 'classList',
      toggle = function toggle(token, force) {
        if (this.contains(token)) {
          if (!force) {
            // force is not true (either false or omitted)
            this.remove(token);
          }
        } else if(force === undefined || force) {
          force = true;
          this.add(token);
        }
        return !!force;
      },
      DocumentFragmentPrototype = window.DocumentFragment && DocumentFragment.prototype,
      Node = window.Node,
      NodePrototype = (Node || Element).prototype,
      CharacterData = window.CharacterData || Node,
      CharacterDataPrototype = CharacterData && CharacterData.prototype,
      DocumentType = window.DocumentType,
      DocumentTypePrototype = DocumentType && DocumentType.prototype,
      ElementPrototype = (window.Element || Node || window.HTMLElement).prototype,
      HTMLSelectElement = window.HTMLSelectElement || createElement('select').constructor,
      selectRemove = HTMLSelectElement.prototype.remove,
      SVGElement = window.SVGElement,
      properties = [
        'matches', (
          ElementPrototype.matchesSelector ||
          ElementPrototype.webkitMatchesSelector ||
          ElementPrototype.khtmlMatchesSelector ||
          ElementPrototype.mozMatchesSelector ||
          ElementPrototype.msMatchesSelector ||
          ElementPrototype.oMatchesSelector ||
          function matches(selector) {
            var parentNode = this.parentNode;
            return !!parentNode && -1 < indexOf.call(
              parentNode.querySelectorAll(selector),
              this
            );
          }
        ),
        'closest', function closest(selector) {
          var parentNode = this, matches;
          while (
            // document has no .matches
            (matches = parentNode && parentNode.matches) &&
            !parentNode.matches(selector)
          ) {
            parentNode = parentNode.parentNode;
          }
          return matches ? parentNode : null;
        },
        'prepend', function prepend() {
          var firstChild = this.firstChild,
              node = mutationMacro(arguments);
          if (firstChild) {
            this.insertBefore(node, firstChild);
          } else {
            this.appendChild(node);
          }
        },
        'append', function append() {
          this.appendChild(mutationMacro(arguments));
        },
        'before', function before() {
          var parentNode = this.parentNode;
          if (parentNode) {
            parentNode.insertBefore(
              mutationMacro(arguments), this
            );
          }
        },
        'after', function after() {
          var parentNode = this.parentNode,
              nextSibling = this.nextSibling,
              node = mutationMacro(arguments);
          if (parentNode) {
            if (nextSibling) {
              parentNode.insertBefore(node, nextSibling);
            } else {
              parentNode.appendChild(node);
            }
          }
        },
        // https://dom.spec.whatwg.org/#dom-element-toggleattribute
        'toggleAttribute', function toggleAttribute(name, force) {
          var had = this.hasAttribute(name);
          if (1 < arguments.length) {
            if (had && !force)
              this.removeAttribute(name);
            else if (force && !had)
              this.setAttribute(name, "");
          }
          else if (had)
            this.removeAttribute(name);
          else
            this.setAttribute(name, "");
          return this.hasAttribute(name);
        },
        // WARNING - DEPRECATED - use .replaceWith() instead
        'replace', function replace() {
          this.replaceWith.apply(this, arguments);
        },
        'replaceWith', function replaceWith() {
          var parentNode = this.parentNode;
          if (parentNode) {
            parentNode.replaceChild(
              mutationMacro(arguments),
              this
            );
          }
        },
        'remove', function remove() {
          var parentNode = this.parentNode;
          if (parentNode) {
            parentNode.removeChild(this);
          }
        }
      ],
      slice = properties.slice,
      i = properties.length; i; i -= 2
    ) {
      property = properties[i - 2];
      if (!(property in ElementPrototype)) {
        ElementPrototype[property] = properties[i - 1];
      }
      // avoid unnecessary re-patch when the script is included
      // gazillion times without any reason whatsoever
      // https://github.com/WebReflection/dom4/pull/48
      if (property === 'remove' && !selectRemove._dom4) {
        // see https://github.com/WebReflection/dom4/issues/19
        (HTMLSelectElement.prototype[property] = function () {
          return 0 < arguments.length ?
            selectRemove.apply(this, arguments) :
            ElementPrototype.remove.call(this);
        })._dom4 = true;
      }
      // see https://github.com/WebReflection/dom4/issues/18
      if (/^(?:before|after|replace|replaceWith|remove)$/.test(property)) {
        if (CharacterData && !(property in CharacterDataPrototype)) {
          CharacterDataPrototype[property] = properties[i - 1];
        }
        if (DocumentType && !(property in DocumentTypePrototype)) {
          DocumentTypePrototype[property] = properties[i - 1];
        }
      }
      // see https://github.com/WebReflection/dom4/pull/26
      if (/^(?:append|prepend)$/.test(property)) {
        if (DocumentFragmentPrototype) {
          if (!(property in DocumentFragmentPrototype)) {
            DocumentFragmentPrototype[property] = properties[i - 1];
          }
        } else {
          try {
            createDocumentFragment().constructor.prototype[property] = properties[i - 1];
          } catch(o_O) {}
        }
      }
    }

    // most likely an IE9 only issue
    // see https://github.com/WebReflection/dom4/issues/6
    if (!createElement('a').matches('a')) {
      ElementPrototype[property] = function(matches){
        return function (selector) {
          return matches.call(
            this.parentNode ?
              this :
              createDocumentFragment().appendChild(this),
            selector
          );
        };
      }(ElementPrototype[property]);
    }

    // used to fix both old webkit and SVG
    DOMTokenList.prototype = {
      length: 0,
      add: function add() {
        for(var j = 0, token; j < arguments.length; j++) {
          token = arguments[j];
          if(!this.contains(token)) {
            properties.push.call(this, property);
          }
        }
        if (this._isSVG) {
          this._.setAttribute('class', '' + this);
        } else {
          this._.className = '' + this;
        }
      },
      contains: (function(indexOf){
        return function contains(token) {
          i = indexOf.call(this, property = verifyToken(token));
          return -1 < i;
        };
      }([].indexOf || function (token) {
        i = this.length;
        while(i-- && this[i] !== token){}
        return i;
      })),
      item: function item(i) {
        return this[i] || null;
      },
      remove: function remove() {
        for(var j = 0, token; j < arguments.length; j++) {
          token = arguments[j];
          if(this.contains(token)) {
            properties.splice.call(this, i, 1);
          }
        }
        if (this._isSVG) {
          this._.setAttribute('class', '' + this);
        } else {
          this._.className = '' + this;
        }
      },
      toggle: toggle,
      toString: function toString() {
        return properties.join.call(this, SPACE);
      }
    };

    if (SVGElement && !(CLASS_LIST in SVGElement.prototype)) {
      defineProperty(SVGElement.prototype, CLASS_LIST, classListDescriptor);
    }

    // http://www.w3.org/TR/dom/#domtokenlist
    // iOS 5.1 has completely screwed this property
    // classList in ElementPrototype is false
    // but it's actually there as getter
    if (!(CLASS_LIST in document.documentElement)) {
      defineProperty(ElementPrototype, CLASS_LIST, classListDescriptor);
    } else {
      // iOS 5.1 and Nokia ASHA do not support multiple add or remove
      // trying to detect and fix that in here
      TemporaryTokenList = createElement('div')[CLASS_LIST];
      TemporaryTokenList.add('a', 'b', 'a');
      if ('a\x20b' != TemporaryTokenList) {
        // no other way to reach original methods in iOS 5.1
        TemporaryPrototype = TemporaryTokenList.constructor.prototype;
        if (!('add' in TemporaryPrototype)) {
          // ASHA double fails in here
          TemporaryPrototype = window.TemporaryTokenList.prototype;
        }
        wrapVerifyToken = function (original) {
          return function () {
            var i = 0;
            while (i < arguments.length) {
              original.call(this, arguments[i++]);
            }
          };
        };
        TemporaryPrototype.add = wrapVerifyToken(TemporaryPrototype.add);
        TemporaryPrototype.remove = wrapVerifyToken(TemporaryPrototype.remove);
        // toggle is broken too ^_^ ... let's fix it
        TemporaryPrototype.toggle = toggle;
      }
    }

    if (!('contains' in NodePrototype)) {
      defineProperty(NodePrototype, 'contains', {
        value: function (el) {
          while (el && el !== this) el = el.parentNode;
          return this === el;
        }
      });
    }

    if (!('head' in document)) {
      defineProperty(document, 'head', {
        get: function () {
          return head || (
            head = document.getElementsByTagName('head')[0]
          );
        }
      });
    }

    // requestAnimationFrame partial polyfill
    (function () {
      for (var
        raf,
        rAF = window.requestAnimationFrame,
        cAF = window.cancelAnimationFrame,
        prefixes = ['o', 'ms', 'moz', 'webkit'],
        i = prefixes.length;
        !cAF && i--;
      ) {
        rAF = rAF || window[prefixes[i] + 'RequestAnimationFrame'];
        cAF = window[prefixes[i] + 'CancelAnimationFrame'] ||
              window[prefixes[i] + 'CancelRequestAnimationFrame'];
      }
      if (!cAF) {
        // some FF apparently implemented rAF but no cAF 
        if (rAF) {
          raf = rAF;
          rAF = function (callback) {
            var goOn = true;
            raf(function () {
              if (goOn) callback.apply(this, arguments);
            });
            return function () {
              goOn = false;
            };
          };
          cAF = function (id) {
            id();
          };
        } else {
          rAF = function (callback) {
            return setTimeout(callback, 15, 15);
          };
          cAF = function (id) {
            clearTimeout(id);
          };
        }
      }
      window.requestAnimationFrame = rAF;
      window.cancelAnimationFrame = cAF;
    }());

    // http://www.w3.org/TR/dom/#customevent
    try{new window.CustomEvent('?');}catch(o_O){
      window.CustomEvent = function(
        eventName,
        defaultInitDict
      ){

        // the infamous substitute
        function CustomEvent(type, eventInitDict) {
          /*jshint eqnull:true */
          var event = document.createEvent(eventName);
          if (typeof type != 'string') {
            throw new Error('An event name must be provided');
          }
          if (eventName == 'Event') {
            event.initCustomEvent = initCustomEvent;
          }
          if (eventInitDict == null) {
            eventInitDict = defaultInitDict;
          }
          event.initCustomEvent(
            type,
            eventInitDict.bubbles,
            eventInitDict.cancelable,
            eventInitDict.detail
          );
          return event;
        }

        // attached at runtime
        function initCustomEvent(
          type, bubbles, cancelable, detail
        ) {
          /*jshint validthis:true*/
          this.initEvent(type, bubbles, cancelable);
          this.detail = detail;
        }

        // that's it
        return CustomEvent;
      }(
        // is this IE9 or IE10 ?
        // where CustomEvent is there
        // but not usable as construtor ?
        window.CustomEvent ?
          // use the CustomEvent interface in such case
          'CustomEvent' : 'Event',
          // otherwise the common compatible one
        {
          bubbles: false,
          cancelable: false,
          detail: null
        }
      );
    }

    // window.Event as constructor
    try { new Event('_'); } catch (o_O) {
      /* jshint -W022 */
      o_O = (function ($Event) {
        function Event(type, init) {
          enoughArguments(arguments.length, 'Event');
          var out = document.createEvent('Event');
          if (!init) init = {};
          out.initEvent(
            type,
            !!init.bubbles,
            !!init.cancelable
          );
          return out;
        }
        Event.prototype = $Event.prototype;
        return Event;
      }(window.Event || function Event() {}));
      defineProperty(window, 'Event', {value: o_O});
      // Android 4 gotcha
      if (Event !== o_O) Event = o_O;
    }

    // window.KeyboardEvent as constructor
    try { new KeyboardEvent('_', {}); } catch (o_O) {
      /* jshint -W022 */
      o_O = (function ($KeyboardEvent) {
        // code inspired by https://gist.github.com/termi/4654819
        var
          initType = 0,
          defaults = {
            char: '',
            key: '',
            location: 0,
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            metaKey: false,
            altGraphKey: false,
            repeat: false,
            locale: navigator.language,
            detail: 0,
            bubbles: false,
            cancelable: false,
            keyCode: 0,
            charCode: 0,
            which: 0
          },
          eventType
        ;
        try {
          var e = document.createEvent('KeyboardEvent');
          e.initKeyboardEvent(
            'keyup', false, false, window, '+', 3,
            true, false, true, false, false
          );
          initType = (
            (e.keyIdentifier || e.key) == '+' &&
            (e.keyLocation || e.location) == 3
          ) && (
            e.ctrlKey ? e.altKey ? 1 : 3 : e.shiftKey ? 2 : 4
          ) || 9;
        } catch(o_O) {}
        eventType = 0 < initType ? 'KeyboardEvent' : 'Event';

        function getModifier(init) {
          for (var
            out = [],
            keys = [
              'ctrlKey',
              'Control',
              'shiftKey',
              'Shift',
              'altKey',
              'Alt',
              'metaKey',
              'Meta',
              'altGraphKey',
              'AltGraph'
            ],
            i = 0; i < keys.length; i += 2
          ) {
            if (init[keys[i]])
              out.push(keys[i + 1]);
          }
          return out.join(' ');
        }

        function withDefaults(target, source) {
          for (var key in source) {
            if (
              source.hasOwnProperty(key) &&
              !source.hasOwnProperty.call(target, key)
            ) target[key] = source[key];
          }
          return target;
        }

        function withInitValues(key, out, init) {
          try {
            out[key] = init[key];
          } catch(o_O) {}
        }

        function KeyboardEvent(type, init) {
          enoughArguments(arguments.length, 'KeyboardEvent');
          init = withDefaults(init || {}, defaults);
          var
            out = document.createEvent(eventType),
            ctrlKey = init.ctrlKey,
            shiftKey = init.shiftKey,
            altKey = init.altKey,
            metaKey = init.metaKey,
            altGraphKey = init.altGraphKey,
            modifiers = initType > 3 ? getModifier(init) : null,
            key = String(init.key),
            chr = String(init.char),
            location = init.location,
            keyCode = init.keyCode || (
              (init.keyCode = key) &&
              key.charCodeAt(0)
            ) || 0,
            charCode = init.charCode || (
              (init.charCode = chr) &&
              chr.charCodeAt(0)
            ) || 0,
            bubbles = init.bubbles,
            cancelable = init.cancelable,
            repeat = init.repeat,
            locale = init.locale,
            view = init.view || window,
            args
          ;
          if (!init.which) init.which = init.keyCode;
          if ('initKeyEvent' in out) {
            out.initKeyEvent(
              type, bubbles, cancelable, view,
              ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode
            );
          } else if (0 < initType && 'initKeyboardEvent' in out) {
            args = [type, bubbles, cancelable, view];
            switch (initType) {
              case 1:
                args.push(key, location, ctrlKey, shiftKey, altKey, metaKey, altGraphKey);
                break;
              case 2:
                args.push(ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode);
                break;
              case 3:
                args.push(key, location, ctrlKey, altKey, shiftKey, metaKey, altGraphKey);
                break;
              case 4:
                args.push(key, location, modifiers, repeat, locale);
                break;
              default:
                args.push(char, key, location, modifiers, repeat, locale);
            }
            out.initKeyboardEvent.apply(out, args);
          } else {
            out.initEvent(type, bubbles, cancelable);
          }
          for (key in out) {
            if (defaults.hasOwnProperty(key) && out[key] !== init[key]) {
              withInitValues(key, out, init);
            }
          }
          return out;
        }
        KeyboardEvent.prototype = $KeyboardEvent.prototype;
        return KeyboardEvent;
      }(window.KeyboardEvent || function KeyboardEvent() {}));
      defineProperty(window, 'KeyboardEvent', {value: o_O});
      // Android 4 gotcha
      if (KeyboardEvent !== o_O) KeyboardEvent = o_O;
    }

    // window.MouseEvent as constructor
    try { new MouseEvent('_', {}); } catch (o_O) {
      /* jshint -W022 */
      o_O = (function ($MouseEvent) {
        function MouseEvent(type, init) {
          enoughArguments(arguments.length, 'MouseEvent');
          var out = document.createEvent('MouseEvent');
          if (!init) init = {};
          out.initMouseEvent(
            type,
            !!init.bubbles,
            !!init.cancelable,
            init.view || window,
            init.detail || 1,
            init.screenX || 0,
            init.screenY || 0,
            init.clientX || 0,
            init.clientY || 0,
            !!init.ctrlKey,
            !!init.altKey,
            !!init.shiftKey,
            !!init.metaKey,
            init.button || 0,
            init.relatedTarget || null
          );
          return out;
        }
        MouseEvent.prototype = $MouseEvent.prototype;
        return MouseEvent;
      }(window.MouseEvent || function MouseEvent() {}));
      defineProperty(window, 'MouseEvent', {value: o_O});
      // Android 4 gotcha
      if (MouseEvent !== o_O) MouseEvent = o_O;
    }

    if (!document.querySelectorAll('*').forEach) {
      (function () {
        function patch(what) {
          var querySelectorAll = what.querySelectorAll;
          what.querySelectorAll = function qSA(css) {
            var result = querySelectorAll.call(this, css);
            result.forEach = Array.prototype.forEach;
            return result;
          };
        }
        patch(document);
        patch(Element.prototype);
      }());
    }

    try {
      // https://drafts.csswg.org/selectors-4/#the-scope-pseudo
      document.querySelector(':scope *');
    } catch(o_O) {
      (function () {
        var dataScope = 'data-scope-' + (Math.random() * 1e9 >>> 0);
        var proto = Element.prototype;
        var querySelector = proto.querySelector;
        var querySelectorAll = proto.querySelectorAll;
        proto.querySelector = function qS(css) {
          return find(this, querySelector, css);
        };
        proto.querySelectorAll = function qSA(css) {
          return find(this, querySelectorAll, css);
        };
        function find(node, method, css) {
          if (node.type != document.ELEMENT_NODE) return method.call(node, css);
          node.setAttribute(dataScope, null);
          var result = method.call(
            node,
            String(css).replace(
              /(^|,\s*)(:scope([ >]|$))/g,
              function ($0, $1, $2, $3) {
                return $1 + '[' + dataScope + ']' + ($3 || ' ');
              }
            )
          );
          node.removeAttribute(dataScope);
          return result;
        }
      }());
    }
  }(window));
  (function (global){
    // a WeakMap fallback for DOM nodes only used as key
    var DOMMap = global.WeakMap || (function () {

      var
        counter = 0,
        dispatched = false,
        drop = false,
        value
      ;

      function dispatch(key, ce, shouldDrop) {
        drop = shouldDrop;
        dispatched = false;
        value = undefined;
        key.dispatchEvent(ce);
      }

      function Handler(value) {
        this.value = value;
      }

      Handler.prototype.handleEvent = function handleEvent(e) {
        dispatched = true;
        if (drop) {
          e.currentTarget.removeEventListener(e.type, this, false);
        } else {
          value = this.value;
        }
      };

      function DOMMap() {
        counter++;  // make id clashing highly improbable
        this.__ce__ = new Event(('@DOMMap:' + counter) + Math.random());
      }

      DOMMap.prototype = {
        'constructor': DOMMap,
        'delete': function del(key) {
          return dispatch(key, this.__ce__, true), dispatched;
        },
        'get': function get(key) {
          dispatch(key, this.__ce__, false);
          var v = value;
          value = undefined;
          return v;
        },
        'has': function has(key) {
          return dispatch(key, this.__ce__, false), dispatched;
        },
        'set': function set(key, value) {
          dispatch(key, this.__ce__, true);
          key.addEventListener(this.__ce__.type, new Handler(value), false);
          return this;
        },
      };

      return DOMMap;

    }());

    function Dict() {}
    Dict.prototype = (Object.create || Object)(null);

    // https://dom.spec.whatwg.org/#interface-eventtarget

    function createEventListener(type, callback, options) {
      function eventListener(e) {
        if (eventListener.once) {
          e.currentTarget.removeEventListener(
            e.type,
            callback,
            eventListener
          );
          eventListener.removed = true;
        }
        if (eventListener.passive) {
          e.preventDefault = createEventListener.preventDefault;
        }
        if (typeof eventListener.callback === 'function') {
          /* jshint validthis: true */
          eventListener.callback.call(this, e);
        } else if (eventListener.callback) {
          eventListener.callback.handleEvent(e);
        }
        if (eventListener.passive) {
          delete e.preventDefault;
        }
      }
      eventListener.type = type;
      eventListener.callback = callback;
      eventListener.capture = !!options.capture;
      eventListener.passive = !!options.passive;
      eventListener.once = !!options.once;
      // currently pointless but specs say to use it, so ...
      eventListener.removed = false;
      return eventListener;
    }

    createEventListener.preventDefault = function preventDefault() {};

    var
      Event = global.CustomEvent,
      dE = global.dispatchEvent,
      aEL = global.addEventListener,
      rEL = global.removeEventListener,
      counter = 0,
      increment = function () { counter++; },
      indexOf = [].indexOf || function indexOf(value){
        var length = this.length;
        while(length--) {
          if (this[length] === value) {
            break;
          }
        }
        return length;
      },
      getListenerKey = function (options) {
        return ''.concat(
          options.capture ? '1' : '0',
          options.passive ? '1' : '0',
          options.once ? '1' : '0'
        );
      },
      augment
    ;

    try {
      aEL('_', increment, {once: true});
      dE(new Event('_'));
      dE(new Event('_'));
      rEL('_', increment, {once: true});
    } catch(o_O) {}

    if (counter !== 1) {
      (function () {
        var dm = new DOMMap();
        function createAEL(aEL) {
          return function addEventListener(type, handler, options) {
            if (options && typeof options !== 'boolean') {
              var
                info = dm.get(this),
                key = getListenerKey(options),
                i, tmp, wrap
              ;
              if (!info) dm.set(this, (info = new Dict()));
              if (!(type in info)) info[type] = {
                handler: [],
                wrap: []
              };
              tmp = info[type];
              i = indexOf.call(tmp.handler, handler);
              if (i < 0) {
                i = tmp.handler.push(handler) - 1;
                tmp.wrap[i] = (wrap = new Dict());
              } else {
                wrap = tmp.wrap[i];
              }
              if (!(key in wrap)) {
                wrap[key] = createEventListener(type, handler, options);
                aEL.call(this, type, wrap[key], wrap[key].capture);
              }
            } else {
              aEL.call(this, type, handler, options);
            }
          };
        }
        function createREL(rEL) {
          return function removeEventListener(type, handler, options) {
            if (options && typeof options !== 'boolean') {
              var
                info = dm.get(this),
                key, i, tmp, wrap
              ;
              if (info && (type in info)) {
                tmp = info[type];
                i = indexOf.call(tmp.handler, handler);
                if (-1 < i) {
                  key = getListenerKey(options);
                  wrap = tmp.wrap[i];
                  if (key in wrap) {
                    rEL.call(this, type, wrap[key], wrap[key].capture);
                    delete wrap[key];
                    // return if there are other wraps
                    for (key in wrap) return;
                    // otherwise remove all the things
                    tmp.handler.splice(i, 1);
                    tmp.wrap.splice(i, 1);
                    // if there are no other handlers
                    if (tmp.handler.length === 0)
                      // drop the info[type] entirely
                      delete info[type];
                  }
                }
              }
            } else {
              rEL.call(this, type, handler, options);
            }
          };
        }

        augment = function (Constructor) {
          if (!Constructor) return;
          var proto = Constructor.prototype;
          proto.addEventListener = createAEL(proto.addEventListener);
          proto.removeEventListener = createREL(proto.removeEventListener);
        };

        if (global.EventTarget) {
          augment(EventTarget);
        } else {
          augment(global.Text);
          augment(global.Element || global.HTMLElement);
          augment(global.HTMLDocument);
          augment(global.Window || {prototype:global});
          augment(global.XMLHttpRequest);
        }

      }());
    }

  }(self));

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  /*! picturefill - v3.0.2 - 2016-02-12
   * https://scottjehl.github.io/picturefill/
   * Copyright (c) 2016 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
   */

  createCommonjsModule(function (module) {
  /*! Gecko-Picture - v1.0
   * https://github.com/scottjehl/picturefill/tree/3.0/src/plugins/gecko-picture
   * Firefox's early picture implementation (prior to FF41) is static and does
   * not react to viewport changes. This tiny module fixes this.
   */
  (function(window) {
  	/*jshint eqnull:true */
  	var ua = navigator.userAgent;

  	if ( window.HTMLPictureElement && ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 < 45) ) {
  		addEventListener("resize", (function() {
  			var timer;

  			var dummySrc = document.createElement("source");

  			var fixRespimg = function(img) {
  				var source, sizes;
  				var picture = img.parentNode;

  				if (picture.nodeName.toUpperCase() === "PICTURE") {
  					source = dummySrc.cloneNode();

  					picture.insertBefore(source, picture.firstElementChild);
  					setTimeout(function() {
  						picture.removeChild(source);
  					});
  				} else if (!img._pfLastSize || img.offsetWidth > img._pfLastSize) {
  					img._pfLastSize = img.offsetWidth;
  					sizes = img.sizes;
  					img.sizes += ",100vw";
  					setTimeout(function() {
  						img.sizes = sizes;
  					});
  				}
  			};

  			var findPictureImgs = function() {
  				var i;
  				var imgs = document.querySelectorAll("picture > img, img[srcset][sizes]");
  				for (i = 0; i < imgs.length; i++) {
  					fixRespimg(imgs[i]);
  				}
  			};
  			var onResize = function() {
  				clearTimeout(timer);
  				timer = setTimeout(findPictureImgs, 99);
  			};
  			var mq = window.matchMedia && matchMedia("(orientation: landscape)");
  			var init = function() {
  				onResize();

  				if (mq && mq.addListener) {
  					mq.addListener(onResize);
  				}
  			};

  			dummySrc.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

  			if (/^[c|i]|d$/.test(document.readyState || "")) {
  				init();
  			} else {
  				document.addEventListener("DOMContentLoaded", init);
  			}

  			return onResize;
  		})());
  	}
  })(window);

  /*! Picturefill - v3.0.2
   * http://scottjehl.github.io/picturefill
   * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt;
   *  License: MIT
   */

  (function( window, document, undefined$1 ) {

  	// HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
  	document.createElement( "picture" );

  	var eminpx, alwaysCheckWDescriptor, evalId;
  	// local object for method references and testing exposure
  	var pf = {};
  	var isSupportTestReady = false;
  	var noop = function() {};
  	var image = document.createElement( "img" );
  	var getImgAttr = image.getAttribute;
  	var setImgAttr = image.setAttribute;
  	var removeImgAttr = image.removeAttribute;
  	var docElem = document.documentElement;
  	var types = {};
  	var cfg = {
  		//resource selection:
  		algorithm: ""
  	};
  	var srcAttr = "data-pfsrc";
  	var srcsetAttr = srcAttr + "set";
  	// ua sniffing is done for undetectable img loading features,
  	// to do some non crucial perf optimizations
  	var ua = navigator.userAgent;
  	var supportAbort = (/rident/).test(ua) || ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 > 35 );
  	var curSrcProp = "currentSrc";
  	var regWDesc = /\s+\+?\d+(e\d+)?w/;
  	var regSize = /(\([^)]+\))?\s*(.+)/;
  	var setOptions = window.picturefillCFG;
  	/**
  	 * Shortcut property for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
  	 */
  	// baseStyle also used by getEmValue (i.e.: width: 1em is important)
  	var baseStyle = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)";
  	var fsCss = "font-size:100%!important;";
  	var isVwDirty = true;

  	var cssCache = {};
  	var sizeLengthCache = {};
  	var DPR = window.devicePixelRatio;
  	var units = {
  		px: 1,
  		"in": 96
  	};
  	var anchor = document.createElement( "a" );
  	/**
  	 * alreadyRun flag used for setOptions. is it true setOptions will reevaluate
  	 * @type {boolean}
  	 */
  	var alreadyRun = false;

  	// Reusable, non-"g" Regexes

  	// (Don't use \s, to avoid matching non-breaking space.)
  	var regexLeadingSpaces = /^[ \t\n\r\u000c]+/,
  	    regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/,
  	    regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/,
  	    regexTrailingCommas = /[,]+$/,
  	    regexNonNegativeInteger = /^\d+$/,

  	    // ( Positive or negative or unsigned integers or decimals, without or without exponents.
  	    // Must include at least one digit.
  	    // According to spec tests any decimal point must be followed by a digit.
  	    // No leading plus sign is allowed.)
  	    // https://html.spec.whatwg.org/multipage/infrastructure.html#valid-floating-point-number
  	    regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;

  	var on = function(obj, evt, fn, capture) {
  		if ( obj.addEventListener ) {
  			obj.addEventListener(evt, fn, capture || false);
  		} else if ( obj.attachEvent ) {
  			obj.attachEvent( "on" + evt, fn);
  		}
  	};

  	/**
  	 * simple memoize function:
  	 */

  	var memoize = function(fn) {
  		var cache = {};
  		return function(input) {
  			if ( !(input in cache) ) {
  				cache[ input ] = fn(input);
  			}
  			return cache[ input ];
  		};
  	};

  	// UTILITY FUNCTIONS

  	// Manual is faster than RegEx
  	// http://jsperf.com/whitespace-character/5
  	function isSpace(c) {
  		return (c === "\u0020" || // space
  		        c === "\u0009" || // horizontal tab
  		        c === "\u000A" || // new line
  		        c === "\u000C" || // form feed
  		        c === "\u000D");  // carriage return
  	}

  	/**
  	 * gets a mediaquery and returns a boolean or gets a css length and returns a number
  	 * @param css mediaqueries or css length
  	 * @returns {boolean|number}
  	 *
  	 * based on: https://gist.github.com/jonathantneal/db4f77009b155f083738
  	 */
  	var evalCSS = (function() {

  		var regLength = /^([\d\.]+)(em|vw|px)$/;
  		var replace = function() {
  			var args = arguments, index = 0, string = args[0];
  			while (++index in args) {
  				string = string.replace(args[index], args[++index]);
  			}
  			return string;
  		};

  		var buildStr = memoize(function(css) {

  			return "return " + replace((css || "").toLowerCase(),
  				// interpret `and`
  				/\band\b/g, "&&",

  				// interpret `,`
  				/,/g, "||",

  				// interpret `min-` as >=
  				/min-([a-z-\s]+):/g, "e.$1>=",

  				// interpret `max-` as <=
  				/max-([a-z-\s]+):/g, "e.$1<=",

  				//calc value
  				/calc([^)]+)/g, "($1)",

  				// interpret css values
  				/(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)",
  				//make eval less evil
  				/^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/ig, ""
  			) + ";";
  		});

  		return function(css, length) {
  			var parsedLength;
  			if (!(css in cssCache)) {
  				cssCache[css] = false;
  				if (length && (parsedLength = css.match( regLength ))) {
  					cssCache[css] = parsedLength[ 1 ] * units[parsedLength[ 2 ]];
  				} else {
  					/*jshint evil:true */
  					try{
  						cssCache[css] = new Function("e", buildStr(css))(units);
  					} catch(e) {}
  					/*jshint evil:false */
  				}
  			}
  			return cssCache[css];
  		};
  	})();

  	var setResolution = function( candidate, sizesattr ) {
  		if ( candidate.w ) { // h = means height: || descriptor.type === 'h' do not handle yet...
  			candidate.cWidth = pf.calcListLength( sizesattr || "100vw" );
  			candidate.res = candidate.w / candidate.cWidth ;
  		} else {
  			candidate.res = candidate.d;
  		}
  		return candidate;
  	};

  	/**
  	 *
  	 * @param opt
  	 */
  	var picturefill = function( opt ) {

  		if (!isSupportTestReady) {return;}

  		var elements, i, plen;

  		var options = opt || {};

  		if ( options.elements && options.elements.nodeType === 1 ) {
  			if ( options.elements.nodeName.toUpperCase() === "IMG" ) {
  				options.elements =  [ options.elements ];
  			} else {
  				options.context = options.elements;
  				options.elements =  null;
  			}
  		}

  		elements = options.elements || pf.qsa( (options.context || document), ( options.reevaluate || options.reselect ) ? pf.sel : pf.selShort );

  		if ( (plen = elements.length) ) {

  			pf.setupRun( options );
  			alreadyRun = true;

  			// Loop through all elements
  			for ( i = 0; i < plen; i++ ) {
  				pf.fillImg(elements[ i ], options);
  			}

  			pf.teardownRun( options );
  		}
  	};

  	/**
  	 * outputs a warning for the developer
  	 * @param {message}
  	 * @type {Function}
  	 */
  	( window.console && console.warn ) ?
  		function( message ) {
  			console.warn( message );
  		} :
  		noop
  	;

  	if ( !(curSrcProp in image) ) {
  		curSrcProp = "src";
  	}

  	// Add support for standard mime types.
  	types[ "image/jpeg" ] = true;
  	types[ "image/gif" ] = true;
  	types[ "image/png" ] = true;

  	function detectTypeSupport( type, typeUri ) {
  		// based on Modernizr's lossless img-webp test
  		// note: asynchronous
  		var image = new window.Image();
  		image.onerror = function() {
  			types[ type ] = false;
  			picturefill();
  		};
  		image.onload = function() {
  			types[ type ] = image.width === 1;
  			picturefill();
  		};
  		image.src = typeUri;
  		return "pending";
  	}

  	// test svg support
  	types[ "image/svg+xml" ] = document.implementation.hasFeature( "http://www.w3.org/TR/SVG11/feature#Image", "1.1" );

  	/**
  	 * updates the internal vW property with the current viewport width in px
  	 */
  	function updateMetrics() {

  		isVwDirty = false;
  		DPR = window.devicePixelRatio;
  		cssCache = {};
  		sizeLengthCache = {};

  		pf.DPR = DPR || 1;

  		units.width = Math.max(window.innerWidth || 0, docElem.clientWidth);
  		units.height = Math.max(window.innerHeight || 0, docElem.clientHeight);

  		units.vw = units.width / 100;
  		units.vh = units.height / 100;

  		evalId = [ units.height, units.width, DPR ].join("-");

  		units.em = pf.getEmValue();
  		units.rem = units.em;
  	}

  	function chooseLowRes( lowerValue, higherValue, dprValue, isCached ) {
  		var bonusFactor, tooMuch, bonus, meanDensity;

  		//experimental
  		if (cfg.algorithm === "saveData" ){
  			if ( lowerValue > 2.7 ) {
  				meanDensity = dprValue + 1;
  			} else {
  				tooMuch = higherValue - dprValue;
  				bonusFactor = Math.pow(lowerValue - 0.6, 1.5);

  				bonus = tooMuch * bonusFactor;

  				if (isCached) {
  					bonus += 0.1 * bonusFactor;
  				}

  				meanDensity = lowerValue + bonus;
  			}
  		} else {
  			meanDensity = (dprValue > 1) ?
  				Math.sqrt(lowerValue * higherValue) :
  				lowerValue;
  		}

  		return meanDensity > dprValue;
  	}

  	function applyBestCandidate( img ) {
  		var srcSetCandidates;
  		var matchingSet = pf.getSet( img );
  		var evaluated = false;
  		if ( matchingSet !== "pending" ) {
  			evaluated = evalId;
  			if ( matchingSet ) {
  				srcSetCandidates = pf.setRes( matchingSet );
  				pf.applySetCandidate( srcSetCandidates, img );
  			}
  		}
  		img[ pf.ns ].evaled = evaluated;
  	}

  	function ascendingSort( a, b ) {
  		return a.res - b.res;
  	}

  	function setSrcToCur( img, src, set ) {
  		var candidate;
  		if ( !set && src ) {
  			set = img[ pf.ns ].sets;
  			set = set && set[set.length - 1];
  		}

  		candidate = getCandidateForSrc(src, set);

  		if ( candidate ) {
  			src = pf.makeUrl(src);
  			img[ pf.ns ].curSrc = src;
  			img[ pf.ns ].curCan = candidate;

  			if ( !candidate.res ) {
  				setResolution( candidate, candidate.set.sizes );
  			}
  		}
  		return candidate;
  	}

  	function getCandidateForSrc( src, set ) {
  		var i, candidate, candidates;
  		if ( src && set ) {
  			candidates = pf.parseSet( set );
  			src = pf.makeUrl(src);
  			for ( i = 0; i < candidates.length; i++ ) {
  				if ( src === pf.makeUrl(candidates[ i ].url) ) {
  					candidate = candidates[ i ];
  					break;
  				}
  			}
  		}
  		return candidate;
  	}

  	function getAllSourceElements( picture, candidates ) {
  		var i, len, source, srcset;

  		// SPEC mismatch intended for size and perf:
  		// actually only source elements preceding the img should be used
  		// also note: don't use qsa here, because IE8 sometimes doesn't like source as the key part in a selector
  		var sources = picture.getElementsByTagName( "source" );

  		for ( i = 0, len = sources.length; i < len; i++ ) {
  			source = sources[ i ];
  			source[ pf.ns ] = true;
  			srcset = source.getAttribute( "srcset" );

  			// if source does not have a srcset attribute, skip
  			if ( srcset ) {
  				candidates.push( {
  					srcset: srcset,
  					media: source.getAttribute( "media" ),
  					type: source.getAttribute( "type" ),
  					sizes: source.getAttribute( "sizes" )
  				} );
  			}
  		}
  	}

  	/**
  	 * Srcset Parser
  	 * By Alex Bell |  MIT License
  	 *
  	 * @returns Array [{url: _, d: _, w: _, h:_, set:_(????)}, ...]
  	 *
  	 * Based super duper closely on the reference algorithm at:
  	 * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-srcset-attribute
  	 */

  	// 1. Let input be the value passed to this algorithm.
  	// (TO-DO : Explain what "set" argument is here. Maybe choose a more
  	// descriptive & more searchable name.  Since passing the "set" in really has
  	// nothing to do with parsing proper, I would prefer this assignment eventually
  	// go in an external fn.)
  	function parseSrcset(input, set) {

  		function collectCharacters(regEx) {
  			var chars,
  			    match = regEx.exec(input.substring(pos));
  			if (match) {
  				chars = match[ 0 ];
  				pos += chars.length;
  				return chars;
  			}
  		}

  		var inputLength = input.length,
  		    url,
  		    descriptors,
  		    currentDescriptor,
  		    state,
  		    c,

  		    // 2. Let position be a pointer into input, initially pointing at the start
  		    //    of the string.
  		    pos = 0,

  		    // 3. Let candidates be an initially empty source set.
  		    candidates = [];

  		/**
  		* Adds descriptor properties to a candidate, pushes to the candidates array
  		* @return undefined
  		*/
  		// (Declared outside of the while loop so that it's only created once.
  		// (This fn is defined before it is used, in order to pass JSHINT.
  		// Unfortunately this breaks the sequencing of the spec comments. :/ )
  		function parseDescriptors() {

  			// 9. Descriptor parser: Let error be no.
  			var pError = false,

  			// 10. Let width be absent.
  			// 11. Let density be absent.
  			// 12. Let future-compat-h be absent. (We're implementing it now as h)
  			    w, d, h, i,
  			    candidate = {},
  			    desc, lastChar, value, intVal, floatVal;

  			// 13. For each descriptor in descriptors, run the appropriate set of steps
  			// from the following list:
  			for (i = 0 ; i < descriptors.length; i++) {
  				desc = descriptors[ i ];

  				lastChar = desc[ desc.length - 1 ];
  				value = desc.substring(0, desc.length - 1);
  				intVal = parseInt(value, 10);
  				floatVal = parseFloat(value);

  				// If the descriptor consists of a valid non-negative integer followed by
  				// a U+0077 LATIN SMALL LETTER W character
  				if (regexNonNegativeInteger.test(value) && (lastChar === "w")) {

  					// If width and density are not both absent, then let error be yes.
  					if (w || d) {pError = true;}

  					// Apply the rules for parsing non-negative integers to the descriptor.
  					// If the result is zero, let error be yes.
  					// Otherwise, let width be the result.
  					if (intVal === 0) {pError = true;} else {w = intVal;}

  				// If the descriptor consists of a valid floating-point number followed by
  				// a U+0078 LATIN SMALL LETTER X character
  				} else if (regexFloatingPoint.test(value) && (lastChar === "x")) {

  					// If width, density and future-compat-h are not all absent, then let error
  					// be yes.
  					if (w || d || h) {pError = true;}

  					// Apply the rules for parsing floating-point number values to the descriptor.
  					// If the result is less than zero, let error be yes. Otherwise, let density
  					// be the result.
  					if (floatVal < 0) {pError = true;} else {d = floatVal;}

  				// If the descriptor consists of a valid non-negative integer followed by
  				// a U+0068 LATIN SMALL LETTER H character
  				} else if (regexNonNegativeInteger.test(value) && (lastChar === "h")) {

  					// If height and density are not both absent, then let error be yes.
  					if (h || d) {pError = true;}

  					// Apply the rules for parsing non-negative integers to the descriptor.
  					// If the result is zero, let error be yes. Otherwise, let future-compat-h
  					// be the result.
  					if (intVal === 0) {pError = true;} else {h = intVal;}

  				// Anything else, Let error be yes.
  				} else {pError = true;}
  			} // (close step 13 for loop)

  			// 15. If error is still no, then append a new image source to candidates whose
  			// URL is url, associated with a width width if not absent and a pixel
  			// density density if not absent. Otherwise, there is a parse error.
  			if (!pError) {
  				candidate.url = url;

  				if (w) { candidate.w = w;}
  				if (d) { candidate.d = d;}
  				if (h) { candidate.h = h;}
  				if (!h && !d && !w) {candidate.d = 1;}
  				if (candidate.d === 1) {set.has1x = true;}
  				candidate.set = set;

  				candidates.push(candidate);
  			}
  		} // (close parseDescriptors fn)

  		/**
  		* Tokenizes descriptor properties prior to parsing
  		* Returns undefined.
  		* (Again, this fn is defined before it is used, in order to pass JSHINT.
  		* Unfortunately this breaks the logical sequencing of the spec comments. :/ )
  		*/
  		function tokenize() {

  			// 8.1. Descriptor tokeniser: Skip whitespace
  			collectCharacters(regexLeadingSpaces);

  			// 8.2. Let current descriptor be the empty string.
  			currentDescriptor = "";

  			// 8.3. Let state be in descriptor.
  			state = "in descriptor";

  			while (true) {

  				// 8.4. Let c be the character at position.
  				c = input.charAt(pos);

  				//  Do the following depending on the value of state.
  				//  For the purpose of this step, "EOF" is a special character representing
  				//  that position is past the end of input.

  				// In descriptor
  				if (state === "in descriptor") {
  					// Do the following, depending on the value of c:

  				  // Space character
  				  // If current descriptor is not empty, append current descriptor to
  				  // descriptors and let current descriptor be the empty string.
  				  // Set state to after descriptor.
  					if (isSpace(c)) {
  						if (currentDescriptor) {
  							descriptors.push(currentDescriptor);
  							currentDescriptor = "";
  							state = "after descriptor";
  						}

  					// U+002C COMMA (,)
  					// Advance position to the next character in input. If current descriptor
  					// is not empty, append current descriptor to descriptors. Jump to the step
  					// labeled descriptor parser.
  					} else if (c === ",") {
  						pos += 1;
  						if (currentDescriptor) {
  							descriptors.push(currentDescriptor);
  						}
  						parseDescriptors();
  						return;

  					// U+0028 LEFT PARENTHESIS (()
  					// Append c to current descriptor. Set state to in parens.
  					} else if (c === "\u0028") {
  						currentDescriptor = currentDescriptor + c;
  						state = "in parens";

  					// EOF
  					// If current descriptor is not empty, append current descriptor to
  					// descriptors. Jump to the step labeled descriptor parser.
  					} else if (c === "") {
  						if (currentDescriptor) {
  							descriptors.push(currentDescriptor);
  						}
  						parseDescriptors();
  						return;

  					// Anything else
  					// Append c to current descriptor.
  					} else {
  						currentDescriptor = currentDescriptor + c;
  					}
  				// (end "in descriptor"

  				// In parens
  				} else if (state === "in parens") {

  					// U+0029 RIGHT PARENTHESIS ())
  					// Append c to current descriptor. Set state to in descriptor.
  					if (c === ")") {
  						currentDescriptor = currentDescriptor + c;
  						state = "in descriptor";

  					// EOF
  					// Append current descriptor to descriptors. Jump to the step labeled
  					// descriptor parser.
  					} else if (c === "") {
  						descriptors.push(currentDescriptor);
  						parseDescriptors();
  						return;

  					// Anything else
  					// Append c to current descriptor.
  					} else {
  						currentDescriptor = currentDescriptor + c;
  					}

  				// After descriptor
  				} else if (state === "after descriptor") {

  					// Do the following, depending on the value of c:
  					// Space character: Stay in this state.
  					if (isSpace(c)) ; else if (c === "") {
  						parseDescriptors();
  						return;

  					// Anything else
  					// Set state to in descriptor. Set position to the previous character in input.
  					} else {
  						state = "in descriptor";
  						pos -= 1;

  					}
  				}

  				// Advance position to the next character in input.
  				pos += 1;

  			// Repeat this step.
  			} // (close while true loop)
  		}

  		// 4. Splitting loop: Collect a sequence of characters that are space
  		//    characters or U+002C COMMA characters. If any U+002C COMMA characters
  		//    were collected, that is a parse error.
  		while (true) {
  			collectCharacters(regexLeadingCommasOrSpaces);

  			// 5. If position is past the end of input, return candidates and abort these steps.
  			if (pos >= inputLength) {
  				return candidates; // (we're done, this is the sole return path)
  			}

  			// 6. Collect a sequence of characters that are not space characters,
  			//    and let that be url.
  			url = collectCharacters(regexLeadingNotSpaces);

  			// 7. Let descriptors be a new empty list.
  			descriptors = [];

  			// 8. If url ends with a U+002C COMMA character (,), follow these substeps:
  			//		(1). Remove all trailing U+002C COMMA characters from url. If this removed
  			//         more than one character, that is a parse error.
  			if (url.slice(-1) === ",") {
  				url = url.replace(regexTrailingCommas, "");
  				// (Jump ahead to step 9 to skip tokenization and just push the candidate).
  				parseDescriptors();

  			//	Otherwise, follow these substeps:
  			} else {
  				tokenize();
  			} // (close else of step 8)

  		// 16. Return to the step labeled splitting loop.
  		} // (Close of big while loop.)
  	}

  	/*
  	 * Sizes Parser
  	 *
  	 * By Alex Bell |  MIT License
  	 *
  	 * Non-strict but accurate and lightweight JS Parser for the string value <img sizes="here">
  	 *
  	 * Reference algorithm at:
  	 * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-sizes-attribute
  	 *
  	 * Most comments are copied in directly from the spec
  	 * (except for comments in parens).
  	 *
  	 * Grammar is:
  	 * <source-size-list> = <source-size># [ , <source-size-value> ]? | <source-size-value>
  	 * <source-size> = <media-condition> <source-size-value>
  	 * <source-size-value> = <length>
  	 * http://www.w3.org/html/wg/drafts/html/master/embedded-content.html#attr-img-sizes
  	 *
  	 * E.g. "(max-width: 30em) 100vw, (max-width: 50em) 70vw, 100vw"
  	 * or "(min-width: 30em), calc(30vw - 15px)" or just "30vw"
  	 *
  	 * Returns the first valid <css-length> with a media condition that evaluates to true,
  	 * or "100vw" if all valid media conditions evaluate to false.
  	 *
  	 */

  	function parseSizes(strValue) {

  		// (Percentage CSS lengths are not allowed in this case, to avoid confusion:
  		// https://html.spec.whatwg.org/multipage/embedded-content.html#valid-source-size-list
  		// CSS allows a single optional plus or minus sign:
  		// http://www.w3.org/TR/CSS2/syndata.html#numbers
  		// CSS is ASCII case-insensitive:
  		// http://www.w3.org/TR/CSS2/syndata.html#characters )
  		// Spec allows exponential notation for <number> type:
  		// http://dev.w3.org/csswg/css-values/#numbers
  		var regexCssLengthWithUnits = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i;

  		// (This is a quick and lenient test. Because of optional unlimited-depth internal
  		// grouping parens and strict spacing rules, this could get very complicated.)
  		var regexCssCalc = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;

  		var i;
  		var unparsedSizesList;
  		var unparsedSizesListLength;
  		var unparsedSize;
  		var lastComponentValue;
  		var size;

  		// UTILITY FUNCTIONS

  		//  (Toy CSS parser. The goals here are:
  		//  1) expansive test coverage without the weight of a full CSS parser.
  		//  2) Avoiding regex wherever convenient.
  		//  Quick tests: http://jsfiddle.net/gtntL4gr/3/
  		//  Returns an array of arrays.)
  		function parseComponentValues(str) {
  			var chrctr;
  			var component = "";
  			var componentArray = [];
  			var listArray = [];
  			var parenDepth = 0;
  			var pos = 0;
  			var inComment = false;

  			function pushComponent() {
  				if (component) {
  					componentArray.push(component);
  					component = "";
  				}
  			}

  			function pushComponentArray() {
  				if (componentArray[0]) {
  					listArray.push(componentArray);
  					componentArray = [];
  				}
  			}

  			// (Loop forwards from the beginning of the string.)
  			while (true) {
  				chrctr = str.charAt(pos);

  				if (chrctr === "") { // ( End of string reached.)
  					pushComponent();
  					pushComponentArray();
  					return listArray;
  				} else if (inComment) {
  					if ((chrctr === "*") && (str[pos + 1] === "/")) { // (At end of a comment.)
  						inComment = false;
  						pos += 2;
  						pushComponent();
  						continue;
  					} else {
  						pos += 1; // (Skip all characters inside comments.)
  						continue;
  					}
  				} else if (isSpace(chrctr)) {
  					// (If previous character in loop was also a space, or if
  					// at the beginning of the string, do not add space char to
  					// component.)
  					if ( (str.charAt(pos - 1) && isSpace( str.charAt(pos - 1) ) ) || !component ) {
  						pos += 1;
  						continue;
  					} else if (parenDepth === 0) {
  						pushComponent();
  						pos +=1;
  						continue;
  					} else {
  						// (Replace any space character with a plain space for legibility.)
  						chrctr = " ";
  					}
  				} else if (chrctr === "(") {
  					parenDepth += 1;
  				} else if (chrctr === ")") {
  					parenDepth -= 1;
  				} else if (chrctr === ",") {
  					pushComponent();
  					pushComponentArray();
  					pos += 1;
  					continue;
  				} else if ( (chrctr === "/") && (str.charAt(pos + 1) === "*") ) {
  					inComment = true;
  					pos += 2;
  					continue;
  				}

  				component = component + chrctr;
  				pos += 1;
  			}
  		}

  		function isValidNonNegativeSourceSizeValue(s) {
  			if (regexCssLengthWithUnits.test(s) && (parseFloat(s) >= 0)) {return true;}
  			if (regexCssCalc.test(s)) {return true;}
  			// ( http://www.w3.org/TR/CSS2/syndata.html#numbers says:
  			// "-0 is equivalent to 0 and is not a negative number." which means that
  			// unitless zero and unitless negative zero must be accepted as special cases.)
  			if ((s === "0") || (s === "-0") || (s === "+0")) {return true;}
  			return false;
  		}

  		// When asked to parse a sizes attribute from an element, parse a
  		// comma-separated list of component values from the value of the element's
  		// sizes attribute (or the empty string, if the attribute is absent), and let
  		// unparsed sizes list be the result.
  		// http://dev.w3.org/csswg/css-syntax/#parse-comma-separated-list-of-component-values

  		unparsedSizesList = parseComponentValues(strValue);
  		unparsedSizesListLength = unparsedSizesList.length;

  		// For each unparsed size in unparsed sizes list:
  		for (i = 0; i < unparsedSizesListLength; i++) {
  			unparsedSize = unparsedSizesList[i];

  			// 1. Remove all consecutive <whitespace-token>s from the end of unparsed size.
  			// ( parseComponentValues() already omits spaces outside of parens. )

  			// If unparsed size is now empty, that is a parse error; continue to the next
  			// iteration of this algorithm.
  			// ( parseComponentValues() won't push an empty array. )

  			// 2. If the last component value in unparsed size is a valid non-negative
  			// <source-size-value>, let size be its value and remove the component value
  			// from unparsed size. Any CSS function other than the calc() function is
  			// invalid. Otherwise, there is a parse error; continue to the next iteration
  			// of this algorithm.
  			// http://dev.w3.org/csswg/css-syntax/#parse-component-value
  			lastComponentValue = unparsedSize[unparsedSize.length - 1];

  			if (isValidNonNegativeSourceSizeValue(lastComponentValue)) {
  				size = lastComponentValue;
  				unparsedSize.pop();
  			} else {
  				continue;
  			}

  			// 3. Remove all consecutive <whitespace-token>s from the end of unparsed
  			// size. If unparsed size is now empty, return size and exit this algorithm.
  			// If this was not the last item in unparsed sizes list, that is a parse error.
  			if (unparsedSize.length === 0) {
  				return size;
  			}

  			// 4. Parse the remaining component values in unparsed size as a
  			// <media-condition>. If it does not parse correctly, or it does parse
  			// correctly but the <media-condition> evaluates to false, continue to the
  			// next iteration of this algorithm.
  			// (Parsing all possible compound media conditions in JS is heavy, complicated,
  			// and the payoff is unclear. Is there ever an situation where the
  			// media condition parses incorrectly but still somehow evaluates to true?
  			// Can we just rely on the browser/polyfill to do it?)
  			unparsedSize = unparsedSize.join(" ");
  			if (!(pf.matchesMedia( unparsedSize ) ) ) {
  				continue;
  			}

  			// 5. Return size and exit this algorithm.
  			return size;
  		}

  		// If the above algorithm exhausts unparsed sizes list without returning a
  		// size value, return 100vw.
  		return "100vw";
  	}

  	// namespace
  	pf.ns = ("pf" + new Date().getTime()).substr(0, 9);

  	// srcset support test
  	pf.supSrcset = "srcset" in image;
  	pf.supSizes = "sizes" in image;
  	pf.supPicture = !!window.HTMLPictureElement;

  	// UC browser does claim to support srcset and picture, but not sizes,
  	// this extended test reveals the browser does support nothing
  	if (pf.supSrcset && pf.supPicture && !pf.supSizes) {
  		(function(image2) {
  			image.srcset = "data:,a";
  			image2.src = "data:,a";
  			pf.supSrcset = image.complete === image2.complete;
  			pf.supPicture = pf.supSrcset && pf.supPicture;
  		})(document.createElement("img"));
  	}

  	// Safari9 has basic support for sizes, but does't expose the `sizes` idl attribute
  	if (pf.supSrcset && !pf.supSizes) {

  		(function() {
  			var width2 = "data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==";
  			var width1 = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  			var img = document.createElement("img");
  			var test = function() {
  				var width = img.width;

  				if (width === 2) {
  					pf.supSizes = true;
  				}

  				alwaysCheckWDescriptor = pf.supSrcset && !pf.supSizes;

  				isSupportTestReady = true;
  				// force async
  				setTimeout(picturefill);
  			};

  			img.onload = test;
  			img.onerror = test;
  			img.setAttribute("sizes", "9px");

  			img.srcset = width1 + " 1w," + width2 + " 9w";
  			img.src = width1;
  		})();

  	} else {
  		isSupportTestReady = true;
  	}

  	// using pf.qsa instead of dom traversing does scale much better,
  	// especially on sites mixing responsive and non-responsive images
  	pf.selShort = "picture>img,img[srcset]";
  	pf.sel = pf.selShort;
  	pf.cfg = cfg;

  	/**
  	 * Shortcut property for `devicePixelRatio` ( for easy overriding in tests )
  	 */
  	pf.DPR = (DPR  || 1 );
  	pf.u = units;

  	// container of supported mime types that one might need to qualify before using
  	pf.types =  types;

  	pf.setSize = noop;

  	/**
  	 * Gets a string and returns the absolute URL
  	 * @param src
  	 * @returns {String} absolute URL
  	 */

  	pf.makeUrl = memoize(function(src) {
  		anchor.href = src;
  		return anchor.href;
  	});

  	/**
  	 * Gets a DOM element or document and a selctor and returns the found matches
  	 * Can be extended with jQuery/Sizzle for IE7 support
  	 * @param context
  	 * @param sel
  	 * @returns {NodeList|Array}
  	 */
  	pf.qsa = function(context, sel) {
  		return ( "querySelector" in context ) ? context.querySelectorAll(sel) : [];
  	};

  	/**
  	 * Shortcut method for matchMedia ( for easy overriding in tests )
  	 * wether native or pf.mMQ is used will be decided lazy on first call
  	 * @returns {boolean}
  	 */
  	pf.matchesMedia = function() {
  		if ( window.matchMedia && (matchMedia( "(min-width: 0.1em)" ) || {}).matches ) {
  			pf.matchesMedia = function( media ) {
  				return !media || ( matchMedia( media ).matches );
  			};
  		} else {
  			pf.matchesMedia = pf.mMQ;
  		}

  		return pf.matchesMedia.apply( this, arguments );
  	};

  	/**
  	 * A simplified matchMedia implementation for IE8 and IE9
  	 * handles only min-width/max-width with px or em values
  	 * @param media
  	 * @returns {boolean}
  	 */
  	pf.mMQ = function( media ) {
  		return media ? evalCSS(media) : true;
  	};

  	/**
  	 * Returns the calculated length in css pixel from the given sourceSizeValue
  	 * http://dev.w3.org/csswg/css-values-3/#length-value
  	 * intended Spec mismatches:
  	 * * Does not check for invalid use of CSS functions
  	 * * Does handle a computed length of 0 the same as a negative and therefore invalid value
  	 * @param sourceSizeValue
  	 * @returns {Number}
  	 */
  	pf.calcLength = function( sourceSizeValue ) {

  		var value = evalCSS(sourceSizeValue, true) || false;
  		if (value < 0) {
  			value = false;
  		}

  		return value;
  	};

  	/**
  	 * Takes a type string and checks if its supported
  	 */

  	pf.supportsType = function( type ) {
  		return ( type ) ? types[ type ] : true;
  	};

  	/**
  	 * Parses a sourceSize into mediaCondition (media) and sourceSizeValue (length)
  	 * @param sourceSizeStr
  	 * @returns {*}
  	 */
  	pf.parseSize = memoize(function( sourceSizeStr ) {
  		var match = ( sourceSizeStr || "" ).match(regSize);
  		return {
  			media: match && match[1],
  			length: match && match[2]
  		};
  	});

  	pf.parseSet = function( set ) {
  		if ( !set.cands ) {
  			set.cands = parseSrcset(set.srcset, set);
  		}
  		return set.cands;
  	};

  	/**
  	 * returns 1em in css px for html/body default size
  	 * function taken from respondjs
  	 * @returns {*|number}
  	 */
  	pf.getEmValue = function() {
  		var body;
  		if ( !eminpx && (body = document.body) ) {
  			var div = document.createElement( "div" ),
  				originalHTMLCSS = docElem.style.cssText,
  				originalBodyCSS = body.style.cssText;

  			div.style.cssText = baseStyle;

  			// 1em in a media query is the value of the default font size of the browser
  			// reset docElem and body to ensure the correct value is returned
  			docElem.style.cssText = fsCss;
  			body.style.cssText = fsCss;

  			body.appendChild( div );
  			eminpx = div.offsetWidth;
  			body.removeChild( div );

  			//also update eminpx before returning
  			eminpx = parseFloat( eminpx, 10 );

  			// restore the original values
  			docElem.style.cssText = originalHTMLCSS;
  			body.style.cssText = originalBodyCSS;

  		}
  		return eminpx || 16;
  	};

  	/**
  	 * Takes a string of sizes and returns the width in pixels as a number
  	 */
  	pf.calcListLength = function( sourceSizeListStr ) {
  		// Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
  		//
  		//                           or (min-width:30em) calc(30% - 15px)
  		if ( !(sourceSizeListStr in sizeLengthCache) || cfg.uT ) {
  			var winningLength = pf.calcLength( parseSizes( sourceSizeListStr ) );

  			sizeLengthCache[ sourceSizeListStr ] = !winningLength ? units.width : winningLength;
  		}

  		return sizeLengthCache[ sourceSizeListStr ];
  	};

  	/**
  	 * Takes a candidate object with a srcset property in the form of url/
  	 * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
  	 *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
  	 *     "images/pic-small.png"
  	 * Get an array of image candidates in the form of
  	 *      {url: "/foo/bar.png", resolution: 1}
  	 * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
  	 * If sizes is specified, res is calculated
  	 */
  	pf.setRes = function( set ) {
  		var candidates;
  		if ( set ) {

  			candidates = pf.parseSet( set );

  			for ( var i = 0, len = candidates.length; i < len; i++ ) {
  				setResolution( candidates[ i ], set.sizes );
  			}
  		}
  		return candidates;
  	};

  	pf.setRes.res = setResolution;

  	pf.applySetCandidate = function( candidates, img ) {
  		if ( !candidates.length ) {return;}
  		var candidate,
  			i,
  			j,
  			length,
  			bestCandidate,
  			curSrc,
  			curCan,
  			candidateSrc,
  			abortCurSrc;

  		var imageData = img[ pf.ns ];
  		var dpr = pf.DPR;

  		curSrc = imageData.curSrc || img[curSrcProp];

  		curCan = imageData.curCan || setSrcToCur(img, curSrc, candidates[0].set);

  		// if we have a current source, we might either become lazy or give this source some advantage
  		if ( curCan && curCan.set === candidates[ 0 ].set ) {

  			// if browser can abort image request and the image has a higher pixel density than needed
  			// and this image isn't downloaded yet, we skip next part and try to save bandwidth
  			abortCurSrc = (supportAbort && !img.complete && curCan.res - 0.1 > dpr);

  			if ( !abortCurSrc ) {
  				curCan.cached = true;

  				// if current candidate is "best", "better" or "okay",
  				// set it to bestCandidate
  				if ( curCan.res >= dpr ) {
  					bestCandidate = curCan;
  				}
  			}
  		}

  		if ( !bestCandidate ) {

  			candidates.sort( ascendingSort );

  			length = candidates.length;
  			bestCandidate = candidates[ length - 1 ];

  			for ( i = 0; i < length; i++ ) {
  				candidate = candidates[ i ];
  				if ( candidate.res >= dpr ) {
  					j = i - 1;

  					// we have found the perfect candidate,
  					// but let's improve this a little bit with some assumptions ;-)
  					if (candidates[ j ] &&
  						(abortCurSrc || curSrc !== pf.makeUrl( candidate.url )) &&
  						chooseLowRes(candidates[ j ].res, candidate.res, dpr, candidates[ j ].cached)) {

  						bestCandidate = candidates[ j ];

  					} else {
  						bestCandidate = candidate;
  					}
  					break;
  				}
  			}
  		}

  		if ( bestCandidate ) {

  			candidateSrc = pf.makeUrl( bestCandidate.url );

  			imageData.curSrc = candidateSrc;
  			imageData.curCan = bestCandidate;

  			if ( candidateSrc !== curSrc ) {
  				pf.setSrc( img, bestCandidate );
  			}
  			pf.setSize( img );
  		}
  	};

  	pf.setSrc = function( img, bestCandidate ) {
  		var origWidth;
  		img.src = bestCandidate.url;

  		// although this is a specific Safari issue, we don't want to take too much different code paths
  		if ( bestCandidate.set.type === "image/svg+xml" ) {
  			origWidth = img.style.width;
  			img.style.width = (img.offsetWidth + 1) + "px";

  			// next line only should trigger a repaint
  			// if... is only done to trick dead code removal
  			if ( img.offsetWidth + 1 ) {
  				img.style.width = origWidth;
  			}
  		}
  	};

  	pf.getSet = function( img ) {
  		var i, set, supportsType;
  		var match = false;
  		var sets = img [ pf.ns ].sets;

  		for ( i = 0; i < sets.length && !match; i++ ) {
  			set = sets[i];

  			if ( !set.srcset || !pf.matchesMedia( set.media ) || !(supportsType = pf.supportsType( set.type )) ) {
  				continue;
  			}

  			if ( supportsType === "pending" ) {
  				set = supportsType;
  			}

  			match = set;
  			break;
  		}

  		return match;
  	};

  	pf.parseSets = function( element, parent, options ) {
  		var srcsetAttribute, imageSet, isWDescripor, srcsetParsed;

  		var hasPicture = parent && parent.nodeName.toUpperCase() === "PICTURE";
  		var imageData = element[ pf.ns ];

  		if ( imageData.src === undefined$1 || options.src ) {
  			imageData.src = getImgAttr.call( element, "src" );
  			if ( imageData.src ) {
  				setImgAttr.call( element, srcAttr, imageData.src );
  			} else {
  				removeImgAttr.call( element, srcAttr );
  			}
  		}

  		if ( imageData.srcset === undefined$1 || options.srcset || !pf.supSrcset || element.srcset ) {
  			srcsetAttribute = getImgAttr.call( element, "srcset" );
  			imageData.srcset = srcsetAttribute;
  			srcsetParsed = true;
  		}

  		imageData.sets = [];

  		if ( hasPicture ) {
  			imageData.pic = true;
  			getAllSourceElements( parent, imageData.sets );
  		}

  		if ( imageData.srcset ) {
  			imageSet = {
  				srcset: imageData.srcset,
  				sizes: getImgAttr.call( element, "sizes" )
  			};

  			imageData.sets.push( imageSet );

  			isWDescripor = (alwaysCheckWDescriptor || imageData.src) && regWDesc.test(imageData.srcset || "");

  			// add normal src as candidate, if source has no w descriptor
  			if ( !isWDescripor && imageData.src && !getCandidateForSrc(imageData.src, imageSet) && !imageSet.has1x ) {
  				imageSet.srcset += ", " + imageData.src;
  				imageSet.cands.push({
  					url: imageData.src,
  					d: 1,
  					set: imageSet
  				});
  			}

  		} else if ( imageData.src ) {
  			imageData.sets.push( {
  				srcset: imageData.src,
  				sizes: null
  			} );
  		}

  		imageData.curCan = null;
  		imageData.curSrc = undefined$1;

  		// if img has picture or the srcset was removed or has a srcset and does not support srcset at all
  		// or has a w descriptor (and does not support sizes) set support to false to evaluate
  		imageData.supported = !( hasPicture || ( imageSet && !pf.supSrcset ) || (isWDescripor && !pf.supSizes) );

  		if ( srcsetParsed && pf.supSrcset && !imageData.supported ) {
  			if ( srcsetAttribute ) {
  				setImgAttr.call( element, srcsetAttr, srcsetAttribute );
  				element.srcset = "";
  			} else {
  				removeImgAttr.call( element, srcsetAttr );
  			}
  		}

  		if (imageData.supported && !imageData.srcset && ((!imageData.src && element.src) ||  element.src !== pf.makeUrl(imageData.src))) {
  			if (imageData.src === null) {
  				element.removeAttribute("src");
  			} else {
  				element.src = imageData.src;
  			}
  		}

  		imageData.parsed = true;
  	};

  	pf.fillImg = function(element, options) {
  		var imageData;
  		var extreme = options.reselect || options.reevaluate;

  		// expando for caching data on the img
  		if ( !element[ pf.ns ] ) {
  			element[ pf.ns ] = {};
  		}

  		imageData = element[ pf.ns ];

  		// if the element has already been evaluated, skip it
  		// unless `options.reevaluate` is set to true ( this, for example,
  		// is set to true when running `picturefill` on `resize` ).
  		if ( !extreme && imageData.evaled === evalId ) {
  			return;
  		}

  		if ( !imageData.parsed || options.reevaluate ) {
  			pf.parseSets( element, element.parentNode, options );
  		}

  		if ( !imageData.supported ) {
  			applyBestCandidate( element );
  		} else {
  			imageData.evaled = evalId;
  		}
  	};

  	pf.setupRun = function() {
  		if ( !alreadyRun || isVwDirty || (DPR !== window.devicePixelRatio) ) {
  			updateMetrics();
  		}
  	};

  	// If picture is supported, well, that's awesome.
  	if ( pf.supPicture ) {
  		picturefill = noop;
  		pf.fillImg = noop;
  	} else {

  		 // Set up picture polyfill by polling the document
  		(function() {
  			var isDomReady;
  			var regReady = window.attachEvent ? /d$|^c/ : /d$|^c|^i/;

  			var run = function() {
  				var readyState = document.readyState || "";

  				timerId = setTimeout(run, readyState === "loading" ? 200 :  999);
  				if ( document.body ) {
  					pf.fillImgs();
  					isDomReady = isDomReady || regReady.test(readyState);
  					if ( isDomReady ) {
  						clearTimeout( timerId );
  					}

  				}
  			};

  			var timerId = setTimeout(run, document.body ? 9 : 99);

  			// Also attach picturefill on resize and readystatechange
  			// http://modernjavascript.blogspot.com/2013/08/building-better-debounce.html
  			var debounce = function(func, wait) {
  				var timeout, timestamp;
  				var later = function() {
  					var last = (new Date()) - timestamp;

  					if (last < wait) {
  						timeout = setTimeout(later, wait - last);
  					} else {
  						timeout = null;
  						func();
  					}
  				};

  				return function() {
  					timestamp = new Date();

  					if (!timeout) {
  						timeout = setTimeout(later, wait);
  					}
  				};
  			};
  			var lastClientWidth = docElem.clientHeight;
  			var onResize = function() {
  				isVwDirty = Math.max(window.innerWidth || 0, docElem.clientWidth) !== units.width || docElem.clientHeight !== lastClientWidth;
  				lastClientWidth = docElem.clientHeight;
  				if ( isVwDirty ) {
  					pf.fillImgs();
  				}
  			};

  			on( window, "resize", debounce(onResize, 99 ) );
  			on( document, "readystatechange", run );
  		})();
  	}

  	pf.picturefill = picturefill;
  	//use this internally for easy monkey patching/performance testing
  	pf.fillImgs = picturefill;
  	pf.teardownRun = noop;

  	/* expose methods for testing */
  	picturefill._ = pf;

  	window.picturefillCFG = {
  		pf: pf,
  		push: function(args) {
  			var name = args.shift();
  			if (typeof pf[name] === "function") {
  				pf[name].apply(pf, args);
  			} else {
  				cfg[name] = args[0];
  				if (alreadyRun) {
  					pf.fillImgs( { reselect: true } );
  				}
  			}
  		}
  	};

  	while (setOptions && setOptions.length) {
  		window.picturefillCFG.push(setOptions.shift());
  	}

  	/* expose picturefill */
  	window.picturefill = picturefill;

  	/* expose picturefill */
  	{
  		// CommonJS, just export
  		module.exports = picturefill;
  	}

  	// IE8 evals this sync, so it must be the last thing we do
  	if ( !pf.supPicture ) {
  		types[ "image/webp" ] = detectTypeSupport("image/webp", "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==" );
  	}

  } )( window, document );
  });

  /**
   * Copyright 2016 Google Inc. All Rights Reserved.
   *
   * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
   *
   *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
   *
   */
  (function() {

  // Exit early if we're not running in a browser.
  if (typeof window !== 'object') {
    return;
  }

  // Exit early if all IntersectionObserver and IntersectionObserverEntry
  // features are natively supported.
  if ('IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype,
        'isIntersecting', {
        get: function () {
          return this.intersectionRatio > 0;
        }
      });
    }
    return;
  }

  /**
   * Returns the embedding frame element, if any.
   * @param {!Document} doc
   * @return {!Element}
   */
  function getFrameElement(doc) {
    try {
      return doc.defaultView && doc.defaultView.frameElement || null;
    } catch (e) {
      // Ignore the error.
      return null;
    }
  }

  /**
   * A local reference to the root document.
   */
  var document = (function(startDoc) {
    var doc = startDoc;
    var frame = getFrameElement(doc);
    while (frame) {
      doc = frame.ownerDocument;
      frame = getFrameElement(doc);
    }
    return doc;
  })(window.document);

  /**
   * An IntersectionObserver registry. This registry exists to hold a strong
   * reference to IntersectionObserver instances currently observing a target
   * element. Without this registry, instances without another reference may be
   * garbage collected.
   */
  var registry = [];

  /**
   * The signal updater for cross-origin intersection. When not null, it means
   * that the polyfill is configured to work in a cross-origin mode.
   * @type {function(DOMRect|ClientRect, DOMRect|ClientRect)}
   */
  var crossOriginUpdater = null;

  /**
   * The current cross-origin intersection. Only used in the cross-origin mode.
   * @type {DOMRect|ClientRect}
   */
  var crossOriginRect = null;


  /**
   * Creates the global IntersectionObserverEntry constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
   * @param {Object} entry A dictionary of instance properties.
   * @constructor
   */
  function IntersectionObserverEntry(entry) {
    this.time = entry.time;
    this.target = entry.target;
    this.rootBounds = ensureDOMRect(entry.rootBounds);
    this.boundingClientRect = ensureDOMRect(entry.boundingClientRect);
    this.intersectionRect = ensureDOMRect(entry.intersectionRect || getEmptyRect());
    this.isIntersecting = !!entry.intersectionRect;

    // Calculates the intersection ratio.
    var targetRect = this.boundingClientRect;
    var targetArea = targetRect.width * targetRect.height;
    var intersectionRect = this.intersectionRect;
    var intersectionArea = intersectionRect.width * intersectionRect.height;

    // Sets intersection ratio.
    if (targetArea) {
      // Round the intersection ratio to avoid floating point math issues:
      // https://github.com/w3c/IntersectionObserver/issues/324
      this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
    } else {
      // If area is zero and is intersecting, sets to 1, otherwise to 0
      this.intersectionRatio = this.isIntersecting ? 1 : 0;
    }
  }


  /**
   * Creates the global IntersectionObserver constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
   * @param {Function} callback The function to be invoked after intersection
   *     changes have queued. The function is not invoked if the queue has
   *     been emptied by calling the `takeRecords` method.
   * @param {Object=} opt_options Optional configuration options.
   * @constructor
   */
  function IntersectionObserver(callback, opt_options) {

    var options = opt_options || {};

    if (typeof callback != 'function') {
      throw new Error('callback must be a function');
    }

    if (
      options.root &&
      options.root.nodeType != 1 &&
      options.root.nodeType != 9
    ) {
      throw new Error('root must be a Document or Element');
    }

    // Binds and throttles `this._checkForIntersections`.
    this._checkForIntersections = throttle(
        this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);

    // Private properties.
    this._callback = callback;
    this._observationTargets = [];
    this._queuedEntries = [];
    this._rootMarginValues = this._parseRootMargin(options.rootMargin);

    // Public properties.
    this.thresholds = this._initThresholds(options.threshold);
    this.root = options.root || null;
    this.rootMargin = this._rootMarginValues.map(function(margin) {
      return margin.value + margin.unit;
    }).join(' ');

    /** @private @const {!Array<!Document>} */
    this._monitoringDocuments = [];
    /** @private @const {!Array<function()>} */
    this._monitoringUnsubscribes = [];
  }


  /**
   * The minimum interval within which the document will be checked for
   * intersection changes.
   */
  IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;


  /**
   * The frequency in which the polyfill polls for intersection changes.
   * this can be updated on a per instance basis and must be set prior to
   * calling `observe` on the first target.
   */
  IntersectionObserver.prototype.POLL_INTERVAL = null;

  /**
   * Use a mutation observer on the root element
   * to detect intersection changes.
   */
  IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;


  /**
   * Sets up the polyfill in the cross-origin mode. The result is the
   * updater function that accepts two arguments: `boundingClientRect` and
   * `intersectionRect` - just as these fields would be available to the
   * parent via `IntersectionObserverEntry`. This function should be called
   * each time the iframe receives intersection information from the parent
   * window, e.g. via messaging.
   * @return {function(DOMRect|ClientRect, DOMRect|ClientRect)}
   */
  IntersectionObserver._setupCrossOriginUpdater = function() {
    if (!crossOriginUpdater) {
      /**
       * @param {DOMRect|ClientRect} boundingClientRect
       * @param {DOMRect|ClientRect} intersectionRect
       */
      crossOriginUpdater = function(boundingClientRect, intersectionRect) {
        if (!boundingClientRect || !intersectionRect) {
          crossOriginRect = getEmptyRect();
        } else {
          crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);
        }
        registry.forEach(function(observer) {
          observer._checkForIntersections();
        });
      };
    }
    return crossOriginUpdater;
  };


  /**
   * Resets the cross-origin mode.
   */
  IntersectionObserver._resetCrossOriginUpdater = function() {
    crossOriginUpdater = null;
    crossOriginRect = null;
  };


  /**
   * Starts observing a target element for intersection changes based on
   * the thresholds values.
   * @param {Element} target The DOM element to observe.
   */
  IntersectionObserver.prototype.observe = function(target) {
    var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
      return item.element == target;
    });

    if (isTargetAlreadyObserved) {
      return;
    }

    if (!(target && target.nodeType == 1)) {
      throw new Error('target must be an Element');
    }

    this._registerInstance();
    this._observationTargets.push({element: target, entry: null});
    this._monitorIntersections(target.ownerDocument);
    this._checkForIntersections();
  };


  /**
   * Stops observing a target element for intersection changes.
   * @param {Element} target The DOM element to observe.
   */
  IntersectionObserver.prototype.unobserve = function(target) {
    this._observationTargets =
        this._observationTargets.filter(function(item) {
          return item.element != target;
        });
    this._unmonitorIntersections(target.ownerDocument);
    if (this._observationTargets.length == 0) {
      this._unregisterInstance();
    }
  };


  /**
   * Stops observing all target elements for intersection changes.
   */
  IntersectionObserver.prototype.disconnect = function() {
    this._observationTargets = [];
    this._unmonitorAllIntersections();
    this._unregisterInstance();
  };


  /**
   * Returns any queue entries that have not yet been reported to the
   * callback and clears the queue. This can be used in conjunction with the
   * callback to obtain the absolute most up-to-date intersection information.
   * @return {Array} The currently queued entries.
   */
  IntersectionObserver.prototype.takeRecords = function() {
    var records = this._queuedEntries.slice();
    this._queuedEntries = [];
    return records;
  };


  /**
   * Accepts the threshold value from the user configuration object and
   * returns a sorted array of unique threshold values. If a value is not
   * between 0 and 1 and error is thrown.
   * @private
   * @param {Array|number=} opt_threshold An optional threshold value or
   *     a list of threshold values, defaulting to [0].
   * @return {Array} A sorted list of unique and valid threshold values.
   */
  IntersectionObserver.prototype._initThresholds = function(opt_threshold) {
    var threshold = opt_threshold || [0];
    if (!Array.isArray(threshold)) threshold = [threshold];

    return threshold.sort().filter(function(t, i, a) {
      if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
        throw new Error('threshold must be a number between 0 and 1 inclusively');
      }
      return t !== a[i - 1];
    });
  };


  /**
   * Accepts the rootMargin value from the user configuration object
   * and returns an array of the four margin values as an object containing
   * the value and unit properties. If any of the values are not properly
   * formatted or use a unit other than px or %, and error is thrown.
   * @private
   * @param {string=} opt_rootMargin An optional rootMargin value,
   *     defaulting to '0px'.
   * @return {Array<Object>} An array of margin objects with the keys
   *     value and unit.
   */
  IntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {
    var marginString = opt_rootMargin || '0px';
    var margins = marginString.split(/\s+/).map(function(margin) {
      var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
      if (!parts) {
        throw new Error('rootMargin must be specified in pixels or percent');
      }
      return {value: parseFloat(parts[1]), unit: parts[2]};
    });

    // Handles shorthand.
    margins[1] = margins[1] || margins[0];
    margins[2] = margins[2] || margins[0];
    margins[3] = margins[3] || margins[1];

    return margins;
  };


  /**
   * Starts polling for intersection changes if the polling is not already
   * happening, and if the page's visibility state is visible.
   * @param {!Document} doc
   * @private
   */
  IntersectionObserver.prototype._monitorIntersections = function(doc) {
    var win = doc.defaultView;
    if (!win) {
      // Already destroyed.
      return;
    }
    if (this._monitoringDocuments.indexOf(doc) != -1) {
      // Already monitoring.
      return;
    }

    // Private state for monitoring.
    var callback = this._checkForIntersections;
    var monitoringInterval = null;
    var domObserver = null;

    // If a poll interval is set, use polling instead of listening to
    // resize and scroll events or DOM mutations.
    if (this.POLL_INTERVAL) {
      monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);
    } else {
      addEvent(win, 'resize', callback, true);
      addEvent(doc, 'scroll', callback, true);
      if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in win) {
        domObserver = new win.MutationObserver(callback);
        domObserver.observe(doc, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
      }
    }

    this._monitoringDocuments.push(doc);
    this._monitoringUnsubscribes.push(function() {
      // Get the window object again. When a friendly iframe is destroyed, it
      // will be null.
      var win = doc.defaultView;

      if (win) {
        if (monitoringInterval) {
          win.clearInterval(monitoringInterval);
        }
        removeEvent(win, 'resize', callback, true);
      }

      removeEvent(doc, 'scroll', callback, true);
      if (domObserver) {
        domObserver.disconnect();
      }
    });

    // Also monitor the parent.
    var rootDoc =
      (this.root && (this.root.ownerDocument || this.root)) || document;
    if (doc != rootDoc) {
      var frame = getFrameElement(doc);
      if (frame) {
        this._monitorIntersections(frame.ownerDocument);
      }
    }
  };


  /**
   * Stops polling for intersection changes.
   * @param {!Document} doc
   * @private
   */
  IntersectionObserver.prototype._unmonitorIntersections = function(doc) {
    var index = this._monitoringDocuments.indexOf(doc);
    if (index == -1) {
      return;
    }

    var rootDoc =
      (this.root && (this.root.ownerDocument || this.root)) || document;

    // Check if any dependent targets are still remaining.
    var hasDependentTargets =
        this._observationTargets.some(function(item) {
          var itemDoc = item.element.ownerDocument;
          // Target is in this context.
          if (itemDoc == doc) {
            return true;
          }
          // Target is nested in this context.
          while (itemDoc && itemDoc != rootDoc) {
            var frame = getFrameElement(itemDoc);
            itemDoc = frame && frame.ownerDocument;
            if (itemDoc == doc) {
              return true;
            }
          }
          return false;
        });
    if (hasDependentTargets) {
      return;
    }

    // Unsubscribe.
    var unsubscribe = this._monitoringUnsubscribes[index];
    this._monitoringDocuments.splice(index, 1);
    this._monitoringUnsubscribes.splice(index, 1);
    unsubscribe();

    // Also unmonitor the parent.
    if (doc != rootDoc) {
      var frame = getFrameElement(doc);
      if (frame) {
        this._unmonitorIntersections(frame.ownerDocument);
      }
    }
  };


  /**
   * Stops polling for intersection changes.
   * @param {!Document} doc
   * @private
   */
  IntersectionObserver.prototype._unmonitorAllIntersections = function() {
    var unsubscribes = this._monitoringUnsubscribes.slice(0);
    this._monitoringDocuments.length = 0;
    this._monitoringUnsubscribes.length = 0;
    for (var i = 0; i < unsubscribes.length; i++) {
      unsubscribes[i]();
    }
  };


  /**
   * Scans each observation target for intersection changes and adds them
   * to the internal entries queue. If new entries are found, it
   * schedules the callback to be invoked.
   * @private
   */
  IntersectionObserver.prototype._checkForIntersections = function() {
    if (!this.root && crossOriginUpdater && !crossOriginRect) {
      // Cross origin monitoring, but no initial data available yet.
      return;
    }

    var rootIsInDom = this._rootIsInDom();
    var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

    this._observationTargets.forEach(function(item) {
      var target = item.element;
      var targetRect = getBoundingClientRect(target);
      var rootContainsTarget = this._rootContainsTarget(target);
      var oldEntry = item.entry;
      var intersectionRect = rootIsInDom && rootContainsTarget &&
          this._computeTargetAndRootIntersection(target, targetRect, rootRect);

      var rootBounds = null;
      if (!this._rootContainsTarget(target)) {
        rootBounds = getEmptyRect();
      } else if (!crossOriginUpdater || this.root) {
        rootBounds = rootRect;
      }

      var newEntry = item.entry = new IntersectionObserverEntry({
        time: now(),
        target: target,
        boundingClientRect: targetRect,
        rootBounds: rootBounds,
        intersectionRect: intersectionRect
      });

      if (!oldEntry) {
        this._queuedEntries.push(newEntry);
      } else if (rootIsInDom && rootContainsTarget) {
        // If the new entry intersection ratio has crossed any of the
        // thresholds, add a new entry.
        if (this._hasCrossedThreshold(oldEntry, newEntry)) {
          this._queuedEntries.push(newEntry);
        }
      } else {
        // If the root is not in the DOM or target is not contained within
        // root but the previous entry for this target had an intersection,
        // add a new record indicating removal.
        if (oldEntry && oldEntry.isIntersecting) {
          this._queuedEntries.push(newEntry);
        }
      }
    }, this);

    if (this._queuedEntries.length) {
      this._callback(this.takeRecords(), this);
    }
  };


  /**
   * Accepts a target and root rect computes the intersection between then
   * following the algorithm in the spec.
   * TODO(philipwalton): at this time clip-path is not considered.
   * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
   * @param {Element} target The target DOM element
   * @param {Object} targetRect The bounding rect of the target.
   * @param {Object} rootRect The bounding rect of the root after being
   *     expanded by the rootMargin value.
   * @return {?Object} The final intersection rect object or undefined if no
   *     intersection is found.
   * @private
   */
  IntersectionObserver.prototype._computeTargetAndRootIntersection =
      function(target, targetRect, rootRect) {
    // If the element isn't displayed, an intersection can't happen.
    if (window.getComputedStyle(target).display == 'none') return;

    var intersectionRect = targetRect;
    var parent = getParentNode(target);
    var atRoot = false;

    while (!atRoot && parent) {
      var parentRect = null;
      var parentComputedStyle = parent.nodeType == 1 ?
          window.getComputedStyle(parent) : {};

      // If the parent isn't displayed, an intersection can't happen.
      if (parentComputedStyle.display == 'none') return null;

      if (parent == this.root || parent.nodeType == /* DOCUMENT */ 9) {
        atRoot = true;
        if (parent == this.root || parent == document) {
          if (crossOriginUpdater && !this.root) {
            if (!crossOriginRect ||
                crossOriginRect.width == 0 && crossOriginRect.height == 0) {
              // A 0-size cross-origin intersection means no-intersection.
              parent = null;
              parentRect = null;
              intersectionRect = null;
            } else {
              parentRect = crossOriginRect;
            }
          } else {
            parentRect = rootRect;
          }
        } else {
          // Check if there's a frame that can be navigated to.
          var frame = getParentNode(parent);
          var frameRect = frame && getBoundingClientRect(frame);
          var frameIntersect =
              frame &&
              this._computeTargetAndRootIntersection(frame, frameRect, rootRect);
          if (frameRect && frameIntersect) {
            parent = frame;
            parentRect = convertFromParentRect(frameRect, frameIntersect);
          } else {
            parent = null;
            intersectionRect = null;
          }
        }
      } else {
        // If the element has a non-visible overflow, and it's not the <body>
        // or <html> element, update the intersection rect.
        // Note: <body> and <html> cannot be clipped to a rect that's not also
        // the document rect, so no need to compute a new intersection.
        var doc = parent.ownerDocument;
        if (parent != doc.body &&
            parent != doc.documentElement &&
            parentComputedStyle.overflow != 'visible') {
          parentRect = getBoundingClientRect(parent);
        }
      }

      // If either of the above conditionals set a new parentRect,
      // calculate new intersection data.
      if (parentRect) {
        intersectionRect = computeRectIntersection(parentRect, intersectionRect);
      }
      if (!intersectionRect) break;
      parent = parent && getParentNode(parent);
    }
    return intersectionRect;
  };


  /**
   * Returns the root rect after being expanded by the rootMargin value.
   * @return {ClientRect} The expanded root rect.
   * @private
   */
  IntersectionObserver.prototype._getRootRect = function() {
    var rootRect;
    if (this.root && !isDoc(this.root)) {
      rootRect = getBoundingClientRect(this.root);
    } else {
      // Use <html>/<body> instead of window since scroll bars affect size.
      var doc = isDoc(this.root) ? this.root : document;
      var html = doc.documentElement;
      var body = doc.body;
      rootRect = {
        top: 0,
        left: 0,
        right: html.clientWidth || body.clientWidth,
        width: html.clientWidth || body.clientWidth,
        bottom: html.clientHeight || body.clientHeight,
        height: html.clientHeight || body.clientHeight
      };
    }
    return this._expandRectByRootMargin(rootRect);
  };


  /**
   * Accepts a rect and expands it by the rootMargin value.
   * @param {DOMRect|ClientRect} rect The rect object to expand.
   * @return {ClientRect} The expanded rect.
   * @private
   */
  IntersectionObserver.prototype._expandRectByRootMargin = function(rect) {
    var margins = this._rootMarginValues.map(function(margin, i) {
      return margin.unit == 'px' ? margin.value :
          margin.value * (i % 2 ? rect.width : rect.height) / 100;
    });
    var newRect = {
      top: rect.top - margins[0],
      right: rect.right + margins[1],
      bottom: rect.bottom + margins[2],
      left: rect.left - margins[3]
    };
    newRect.width = newRect.right - newRect.left;
    newRect.height = newRect.bottom - newRect.top;

    return newRect;
  };


  /**
   * Accepts an old and new entry and returns true if at least one of the
   * threshold values has been crossed.
   * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
   *    particular target element or null if no previous entry exists.
   * @param {IntersectionObserverEntry} newEntry The current entry for a
   *    particular target element.
   * @return {boolean} Returns true if a any threshold has been crossed.
   * @private
   */
  IntersectionObserver.prototype._hasCrossedThreshold =
      function(oldEntry, newEntry) {

    // To make comparing easier, an entry that has a ratio of 0
    // but does not actually intersect is given a value of -1
    var oldRatio = oldEntry && oldEntry.isIntersecting ?
        oldEntry.intersectionRatio || 0 : -1;
    var newRatio = newEntry.isIntersecting ?
        newEntry.intersectionRatio || 0 : -1;

    // Ignore unchanged ratios
    if (oldRatio === newRatio) return;

    for (var i = 0; i < this.thresholds.length; i++) {
      var threshold = this.thresholds[i];

      // Return true if an entry matches a threshold or if the new ratio
      // and the old ratio are on the opposite sides of a threshold.
      if (threshold == oldRatio || threshold == newRatio ||
          threshold < oldRatio !== threshold < newRatio) {
        return true;
      }
    }
  };


  /**
   * Returns whether or not the root element is an element and is in the DOM.
   * @return {boolean} True if the root element is an element and is in the DOM.
   * @private
   */
  IntersectionObserver.prototype._rootIsInDom = function() {
    return !this.root || containsDeep(document, this.root);
  };


  /**
   * Returns whether or not the target element is a child of root.
   * @param {Element} target The target element to check.
   * @return {boolean} True if the target element is a child of root.
   * @private
   */
  IntersectionObserver.prototype._rootContainsTarget = function(target) {
    var rootDoc =
      (this.root && (this.root.ownerDocument || this.root)) || document;
    return (
      containsDeep(rootDoc, target) &&
      (!this.root || rootDoc == target.ownerDocument)
    );
  };


  /**
   * Adds the instance to the global IntersectionObserver registry if it isn't
   * already present.
   * @private
   */
  IntersectionObserver.prototype._registerInstance = function() {
    if (registry.indexOf(this) < 0) {
      registry.push(this);
    }
  };


  /**
   * Removes the instance from the global IntersectionObserver registry.
   * @private
   */
  IntersectionObserver.prototype._unregisterInstance = function() {
    var index = registry.indexOf(this);
    if (index != -1) registry.splice(index, 1);
  };


  /**
   * Returns the result of the performance.now() method or null in browsers
   * that don't support the API.
   * @return {number} The elapsed time since the page was requested.
   */
  function now() {
    return window.performance && performance.now && performance.now();
  }


  /**
   * Throttles a function and delays its execution, so it's only called at most
   * once within a given time period.
   * @param {Function} fn The function to throttle.
   * @param {number} timeout The amount of time that must pass before the
   *     function can be called again.
   * @return {Function} The throttled function.
   */
  function throttle(fn, timeout) {
    var timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(function() {
          fn();
          timer = null;
        }, timeout);
      }
    };
  }


  /**
   * Adds an event handler to a DOM node ensuring cross-browser compatibility.
   * @param {Node} node The DOM node to add the event handler to.
   * @param {string} event The event name.
   * @param {Function} fn The event handler to add.
   * @param {boolean} opt_useCapture Optionally adds the even to the capture
   *     phase. Note: this only works in modern browsers.
   */
  function addEvent(node, event, fn, opt_useCapture) {
    if (typeof node.addEventListener == 'function') {
      node.addEventListener(event, fn, opt_useCapture || false);
    }
    else if (typeof node.attachEvent == 'function') {
      node.attachEvent('on' + event, fn);
    }
  }


  /**
   * Removes a previously added event handler from a DOM node.
   * @param {Node} node The DOM node to remove the event handler from.
   * @param {string} event The event name.
   * @param {Function} fn The event handler to remove.
   * @param {boolean} opt_useCapture If the event handler was added with this
   *     flag set to true, it should be set to true here in order to remove it.
   */
  function removeEvent(node, event, fn, opt_useCapture) {
    if (typeof node.removeEventListener == 'function') {
      node.removeEventListener(event, fn, opt_useCapture || false);
    }
    else if (typeof node.detatchEvent == 'function') {
      node.detatchEvent('on' + event, fn);
    }
  }


  /**
   * Returns the intersection between two rect objects.
   * @param {Object} rect1 The first rect.
   * @param {Object} rect2 The second rect.
   * @return {?Object|?ClientRect} The intersection rect or undefined if no
   *     intersection is found.
   */
  function computeRectIntersection(rect1, rect2) {
    var top = Math.max(rect1.top, rect2.top);
    var bottom = Math.min(rect1.bottom, rect2.bottom);
    var left = Math.max(rect1.left, rect2.left);
    var right = Math.min(rect1.right, rect2.right);
    var width = right - left;
    var height = bottom - top;

    return (width >= 0 && height >= 0) && {
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      width: width,
      height: height
    } || null;
  }


  /**
   * Shims the native getBoundingClientRect for compatibility with older IE.
   * @param {Element} el The element whose bounding rect to get.
   * @return {DOMRect|ClientRect} The (possibly shimmed) rect of the element.
   */
  function getBoundingClientRect(el) {
    var rect;

    try {
      rect = el.getBoundingClientRect();
    } catch (err) {
      // Ignore Windows 7 IE11 "Unspecified error"
      // https://github.com/w3c/IntersectionObserver/pull/205
    }

    if (!rect) return getEmptyRect();

    // Older IE
    if (!(rect.width && rect.height)) {
      rect = {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      };
    }
    return rect;
  }


  /**
   * Returns an empty rect object. An empty rect is returned when an element
   * is not in the DOM.
   * @return {ClientRect} The empty rect.
   */
  function getEmptyRect() {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0
    };
  }


  /**
   * Ensure that the result has all of the necessary fields of the DOMRect.
   * Specifically this ensures that `x` and `y` fields are set.
   *
   * @param {?DOMRect|?ClientRect} rect
   * @return {?DOMRect}
   */
  function ensureDOMRect(rect) {
    // A `DOMRect` object has `x` and `y` fields.
    if (!rect || 'x' in rect) {
      return rect;
    }
    // A IE's `ClientRect` type does not have `x` and `y`. The same is the case
    // for internally calculated Rect objects. For the purposes of
    // `IntersectionObserver`, it's sufficient to simply mirror `left` and `top`
    // for these fields.
    return {
      top: rect.top,
      y: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      x: rect.left,
      right: rect.right,
      width: rect.width,
      height: rect.height
    };
  }


  /**
   * Inverts the intersection and bounding rect from the parent (frame) BCR to
   * the local BCR space.
   * @param {DOMRect|ClientRect} parentBoundingRect The parent's bound client rect.
   * @param {DOMRect|ClientRect} parentIntersectionRect The parent's own intersection rect.
   * @return {ClientRect} The local root bounding rect for the parent's children.
   */
  function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
    var top = parentIntersectionRect.top - parentBoundingRect.top;
    var left = parentIntersectionRect.left - parentBoundingRect.left;
    return {
      top: top,
      left: left,
      height: parentIntersectionRect.height,
      width: parentIntersectionRect.width,
      bottom: top + parentIntersectionRect.height,
      right: left + parentIntersectionRect.width
    };
  }


  /**
   * Checks to see if a parent element contains a child element (including inside
   * shadow DOM).
   * @param {Node} parent The parent element.
   * @param {Node} child The child element.
   * @return {boolean} True if the parent node contains the child node.
   */
  function containsDeep(parent, child) {
    var node = child;
    while (node) {
      if (node == parent) return true;

      node = getParentNode(node);
    }
    return false;
  }


  /**
   * Gets the parent node of an element or its host element if the parent node
   * is a shadow root.
   * @param {Node} node The node whose parent to get.
   * @return {Node|null} The parent node or null if no parent exists.
   */
  function getParentNode(node) {
    var parent = node.parentNode;

    if (node.nodeType == /* DOCUMENT */ 9 && node != document) {
      // If this node is a document node, look for the embedding frame.
      return getFrameElement(node);
    }

    // If the parent has element that is assigned through shadow root slot
    if (parent && parent.assignedSlot) {
      parent = parent.assignedSlot.parentNode;
    }

    if (parent && parent.nodeType == 11 && parent.host) {
      // If the parent is a shadow root, return the host element.
      return parent.host;
    }

    return parent;
  }

  /**
   * Returns true if `node` is a Document.
   * @param {!Node} node
   * @returns {boolean}
   */
  function isDoc(node) {
    return node && node.nodeType === 9;
  }


  // Exposes the constructors globally.
  window.IntersectionObserver = IntersectionObserver;
  window.IntersectionObserverEntry = IntersectionObserverEntry;

  }());

  /* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */

  var smoothscroll = createCommonjsModule(function (module, exports) {
  (function () {

    // polyfill
    function polyfill() {
      // aliases
      var w = window;
      var d = document;

      // return if scroll behavior is supported and polyfill is not forced
      if (
        'scrollBehavior' in d.documentElement.style &&
        w.__forceSmoothScrollPolyfill__ !== true
      ) {
        return;
      }

      // globals
      var Element = w.HTMLElement || w.Element;
      var SCROLL_TIME = 468;

      // object gathering original scroll methods
      var original = {
        scroll: w.scroll || w.scrollTo,
        scrollBy: w.scrollBy,
        elementScroll: Element.prototype.scroll || scrollElement,
        scrollIntoView: Element.prototype.scrollIntoView
      };

      // define timing method
      var now =
        w.performance && w.performance.now
          ? w.performance.now.bind(w.performance)
          : Date.now;

      /**
       * indicates if a the current browser is made by Microsoft
       * @method isMicrosoftBrowser
       * @param {String} userAgent
       * @returns {Boolean}
       */
      function isMicrosoftBrowser(userAgent) {
        var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

        return new RegExp(userAgentPatterns.join('|')).test(userAgent);
      }

      /*
       * IE has rounding bug rounding down clientHeight and clientWidth and
       * rounding up scrollHeight and scrollWidth causing false positives
       * on hasScrollableSpace
       */
      var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

      /**
       * changes scroll position inside an element
       * @method scrollElement
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */
      function scrollElement(x, y) {
        this.scrollLeft = x;
        this.scrollTop = y;
      }

      /**
       * returns result of applying ease math function to a number
       * @method ease
       * @param {Number} k
       * @returns {Number}
       */
      function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
      }

      /**
       * indicates if a smooth behavior should be applied
       * @method shouldBailOut
       * @param {Number|Object} firstArg
       * @returns {Boolean}
       */
      function shouldBailOut(firstArg) {
        if (
          firstArg === null ||
          typeof firstArg !== 'object' ||
          firstArg.behavior === undefined ||
          firstArg.behavior === 'auto' ||
          firstArg.behavior === 'instant'
        ) {
          // first argument is not an object/null
          // or behavior is auto, instant or undefined
          return true;
        }

        if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
          // first argument is an object and behavior is smooth
          return false;
        }

        // throw error when behavior is not supported
        throw new TypeError(
          'behavior member of ScrollOptions ' +
            firstArg.behavior +
            ' is not a valid value for enumeration ScrollBehavior.'
        );
      }

      /**
       * indicates if an element has scrollable space in the provided axis
       * @method hasScrollableSpace
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function hasScrollableSpace(el, axis) {
        if (axis === 'Y') {
          return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
        }

        if (axis === 'X') {
          return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
        }
      }

      /**
       * indicates if an element has a scrollable overflow property in the axis
       * @method canOverflow
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function canOverflow(el, axis) {
        var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

        return overflowValue === 'auto' || overflowValue === 'scroll';
      }

      /**
       * indicates if an element can be scrolled in either axis
       * @method isScrollable
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function isScrollable(el) {
        var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
        var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

        return isScrollableY || isScrollableX;
      }

      /**
       * finds scrollable parent of an element
       * @method findScrollableParent
       * @param {Node} el
       * @returns {Node} el
       */
      function findScrollableParent(el) {
        while (el !== d.body && isScrollable(el) === false) {
          el = el.parentNode || el.host;
        }

        return el;
      }

      /**
       * self invoked function that, given a context, steps through scrolling
       * @method step
       * @param {Object} context
       * @returns {undefined}
       */
      function step(context) {
        var time = now();
        var value;
        var currentX;
        var currentY;
        var elapsed = (time - context.startTime) / SCROLL_TIME;

        // avoid elapsed times higher than one
        elapsed = elapsed > 1 ? 1 : elapsed;

        // apply easing to elapsed time
        value = ease(elapsed);

        currentX = context.startX + (context.x - context.startX) * value;
        currentY = context.startY + (context.y - context.startY) * value;

        context.method.call(context.scrollable, currentX, currentY);

        // scroll more if we have not reached our destination
        if (currentX !== context.x || currentY !== context.y) {
          w.requestAnimationFrame(step.bind(w, context));
        }
      }

      /**
       * scrolls window or element with a smooth behavior
       * @method smoothScroll
       * @param {Object|Node} el
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */
      function smoothScroll(el, x, y) {
        var scrollable;
        var startX;
        var startY;
        var method;
        var startTime = now();

        // define scroll context
        if (el === d.body) {
          scrollable = w;
          startX = w.scrollX || w.pageXOffset;
          startY = w.scrollY || w.pageYOffset;
          method = original.scroll;
        } else {
          scrollable = el;
          startX = el.scrollLeft;
          startY = el.scrollTop;
          method = scrollElement;
        }

        // scroll looping over a frame
        step({
          scrollable: scrollable,
          method: method,
          startTime: startTime,
          startX: startX,
          startY: startY,
          x: x,
          y: y
        });
      }

      // ORIGINAL METHODS OVERRIDES
      // w.scroll and w.scrollTo
      w.scroll = w.scrollTo = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scroll.call(
            w,
            arguments[0].left !== undefined
              ? arguments[0].left
              : typeof arguments[0] !== 'object'
                ? arguments[0]
                : w.scrollX || w.pageXOffset,
            // use top prop, second argument if present or fallback to scrollY
            arguments[0].top !== undefined
              ? arguments[0].top
              : arguments[1] !== undefined
                ? arguments[1]
                : w.scrollY || w.pageYOffset
          );

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(
          w,
          d.body,
          arguments[0].left !== undefined
            ? ~~arguments[0].left
            : w.scrollX || w.pageXOffset,
          arguments[0].top !== undefined
            ? ~~arguments[0].top
            : w.scrollY || w.pageYOffset
        );
      };

      // w.scrollBy
      w.scrollBy = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0])) {
          original.scrollBy.call(
            w,
            arguments[0].left !== undefined
              ? arguments[0].left
              : typeof arguments[0] !== 'object' ? arguments[0] : 0,
            arguments[0].top !== undefined
              ? arguments[0].top
              : arguments[1] !== undefined ? arguments[1] : 0
          );

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(
          w,
          d.body,
          ~~arguments[0].left + (w.scrollX || w.pageXOffset),
          ~~arguments[0].top + (w.scrollY || w.pageYOffset)
        );
      };

      // Element.prototype.scroll and Element.prototype.scrollTo
      Element.prototype.scroll = Element.prototype.scrollTo = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          // if one number is passed, throw error to match Firefox implementation
          if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
            throw new SyntaxError('Value could not be converted');
          }

          original.elementScroll.call(
            this,
            // use left prop, first number argument or fallback to scrollLeft
            arguments[0].left !== undefined
              ? ~~arguments[0].left
              : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
            // use top prop, second argument or fallback to scrollTop
            arguments[0].top !== undefined
              ? ~~arguments[0].top
              : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
          );

          return;
        }

        var left = arguments[0].left;
        var top = arguments[0].top;

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(
          this,
          this,
          typeof left === 'undefined' ? this.scrollLeft : ~~left,
          typeof top === 'undefined' ? this.scrollTop : ~~top
        );
      };

      // Element.prototype.scrollBy
      Element.prototype.scrollBy = function() {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.elementScroll.call(
            this,
            arguments[0].left !== undefined
              ? ~~arguments[0].left + this.scrollLeft
              : ~~arguments[0] + this.scrollLeft,
            arguments[0].top !== undefined
              ? ~~arguments[0].top + this.scrollTop
              : ~~arguments[1] + this.scrollTop
          );

          return;
        }

        this.scroll({
          left: ~~arguments[0].left + this.scrollLeft,
          top: ~~arguments[0].top + this.scrollTop,
          behavior: arguments[0].behavior
        });
      };

      // Element.prototype.scrollIntoView
      Element.prototype.scrollIntoView = function() {
        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scrollIntoView.call(
            this,
            arguments[0] === undefined ? true : arguments[0]
          );

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        var scrollableParent = findScrollableParent(this);
        var parentRects = scrollableParent.getBoundingClientRect();
        var clientRects = this.getBoundingClientRect();

        if (scrollableParent !== d.body) {
          // reveal element inside parent
          smoothScroll.call(
            this,
            scrollableParent,
            scrollableParent.scrollLeft + clientRects.left - parentRects.left,
            scrollableParent.scrollTop + clientRects.top - parentRects.top
          );

          // reveal parent in viewport unless is fixed
          if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
            w.scrollBy({
              left: parentRects.left,
              top: parentRects.top,
              behavior: 'smooth'
            });
          }
        } else {
          // reveal element in viewport
          w.scrollBy({
            left: clientRects.left,
            top: clientRects.top,
            behavior: 'smooth'
          });
        }
      };
    }

    {
      // commonjs
      module.exports = { polyfill: polyfill };
    }

  }());
  });

  // required to activate smoothscroll polyfill
  smoothscroll.polyfill();

})));
