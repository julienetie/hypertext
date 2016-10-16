import isArray from 'lodash-es/isArray';
import { isChild } from '../conditions';

function internal(data, callback, supportData) {
	let childContainer = callback.apply(this, [data, supportData]);
	if(isArray(childContainer) || isChild(childContainer || typeof childContainer === 'string')){
		return childContainer;
	}else{
		throw new Error('or() must return a virtualChildNode, Array or String');
	}
}

function or(data, inner, supportData) {
	return internal.apply(this, [data, inner, supportData]);
}

export default or;
