import isPlainObject from 'lodash-es/isPlainObject';

const patchObject = (node, props, previous, propName, propValue) => {
    let previousValue = previous ? previous[propName] : undefined;
    let attrValue;
    let attrName;
    let replacer;
    let k;
    let value;

    // Set attributes
    if (propName === "attributes") {

        for (attrName in propValue) {
            attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return;
    }

    if (!isPlainObject(node[propName])) {
        node[propName] = {};
    }

    replacer = propName === "style" ? "" : undefined

    for (k in propValue) {
        value = propValue[k];
        node[propName][k] = (value === undefined) ? replacer : value;
    }
}

export default patchObject;