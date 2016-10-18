// import { SoftSetHook } from '../ev-store';
import isPlainObject from 'lodash-es/isPlainObject';
import isEmpty  from 'lodash-es/isEmpty';
import { VirtualNode } from '../virtual-node';
import version from '../version';
import { UnsupportedValueType } from '../validation';
import { isHook } from '../conditions';
// import transformProperties from './transform-properties';
import getChildNodes from './get-child-nodes';

var eventStore = [];

export default (tagName) => {

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
            } else if (item !== null && item.hasOwnProperty('descendantHooks')) {
                children.push(item);

            // Check if item is a properties object.
            } else if (isPlainObject(item)) {

                // Check if it has the event property.
                if(item.hasOwnProperty('event')){
                    event = item.event;
                    delete item.event;
                }

                // Check if properties is not empty.
                if(!isEmpty(item)){
                    props = item;     console.log(item)        
                }

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
            // props.value = softSetHook(props.value);
        }
        // if (!isEmpty(props)) {
        //     transformProperties(props);
        // }

        allChildNodes = getChildNodes(children, childNodes);

        return new VirtualNode(tagName, props, allChildNodes, key, namespace, event);
    };
}