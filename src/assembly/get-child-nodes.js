import isArray from 'lodash-es/isArray';
import { isChild } from '../conditions';
import { VirtualText } from '../virtual-node';
import { UnexpectedVirtualElement } from '../validation';

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
    } else {
        // throw UnexpectedVirtualElement({
        //     foreignObject: child,
        //     parentVnode: {
        //         tagName: tag,
        //         properties: props
        //     }
        // });
    }
    return tempChildNodes;
}

export default getChildNodes;