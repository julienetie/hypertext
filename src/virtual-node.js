import { isHook, isWidget, isThunk, isVirtualNode } from './conditions';
import version from './version';

export function VirtualNode(tagName, properties, children, key, namespace, event) {
    this.tagName = tagName;
    this.properties = properties || {};
    this.children = children || [];
    this.key = key != null ? key + '' : undefined;
    this.namespace = (typeof namespace === "string") ? namespace : null;

    const count = (children && children.length) || 0;
    let descendants = 0;
    let hasWidgets = false;
    let hasThunks = false;
    let descendantHooks = false;
    let hooks;
    let propName;
    let property;
    let i;
    let child;

    for (propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            property = properties[propName];
            if (isHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {};
                }

                hooks[propName] = property;
            }
        }
    }

    for (i = 0; i < count; i++) {
        child = children[i]
        if (isVirtualNode(child)) {
            descendants += child.count || 0;

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true;
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true;
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true;
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true;
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants;
    this.hasWidgets = hasWidgets;
    this.hasThunks = hasThunks;
    this.hooks = hooks;
    this.descendantHooks = descendantHooks;
    this.event = event; 
    this.virtualNode = true; 

    
}

export function VirtualText(text) {
    this.text = text + '';
}

VirtualNode.prototype.version = version;
VirtualNode.prototype.type = "VirtualNode";
VirtualText.prototype.version = version;
VirtualText.prototype.type = "VirtualText";