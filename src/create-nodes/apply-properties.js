import {isHook, isVirtualNode, isWidget } from '../utilities/conditions';
import removeProperty from './remove-property';
import isPlainObject from 'lodash-es/isPlainObject';
import applyStyles from './apply-styles';

function applyProperties(node, props) {
    let propValue;
    for (let propName in props) {

        propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue)
            if (propValue.hook) {
                propValue.hook(node,propName)
            }
        } else {
        
            if(isPlainObject(propValue)){
                applyStyles(node, propName, propValue); // Property is a style.
            }else{
                // If property is a an attribute.
                switch(propName){
                    case 'class':
                    propName = 'className';
                    break;
                }
                node[propName] = propValue;
            }
        }
    }
}

export default applyProperties;