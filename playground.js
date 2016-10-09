/*
 * FOR DEMONSTRATION ONLY: 
 * let's import hypertext common JS modules
 * and assign each to the window object. 
 * 
 * 
 * In production use:
 * 
 *    var div = require('./dist/hypertext-cjs').div;
 * 
 * or require the exported object.
 */
var fn = require('./dist/hypertext-cjs');
Object.assign(window,fn) // This is bad


/** 
 * Example 1
 */
// var helloWorld =
//     createNodes(
//         div({ class: 'hello', id: 'world' },
//             h1('Hello World!'),
//             p('This is Hypertext'),
//             figure({ class: 'img-section' },
//                 figcaption('This is random Art'),
//                 img({ alt: 'Banksy', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Banksy-art.jpg/220px-Banksy-art.jpg' }),
//                 img({ alt: 'The Scream', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Scream.jpg/220px-The_Scream.jpg' })
//             )
//         )
//     )
// document.body.appendChild(helloWorld);



/** 
 * Example 2 (comment out Example 1 first)
 */
// var diff = require('virtual-dom/diff');
// var patch = require('virtual-dom/patch');
// var createElement = require('virtual-dom/create-element');

// // 1: Create a function that declares what the DOM should look like
// function render(count)  {
//     return ( 
//       div({style: {'text-align': 'center', 'line-height': (100 + count) + 'px',
//          border: '1px solid red', width: (100 + count) + 'px', height: (100 + count) + 'px'}}, 
//          [String(count)]
//       )
//     )
// }

// // 2: Initialise the document
// var count = 0;

// var tree = render(count);               // We need an initial tree
// var rootNode = createElement(tree);     // Create an initial root DOM node ...

// document.body.appendChild(rootNode);    // ... and it should be in the document

// // 3: Wire up the update logic
// setInterval(function () {
//       count++;

//       var newTree = render(count);
//       var patches = diff(tree, newTree);

//       rootNode = patch(rootNode, patches);
//       tree = newTree;
// }, 1000);