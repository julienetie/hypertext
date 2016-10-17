// var root = typeof window !== 'undefined' ?
//     window : typeof global !== 'undefined' ?
//     global : {};

// function Individual(key, value) {
//     if (key in root) {
//     	// console.log('key in root', root[key])
//         return root[key];
//     }

//     root[key] = value;
// // console.log('root', root[key])
//     return value;
// }

// function OneVersion(moduleName, version, defaultValue) {
//     var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
//     var enforceKey = key + '_ENFORCE_SINGLETON';

//     var versionValue = Individual(enforceKey, version);

//     if (versionValue !== version) {
//         throw new Error('Can only have one copy of ' +
//             moduleName + '.\n' +
//             'You already have version ' + versionValue +
//             ' installed.\n' +
//             'This means you cannot install version ' + version);
//     }

//     return Individual(key, defaultValue);
// }



// var MY_VERSION = '7';
// OneVersion('ev-store', MY_VERSION);

// var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

// export function EvStore(elem) {
//     var hash = elem[hashKey];

//     if (!hash) {
//         hash = elem[hashKey] = {};
//     }
//     // console.log(hash)
//     return hash;
// }


// export function eventHook(value) {
//     if (!(this instanceof eventHook)) {
//         return new eventHook(value);
//     }
//     this.value = value;
// }


// eventHook.prototype.hook = function(node, propertyName) {
//     // console.log('node',node)
//     var es = EvStore(node);
//     // console.log('es',es)
//     var propName = propertyName.substr(3);

//     es[propName] = this.value;
//     // console.log(propName, es[propName])
// };


// eventHook.prototype.unhook = function(node, propertyName) {
//     var es = EvStore(node);
//     var propName = propertyName.substr(3);

//     es[propName] = undefined;
// };


// export function SoftSetHook(value) {
//     if (!(this instanceof SoftSetHook)) {
//         return new SoftSetHook(value);
//     }

//     this.value = value;
// }


// SoftSetHook.prototype.hook = function(node, propertyName) {
//     if (node[propertyName] !== this.value) {
//         node[propertyName] = this.value;
//     }
// };