import isPlainObject from '../node_modules/lodash-es/isPlainObject';
import { isThunk, isVirtualText, isVirtualNode, isHook, isWidget } from './conditions';
import version from './version';


const handleThunk = (a, b) => {
    return {
        a: isThunk(a) ? renderThunk(a, null) : a,
        b: isThunk(b) ? renderThunk(b, a) : b
    }
}


const applyProperties = (node, props, previous) => {
    let propName;
    let propValue;

    for (propName in props) {
        propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isPlainObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

export default function create(virtualNode, opts) {
    const doc = opts ? opts.document || document : document;
    const warn = opts ? opts.warn : null;
    let i;
    let node;
    let children;
    let childNode;
    let vnode = virtualNode;

    vnode = handleThunk(virtualNode).a;

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

    if (vnode.namespace === null) {
        node = doc.createElement(vnode.tagName);
    } else {
        node = doc.createElementNS(vnode.namespace, vnode.tagName);
    }

    applyProperties(node, vnode.properties);

    children = vnode.children;

    for (i = 0; i < children.length; i++) {
        childNode = create(children[i], opts);
        if (childNode) {
            node.appendChild(childNode);
        }
    }

    return node;
}


const patchObject = (node, props, previous, propName, propValue) => {
    let previousValue = previous ? previous[propName] : undefined;
    let attrValue;
    let attrName;
    let replacer;
    let k;
    let value;

    // Set attributes
    if (propName === "attributes") {

        for (attrName in propValue) {
            attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return;
    }


    // TODO, check how style is being handled.

    // console.log(node, propName, propValue)
    //  if (previousValue && isPlainObject(previousValue) &&
    //      getPrototype(previousValue) !== getPrototype(propValue)) {
    //      console.log(node, popName, propValue)
    //      node[propName] = propValue;
    //      return;
    //  }

    if (!isPlainObject(node[propName])) {
        node[propName] = {};
    }

    replacer = propName === "style" ? "" : undefined

    for (k in propValue) {
        value = propValue[k];
        node[propName][k] = (value === undefined) ? replacer : value;
    }
}


const removeProperty = (node, propName, propValue, previous) => {
    if (previous) {
        const previousValue = previous[propName]

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
