import once from '../utils';
import eventStore from './event-store';

/*
 * An eventReference is meant only for an element
 * or elements that may co-exist as the same element between patches 
 */
const storeEventTarget = (HTMLElement, eventReference) => {
	let i;

	if(!eventStore.hasOwnProperty(eventReference)){
		eventStore[eventReference] = [HTMLElement];
	}else{
		var eventStoreRef = eventStore[eventReference];
		
		if(!eventStoreRef.includes(HTMLElement)){
			eventStore.push(HTMLElement);
		}
	}
	if(once('console.log.eventStore')){
		console.info('eventStore registry', eventStore);
		HTMLElement.addEventListener('click',function(){
			alert('test')
		},false)		
	}
}
 
export default storeEventTarget;