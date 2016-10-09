(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' + moduleName + '.\n' + 'You already have version ' + versionValue + ' installed.\n' + 'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

var MY_VERSION = '7';
OneVersion('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

function evHook(value) {
    if (!(this instanceof evHook)) {
        return new evHook(value);
    }
    this.value = value;
}

evHook.prototype.hook = function (node, propertyName) {
    console.log('node', node);
    var es = EvStore(node);
    console.log('es', es);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

evHook.prototype.unhook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

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

var getPrototype = overArg(Object.getPrototypeOf, Object);

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
  return value != null && typeof value == 'object';
}

var objectTag = '[object Object]';

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

const version$2 = 2;

function VirtualText(text) {
	this.text = String(text);
}

let isVirtualText = x => {
	return x && x.type === "VirtualText" && x.version === version$2;
};

function isThunk(t) {
	return t && t.type === "Thunk";
}

const isHook = hook => {
	return hook && (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") || typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
};

const isVirtualNode = x => {
	return x && x.type === "VirtualNode" && x.version === version$2;
};

const isWidget = w => {
	return w && w.type === "Widget";
};



// export const isArray = (obj) => {
// 	return toString.call(obj) === "[object Array]"
// }


const isChild = x => {
	return isVirtualNode(x) || isVirtualText(x) || isWidget(x) || isThunk(x);
};

var version$1 = 2;

var noProperties = {};
var noChildren = [];

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName;
    this.properties = properties || noProperties;
    this.children = children || noChildren;
    this.key = key != null ? String(key) : undefined;
    this.namespace = typeof namespace === "string" ? namespace : null;

    var count = children && children.length || 0;
    var descendants = 0;
    var hasWidgets = false;
    var hasThunks = false;
    var descendantHooks = false;
    var hooks;

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName];
            if (isHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {};
                }

                hooks[propName] = property;
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i];
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
}

VirtualNode.prototype.version = version$1;
VirtualNode.prototype.type = "VirtualNode";
VirtualText.prototype.version = version$1;
VirtualText.prototype.type = "VirtualText";

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' + 'Expected a VNode / Vthunk / VWidget / string but:\n' + 'got:\n' + errorString(data.foreignObject) + '.\n' + 'The parent vnode is:\n' + errorString(data.parentVnode);
    '\n' + 'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function UnsupportedValueType(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unsupported.value-type';
    err.message = 'Unexpected value type for input passed to h().\n' + 'Expected a ' + errorString(data.expected) + ' but got:\n' + errorString(data.received) + '.\n' + 'The vnode is:\n' + errorString(data.Vnode);
    '\n' + 'Suggested fix: Cast the value passed to h() to a string using String(value).';
    err.Vnode = data.Vnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

function assembly(tagName) {

    return function (...args) {
        var childNodes = [];
        var children = [];
        var tag, props, key, namespace;
        var item;

        for (let i = 0; i < args.length; i++) {
            item = args[i];

            //Check if text node
            if (typeof item === 'string') {
                children.push(item);
            } else if (item.hasOwnProperty('descendantHooks')) {
                children.push(item);
            } else if (item.constructor === {}.constructor) {
                props = item;
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

        // fix cursor bug
        if (tagName === 'INPUT' && !namespace && props.hasOwnProperty('value') && props.value !== undefined && !isHook(props.value)) {
            if (props.value !== null && typeof props.value !== 'string') {
                throw UnsupportedValueType({
                    expected: 'String',
                    received: typeof props.value,
                    Vnode: {
                        tagName: tagName,
                        properties: props
                    }
                });
            }
            props.value = softSetHook(props.value);
        }

        transformProperties(props);

        if (children !== undefined && children !== null) {
            addChild(children, childNodes, tagName, props);
        }

        props.isProp = true;

        return new VirtualNode(tagName, props, childNodes, key, namespace);
    };
}

function addChild(c, childNodes, tag, props) {

    if (typeof c === 'string') {
        childNodes.push(new VirtualText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VirtualText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray$1(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function handleThunk(a, b) {
    var renderedA = a;
    var renderedB = b;

    if (isThunk(b)) {
        renderedB = renderThunk(b, a);
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null);
    }

    return {
        a: renderedA,
        b: renderedB
    };
}

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName];

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous);
            if (propValue.hook) {
                propValue.hook(node, propName, previous ? previous[propName] : undefined);
            }
        } else {
            if (isPlainObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue;
            }
        }
    }
}

function create$1(vnode, opts) {
    var doc = opts ? opts.document || document : document;
    var warn = opts ? opts.warn : null;

    vnode = handleThunk(vnode).a;

    if (isWidget(vnode)) {
        return vnode.init();
    } else if (isVirtualText(vnode)) {
        return doc.createTextNode(vnode.text);
    } else if (!isVirtualNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode);
        }
        return null;
    }

    var node = vnode.namespace === null ? doc.createElement(vnode.tagName) : doc.createElementNS(vnode.namespace, vnode.tagName);

    var props = vnode.properties;
    applyProperties(node, props);

    var children = vnode.children;

    for (var i = 0; i < children.length; i++) {
        var childNode = create$1(children[i], opts);
        if (childNode) {
            node.appendChild(childNode);
        }
    }

    return node;
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined;

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName];

            if (attrValue === undefined) {
                node.removeAttribute(attrName);
            } else {
                node.setAttribute(attrName, attrValue);
            }
        }

        return;
    }

    if (previousValue && isPlainObject(previousValue) && getPrototype$2(previousValue) !== getPrototype$2(propValue)) {
        node[propName] = propValue;
        return;
    }

    if (!isPlainObject(node[propName])) {
        node[propName] = {};
    }

    var replacer = propName === "style" ? "" : undefined;

    for (var k in propValue) {
        var value = propValue[k];
        node[propName][k] = value === undefined ? replacer : value;
    }
}
function removeProperty(node, propName, propValue, previous) {
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
}

function getPrototype$2(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value);
    } else if (value.__proto__) {
        return value.__proto__;
    } else if (value.constructor) {
        return value.constructor.prototype;
    }
}

const a = assembly('a');



const article = assembly('article');
const aside = assembly('aside');



















const div = assembly('div');






const figcaption = assembly('figcaption');
const figure = assembly('figure');
const footer = assembly('footer');

const h1 = assembly('h1');
const h2 = assembly('h2');




const header = assembly('header');





const img = assembly('img');






const li = assembly('li');


const mark = assembly('mark');


const nav = assembly('nav');
















const section = assembly('section');

















const ul = assembly('ul');



// API
const createNodes = create$1;

var image = {
    src: 'https://www.google.co.uk/logos/doodles/2016/100th-anniversary-of-completion-of-the-trans-siberian-railway-6269398706814976-vacta.gif',
    width: 85,
    height: 85,
    alt: 'Jennifer Marsman'
};

var articleSection2 = 'This is the second article. These articles could be blog posts, etc.';
var article1Header = 'Article #1h1';
// Data


/// HTML 1
var html1 = div(header({ class: 'red', 'data-hello': 'World!', style: { 'background': '#2f2', border: '2px dashed blue' } }, h1('Header in h1'), h2('Subheader in h2')), nav(ul(li(a({ href: 'http://google.com', class: 'some-class' }, 'Menu Option 1a')), li(a({ href: 'http://facebook.com', class: 'some-class' }, 'Menu Option 2a')), li(a({ href: 'http://youtube.com' }, 'Menu Option 3a')))), section(article(header({ id: 'juliensHeader' }, h1(article1Header)), section('This is the first article. This is', mark('highlightedmark'), '.')), article(header(h1('Article #2h1')), section({ id: 'whatsUpJack' }, articleSection2))), aside(section(h1('THIS EVENT', { 'ev-click': e => {
        alert('yayayaaa');
    } }), ul(li(a({ href: '#' }, 'Link 1a')), li(a({ href: '#' }, 'Link 2a')), li(a({ href: '#' }, 'Link 3a')))), figure(img({ src: image.src, width: image.width, height: image.height, alt: image.alt }), figcaption('Jennifer Marsman'))), footer('Footer - Copyright 2016'));

/// HTML 2
var html2 = div(header({ class: 'red', 'data-hello': 'World!', style: { 'background': 'pink' } }, h1('Header in h1'), h2('Subheader in h2')), nav(ul(li(a({ href: 'http://google.com', class: 'some-class' }, 'Menu Option 1a')), h1('WHAT THIS IS NOT THE SAMMEEEE'), li(a({ href: 'http://youtube.com' }, 'Menu Option 3a')))), section(article(header({ id: 'juliensHeader' }, h1('BLALALALALALALALA')), section('This is the first article. This is', mark('highlightedmark'), '.')), article(header(h1('Article #2h1')), section({ id: 'whatsUpJack' }, articleSection2))), aside(section(h1('Linksh1'), ul(li(a({ href: '#' }, 'Link 1a')), li(a({ href: '#' }, 'Link 2a')), li(a({ href: '#' }, 'Link 3a')))), figure(img({ src: 'https://avatars0.githubusercontent.com/u/7676299?v=3&s=466', width: image.width, height: image.height, alt: image.alt }), figcaption('ergergergerg'))), footer('FOOOOOOOOOOOOOOOOO'));

// Render page intially 
var el = createNodes(html1);
document.body.appendChild(el);

//Make changes

// setTimeout(function() {  
//   var patches = diff(html1, html2);
//   patch(el, patches)
// }, 2000)


// setTimeout(function() {

//   var patches = diff(html2, html1);
//   patch(el, patches)
// }, 4000)

})));