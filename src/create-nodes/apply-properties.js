import {isHook, isVirtualNode, isWidget } from '../utilities/conditions';
import removeProperty from './remove-property';
import isPlainObject from 'lodash-es/isPlainObject';
import patchObject from './patch-object';

const applyProperties = (node, props, previous) => {
    let propName;
    let propValue;
    let isPropHook;

    for (propName in props) {
        propValue = props[propName];
        isPropHook = isHook(propValue);

        if (propValue === undefined || isPropHook) {
            removeProperty(node, propName, propValue, previous);
        } 

        if (isPropHook) {
            if (propValue.hook) {
                propValue.hook(
                    node,
                    propName,
                    previous ? previous[propName] : undefined
                    );
            }
        } else {
            if (isPlainObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                propName = propName === 'class' ? 'className' : propName;
                node[propName] = propValue;
            }
        }
    }
}

export default applyProperties;