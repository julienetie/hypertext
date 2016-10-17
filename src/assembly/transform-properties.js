// import { eventHook } from '../ev-store';
// import { isHook } from '../conditions';

export default (props, vNode) => {

    for (let propName in props) {
        if (props.hasOwnProperty(propName)) {
            let value = props[propName];
            if (isHook(value)) {
                console.log(propName,value)
                continue;
            }
            // if (propName.substr(0, 3) === 'ev-') {
            //     props[propName] = eventHook(value);
            // }
            // if (propName === 'event'){
            //     console.log()
            // }
        }
    }
}