import {isVirtualText, isVirtualNode, isWidget } from '../utilities/conditions';
import storeEventTarget from '../events/store-event-target';
import applyProperties from './apply-properties';

export default function createNodes(virtualNode, opts) {
    const doc = opts ? opts.document || document : document;
    const warn = opts ? opts.warn : null;
    let i;
    let node;
    let children;
    let childNode;
    let vnode = virtualNode;
    let virtualNodeEvent = virtualNode.event;

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
        if(virtualNodeEvent){
            storeEventTarget(node, virtualNodeEvent);
        }
    } else {
        node = doc.createElementNS(vnode.namespace, vnode.tagName);
    }

    applyProperties(node, vnode.properties);

    children = vnode.children;

    for (i = 0; i < children.length; i++) {
        childNode = createNodes(children[i], opts);
        if (childNode) {
            node.appendChild(childNode);
        }
    }

    return node;
}