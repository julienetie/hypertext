import version from './version';
import isArray from '../node_modules/lodash-es/isArray';


const isVirtualText = (x) => {
	return x && x.type === "VirtualText" && x.version === version;
};


const isThunk = (t) => {
	return t && t.type === "Thunk";
}


const isHook = (hook) => {
	return hook &&
		(typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
			typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
};


const isVirtualNode = (x) => {
	return x && x.type === "VirtualNode" && x.version === version;
};


const isWidget = (w) => {
	return w && w.type === "Widget";
};


const hasPatches = (patch) => {
	for (var index in patch) {
		if (index !== "a") {
			return true;
		}
	}

	return false;
};


const isChild = (x) => {
	return isVirtualNode(x) || isVirtualText(x) || isWidget(x) || isThunk(x);
};


const isChildren = (x) => {
	return typeof x === 'string' || isArray(x) || isChild(x);
};

export { 
	isVirtualText, 
	isThunk, 
	isHook, 
	isVirtualNode, 
	isWidget, 
	hasPatches, 
	isChild, 
	isChildren 
};
