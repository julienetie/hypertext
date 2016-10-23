import {isVirtualText, isVirtualNode, isWidget } from '../utilities/conditions';
import storeEventTarget from '../events/store-event-target';
import applyProperties from './apply-properties';

export default function createNodes(virtualNode, opts) {
    const warn = opts ? opts.warn : null;
    let vnode = virtualNode;
    let virtualNodeEvent = virtualNode.event;
    let children;
    let childNode;
    let node;

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
        if(virtualNodeEvent){
            storeEventTarget(node, virtualNodeEvent);
        }
    } else {
        node = document.createElementNS(vnode.namespace, vnode.tagName);
    }

    applyProperties(node, vnode.properties);

    children = vnode.children;
    let childrenLength = children.length;

    for (let i = 0; i < childrenLength; i++) {
        childNode = createNodes(children[i], opts);
        if (childNode) {
            node.appendChild(childNode);
        }
    }

    return node;
}