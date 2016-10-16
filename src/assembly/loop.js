import isArray from 'lodash-es/isArray';

function internal(data, callback, supportData) {
	let childContainer = callback.apply(this, [data, supportData]);
	if(isArray(childContainer)){
		return childContainer;
	}else{
		throw new Error('A loop must return an array');
	}
}

function loop(data, inner, supportData) {
	return internal.apply(this, [data, inner, supportData]);
}

export default loop;
