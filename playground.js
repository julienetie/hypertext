/*
 * Hypertext v0.0.1 (Alpha)
 *
 *
 * FOR DEMONSTRATION ONLY: 
 * let's import hypertext common JS modules
 * and assign each to the window object. 
 * 
 * 
 * In production only use the tags you need e.g:
 * 
 *    var div = require('./dist/hypertext-cjs').div;
 * 
 * or require the exported object.
 */
var fn = require('./dist/hypertext.js');
Object.assign(window,fn) // This is bad

var div = assembly('div');
var h1 = assembly('h1');
var p = assembly('p');
var img = assembly('img');
var figure = assembly('figure');
var figcaption = assembly('figcaption');

/** 
 * ***************************************
 * Example 1:    Hypertext createNodes
 * ***************************************
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
 * ***************************************
 * Example 2:    Hypertext with Virtual DOM     
 *                          (comment out Example 1 first)
 * ***************************************
 */


		// // 1: Add the VDOM patch and diff APIs
		// 	var diff = require('virtual-dom/diff');
		// 	var patch = require('virtual-dom/patch');

		// // 2: Create a function that declares what the DOM should look like
		// 	function hypertext(count)  {
		// 	    return ( 
		// 	      div({style: {'text-align': 'center', 'line-height': (100 + count) + 'px',
		// 	         border: '1px solid red', width: (100 + count) + 'px', height: (100 + count) + 'px'}}, 
		// 	         [String(count)]
		// 	      )
		// 	    )
		// 	}

		// // 3: Initialise the document
		// 	var count = 0;
		// 	var tree = hypertext(count);               // We need an initial tree
		// 	var rootNode = createNodes(tree);     // Create an initial root DOM node ...
		// 	document.body.appendChild(rootNode);    // ... and it should be in the document

		// // 4: Wire up the update logic
		// 	setInterval(function () {
		// 	      count++;

		// 	      var newTree = hypertext(count);
		// 	      var patches = diff(tree, newTree);

		// 	      rootNode = patch(rootNode, patches);
		// 	      tree = newTree;
		// 	}, 1000);

// Read up about loop() and conditions to build complex interfaces beyond this demo.

// - Hypertext   		https://github.com/julienetie/hypertext
// - Virtual-dom 		https://github.com/Matt-Esch/virtual-dom