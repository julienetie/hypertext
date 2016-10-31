import isPlainObject from '../../libs/isPlainObject';
import isArray from '../../libs/isArray';
import isEmpty from '../../libs/isEmpty';
import { VirtualNode } from './virtual-node';
import version from '../version';
import { isHook } from '../utilities/conditions'
import getChildNodes from './get-child-nodes';

var eventStore = [];

const assembly = (tagName) => {
    const tagNameUppercase = tagName.toUpperCase();
    return function(...args) {
        let childNodes = [];
        let children = [];
        let props;
        let key;
        let namespace;
        let item;
        let i;
        let allChildNodes;
        let event = false;

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
            if (isArray(item)) {
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

        allChildNodes = getChildNodes(children, childNodes);

        return new VirtualNode(
            tagNameUppercase,
            props,
            allChildNodes,
            key,
            namespace,
            event
        );
    };
}

export default assembly;