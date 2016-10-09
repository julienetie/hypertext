import split from './split';
import EvStore from './ev-store';


var version = 2;


var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
// var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    // module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4']; //= minDoc;
    }

    // module.exports = doccy;
}















// /*global window, global*/

// var root = typeof window !== 'undefined' ?
//     window : typeof global !== 'undefined' ?
//     global : {};


// function Individual(key, value) {
//     if (key in root) {
//         return root[key];
//     }

//     root[key] = value;

//     return value;
// }
















// function OneVersion(moduleName, version, defaultValue) {
//                 console.log(moduleName, version, defaultValue)
//     var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
//     var enforceKey = key + '_ENFORCE_SINGLETON';
//                       console.log('enf',enforceKey, 'versioin',version)
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







 function isObject(x) {
    return typeof x === "object" && x !== null;
};










function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}









function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}










function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}








function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}


function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVirtualText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVirtualNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}









var noChild = {}












function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}










function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}












// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}







function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}







function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}









function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}








function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}









function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}









function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}








function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}









function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}








function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}




function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}









// function patchRecursive(rootNode, patches, renderOptions) {
//     var indices = patchIndices(patches)

//     if (indices.length === 0) {
//         return rootNode
//     }

//     var index = domIndex(rootNode, patches.a, indices)
//     var ownerDocument = rootNode.ownerDocument

//     if (!renderOptions.document && ownerDocument !== document) {
//         renderOptions.document = ownerDocument
//     }

//     for (var i = 0; i < indices.length; i++) {
//         var nodeIndex = indices[i]
//         rootNode = applyPatch(rootNode,
//             index[nodeIndex],
//             patches[nodeIndex],
//             renderOptions)
//     }

//     return rootNode
// }






// function applyPatch(rootNode, domNode, patchList, renderOptions) {
//     if (!domNode) {
//         return rootNode
//     }

//     var newNode

//     if (isArray(patchList)) {
//         for (var i = 0; i < patchList.length; i++) {
//             newNode = patchOp(patchList[i], domNode, renderOptions)

//             if (domNode === rootNode) {
//                 rootNode = newNode
//             }
//         }
//     } else {
//         newNode = patchOp(patchList, domNode, renderOptions)

//         if (domNode === rootNode) {
//             rootNode = newNode
//         }
//     }

//     return rootNode
// }








// function patchIndices(patches) {
//     var indices = []

//     for (var key in patches) {
//         if (key !== "a") {
//             indices.push(Number(key))
//         }
//     }

//     return indices
// }








function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}







function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}







// function renderThunk(thunk, previous) {
//     var renderedThunk = thunk.vnode

//     if (!renderedThunk) {
//         renderedThunk = thunk.vnode = thunk.render(previous)
//     }

//     if (!(isVirtualNode(renderedThunk) ||
//             isVirtualText(renderedThunk) ||
//             isWidget(renderedThunk))) {
//         throw new Error("thunk did not return a valid node");
//     }

//     return renderedThunk
// }








function isThunk(t) {
    return t && t.type === "Thunk"
}







function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}








function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}









function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}






function isWidget(w) {
    return w && w.type === "Widget"
}

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"


VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8










function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}









function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}














function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}









function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VirtualPatch(VPatch.REMOVE, a, b))
    } else if (isVirtualNode(b)) {
        if (isVirtualNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VirtualPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VirtualPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VirtualPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVirtualText(b)) {
        if (!isVirtualText(a)) {
            apply = appendPatch(apply, new VirtualPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VirtualPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VirtualPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}







function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VirtualPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVirtualNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VirtualPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}








function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}









// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VirtualPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVirtualNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVirtualNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}








// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VirtualPatch(VPatch.THUNK, null, thunkPatch)
    }
}









function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}










// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVirtualNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VirtualPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVirtualNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}








function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}












// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}














function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}















function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}











function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}







function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}






function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}







EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};









EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};







function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}








SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};





function assembly(tagName){

    return function(...args) {
        var childNodes = [];
        var children = [];
        var tag, props, key, namespace;
        var item;
          
            for (let i = 0; i < args.length; i++) {
                item = args[i];

                //Check if text node
                if (typeof item === 'string') {
                    children.push(item);
                }else if(item.hasOwnProperty('descendantHooks')){
                     children.push(item);   
                }else if(item.constructor === {}.constructor){
                    props = item;
                }
                    
                // Check if Loop of children 
                if (item instanceof Array) {
                    item.forEach(function(child){
                        children.push(child)
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

        transformProperties(props);

        if (children !== undefined && children !== null) {
            addChild(children, childNodes, tagName, props);
        }

        // console.log(tag, props, childNodes, key, namespace)
        props.isProp = true;

        return new VirtualNode(tagName, props, childNodes, key, namespace);
    }
}







function addChild(c, childNodes, tag, props) {
  console.log(isChild(c))
    if (typeof c === 'string') {
        childNodes.push(new VirtualText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VirtualText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}





function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
  console.log(isVirtualNode(x) , isVirtualText(x) , isWidget(x) , isThunk(x))
    return isVirtualNode(x) || isVirtualText(x) || isWidget(x) || isThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function UnsupportedValueType(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unsupported.value-type';
    err.message = 'Unexpected value type for input passed to h().\n' +
        'Expected a ' +
        errorString(data.expected) +
        ' but got:\n' +
        errorString(data.received) +
        '.\n' +
        'The vnode is:\n' +
        errorString(data.Vnode)
        '\n' +
        'Suggested fix: Cast the value passed to h() to a string using String(value).';
    err.Vnode = data.Vnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}







var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;









function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}


var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVirtualNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"







function VirtualText(text) {
    this.text = String(text)
}









VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"


///////////////////////////////


var a = assembly('a');
var abbr = assembly('abbr');
var address = assembly('address');
var area = assembly('area');
var article = assembly('article');
var aside = assembly('aside');
var audio = assembly('audio');
var b = assembly('b');
var base = assembly('base');
var bdi = assembly('bdi');
var bdo = assembly('bdo');
var blockquote = assembly('blockquote');
var body = assembly('body');
var br = assembly('br');
var button = assembly('button');
var canvas = assembly('canvas');
var caption = assembly('caption');
var cite = assembly('cite');
var code = assembly('code');
var col = assembly('col');
var colgroup = assembly('colgroup');
var command = assembly('command');
var dd = assembly('dd');
var del = assembly('del');
var dfn = assembly('dfn');
var div = assembly('div');
var dl = assembly('dl');
var doctype = assembly('doctype');
var dt = assembly('dt');
var em = assembly('em');
var embed = assembly('embed');
var fieldset = assembly('fieldset');
var figcaption = assembly('figcaption');
var figure = assembly('figure');
var footer = assembly('footer');
var form = assembly('form');
var h1 = assembly('h1');
var h2 = assembly('h2');
var h3 = assembly('h3');
var h4 = assembly('h4');
var h5 = assembly('h5');
var h6 = assembly('h6');
var header = assembly('header');
var hgroup = assembly('hgroup');
var hr = assembly('hr');
var html = assembly('html');
var i = assembly('i');
var iframe = assembly('iframe');
var img = assembly('img');
var input = assembly('input');
var ins = assembly('ins');
var kbd = assembly('kbd');
var keygen = assembly('keygen');
var label = assembly('label');
var legend = assembly('legend');
var li = assembly('li');
var link = assembly('link');
var map = assembly('map');
var mark = assembly('mark');
var menu = assembly('menu');
var meta = assembly('meta');
var nav = assembly('nav');
var noscript = assembly('noscript');
var object = assembly('object');
var ol = assembly('ol');
var optgroup = assembly('optgroup');
var option = assembly('option');
var p = assembly('p');
var param = assembly('param');
var pre = assembly('pre');
var progress = assembly('progress');
var q = assembly('q');
var rp = assembly('rp');
var rt = assembly('rt');
var ruby = assembly('ruby');
var s = assembly('s');
var samp = assembly('samp');
var script = assembly('script');
var section = assembly('section');
var select = assembly('select');
var small = assembly('small');
var source = assembly('source');
var span = assembly('span');
var strong = assembly('strong');
var style = assembly('style');
var sub = assembly('sub');
var sup = assembly('sup');
var table = assembly('table');
var tbody = assembly('tbody');
var td = assembly('td');
var textarea = assembly('textarea');
var tfoot = assembly('tfoot');
var th = assembly('th');
var thead = assembly('thead');
var title = assembly('title');
var tr = assembly('tr');
var ul = assembly('ul');
var v = assembly('var');
var video = assembly('video');


// Data
var image = {
  src: 'https://www.google.co.uk/logos/doodles/2016/100th-anniversary-of-completion-of-the-trans-siberian-railway-6269398706814976-vacta.gif',
  width: 85,
  height: 85,
  alt: 'Jennifer Marsman'
};

var articleSection2 = 'This is the second article. These articles could be blog posts, etc.';
var article1Header = 'Article #1h1';
// Data




/// HTML 1
var html1 = div(

  header({ class: 'red', 'data-hello': 'World!', style: {'background': '#2f2'}},
            h1('Header in h1'),
            h2('Subheader in h2')
        ),
  nav(
      ul(
          li(a({ href: 'http://google.com', class: 'some-class' }, 'Menu Option 1a')),
          li(a({ href: 'http://facebook.com', class: 'some-class' }, 'Menu Option 2a')),
          li(a({ href: 'http://youtube.com' }, 'Menu Option 3a'))
      )
  ),
  section(
      article(
          header({ id: 'juliensHeader' },
              h1(article1Header)
          ),
          section(
              'This is the first article. This is',
              mark('highlightedmark'),
              '.'
          )
      ),
      article(
          header(
              h1('Article #2h1')
          ),
          section({ id: 'whatsUpJack' },
              articleSection2
          )
      )
  ),
  aside(
      section(
          h1('Linksh1'),
          ul(
              li(a({ href: '#' }, 'Link 1a')),
              li(a({ href: '#' }, 'Link 2a')),
              li(a({ href: '#' }, 'Link 3a'))
          )
      ),
      figure(
          img({src: image.src, width: image.width, height: image.height, alt: image.alt}),
          figcaption('Jennifer Marsman')
      )
  ),
  footer('Footer - Copyright 2016')
  );




/// HTML 2
var html2 = div(

  header({ class: 'red', 'data-hello': 'World!', style: {'background': 'pink'}},
            h1('Header in h1'),
            h2('Subheader in h2')
        ),
  nav(
      ul(
          li(a({ href: 'http://google.com', class: 'some-class' }, 'Menu Option 1a')),
          h1(
            'WHAT THIS IS NOT THE SAMMEEEE'
            ),
          li(a({ href: 'http://youtube.com' }, 'Menu Option 3a'))
      )
  ),
  section(
      article(
          header({ id: 'juliensHeader' },
              h1('BLALALALALALALALA')
          ),
          section(
              'This is the first article. This is',
              mark('highlightedmark'),
              '.'
          )
      ),
      article(
          header(
              h1('Article #2h1')
          ),
          section({ id: 'whatsUpJack' },
              articleSection2
          )
      )
  ),
  aside(
      section(
          h1('Linksh1'),
          ul(
              li(a({ href: '#' }, 'Link 1a')),
              li(a({ href: '#' }, 'Link 2a')),
              li(a({ href: '#' }, 'Link 3a'))
          )
      ),
      figure(
          img({src: 'https://avatars0.githubusercontent.com/u/7676299?v=3&s=466', width: image.width, height: image.height, alt: image.alt}),
          figcaption('ergergergerg')
      )
  ),
  footer('FOOOOOOOOOOOOOOOOO')
  );


// Render page intially 
var el = createElement(html1);
document.body.appendChild(el);


//Make changes

// setTimeout(function() {  
//   var patches = diff(html1, html2);
//   patch(el, patches)
// }, 2000)



// setTimeout(function() {
  
//   var patches = diff(html2, html1);
//   patch(el, patches)
// }, 4000)