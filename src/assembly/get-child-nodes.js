import isArray from '../../libs/isArray';
import { isChild } from '../utilities/conditions';
import { VirtualText } from './virtual-node';

const getChildNodes = (child, childNodes) => {
    let tempChildNodes = Array.from(childNodes);

    if (typeof child === 'string' || typeof child === 'number') {
        tempChildNodes.push(new VirtualText(child));
    } else if (isChild(child)) {
        tempChildNodes.push(child);
    } else if (isArray(child)) {
        let childLength = child.length;
        for (let i = 0; i < childLength; i++) {
           tempChildNodes.push(getChildNodes(child[i], childNodes)[0]); 
        }
    }
    return tempChildNodes;
}

export default getChildNodes;

