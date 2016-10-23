import version from '../version';
import isArray from 'lodash-es/isArray';

const isVirtualText = (virtualText) => {
	return virtualText && virtualText.type === "VirtualText" && virtualText.version === version;
};


const isThunk = (thunk) => {
	return thunk && thunk.type === "Thunk";
}


const isHook = (hook) => {
	return hook &&
		(typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
			typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
};


const isVirtualNode = (VirtualNode) => {
	return VirtualNode && VirtualNode.type === "VirtualNode" && VirtualNode.version === version;
};


const isWidget = (widget) => {
	return widget && widget.type === "Widget";
};


const hasPatches = (patch) => {
	for (var index in patch) {
		if (index !== "a") {
			return true;
		}
	}

	return false;
};


const isChild = (child) => {
	return isVirtualNode(child) || isVirtualText(child) || isWidget(child) || isThunk(child);
};


const isChildren = (children) => {
	return typeof children === 'string' || isArray(children) || isChild(children);
};

const isJSON = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export { 
	isVirtualText, 
	isThunk, 
	isHook, 
	isVirtualNode, 
	isWidget, 
	hasPatches, 
	isChild, 
	isChildren,
	isJSON
};
