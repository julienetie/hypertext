import isArray from 'lodash-es/isArray';
import isPlainObject from 'lodash-es/isPlainObject';
import isJSON from '../conditions';

function d(data, callback) {
	let childContainer = callback.apply(this, [data]);
	if(isArray(childContainer)){
		return childContainer;
	}else{
		throw new Error('A loop must return an array');
	}


}

function loop(data, inner) {
	return d.apply(this, [data, inner]);
}

export default loop;
