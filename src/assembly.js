import { SoftSetHook, evHook } from './ev-store';
import isPlainObject from '../node_modules/lodash-es/isPlainObject';
import isArray from '../node_modules/lodash-es/isArray';
import VirtualNode from './virtual-node';
import {UnexpectedVirtualElement, UnsupportedValueType, errorString} from './validation';
import { 
    isThunk, 
    isVirtualText,
    VirtualText, 
    isChild,
    isHook, 
    isVirtualNode, 
    isWidget 
} from './conditions';

var version = 2;


export default function assembly(tagName) {

    return function(...args) {
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
                item.forEach(function(child) {
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
        if (tagName === 'INPUT' &&
            !namespace &&
            props.hasOwnProperty('value') &&
            props.value !== undefined &&
            !isHook(props.value)
        ) {
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
    } else if (isArray(c)) {
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