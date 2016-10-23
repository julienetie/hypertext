export default function applyStyles(node, propName, propValue) {
    let propertyName = propName;
    let value;
        for (let stylePropName in propValue) {
            value = propValue[stylePropName];
            node[propName][stylePropName] = value || value + '';
        }
}