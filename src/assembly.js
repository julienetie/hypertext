import { SoftSetHook, eventHook } from './ev-store';
import isPlainObject from '../node_modules/lodash-es/isPlainObject';
import isArray from '../node_modules/lodash-es/isArray';
import isEmpty from '../node_modules/lodash-es/isEmpty';
import { VirtualNode, VirtualText } from './virtual-node';
import version from './version';
import { UnexpectedVirtualElement, UnsupportedValueType, errorString } from './validation';
import {
    isThunk,
    isVirtualText,
    isChild,
    isHook,
    isVirtualNode,
    isWidget
} from './conditions';


const transformProperties = (props) => {

    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];
            if (isHook(value)) {
                continue;
            }
            if (propName.substr(0, 3) === 'ev-') {
                props[propName] = eventHook(value);
            }
        }
    }
}

const assembly = (tagName) => {

    return function(...args) {
        let childNodes = [];
        let children = [];
        let props;
        let key;
        let namespace;
        let item;
        let i;

        for (i = 0; i < args.length; i++) {
            item = args[i];

            //Check if text node
            if (typeof item === 'string' || typeof item === 'number') {
                children.push(item);
            } else if (item.hasOwnProperty('descendantHooks')) {
                children.push(item);
            } else if (isPlainObject(item)) {
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
        if (!isEmpty(props)) {
            transformProperties(props);
        }

        addChild(children, childNodes, tagName, props);
        return new VirtualNode(tagName, props, childNodes, key, namespace);
    };
}

    

const addChild = (child, childNodes, tag, props) => {

    if (typeof child === 'string' || typeof child === 'number') {
        childNodes.push(new VirtualText(child));
    } else if (isChild(child)) {
        childNodes.push(child);
    } else if (isArray(child)) {
        for (var i = 0; i < child.length; i++) {
            addChild(child[i], childNodes, tag, props);
        }
    } else if (child === null || child === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: child,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

export default assembly;