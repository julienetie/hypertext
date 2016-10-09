const version = 2;


export function VirtualText(text) {
	this.text = String(text)
}


export let isVirtualText = (x) => {
	return x && x.type === "VirtualText" && x.version === version
}

export function isThunk(t) {
	return t && t.type === "Thunk"
}


export const isHook = (hook) => {
	return hook &&
		(typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
			typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}


export const isVirtualNode = (x) => {
	return x && x.type === "VirtualNode" && x.version === version
}


export const isWidget= (w) =>{
	return w && w.type === "Widget"
}


export const hasPatches = (patch) => {
	for (var index in patch) {
		if (index !== "a") {
			return true
		}
	}

	return false
}


// export const isArray = (obj) => {
// 	return toString.call(obj) === "[object Array]"
// }


export const isChild = (x) => {
	return isVirtualNode(x) || isVirtualText(x) || isWidget(x) || isThunk(x);
}


export const isChildren = (x) => {
	return typeof x === 'string' || isArray(x) || isChild(x);
}
