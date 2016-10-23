import { assembly, loop, or } from './assembly';
import createNodes from './create-nodes';
import eventStore from './events/event-store';
import arrayFrom from './polyfills/array-from';

arrayFrom();

export { assembly, loop, or, createNodes, eventStore };
