
alert('hello')

/** 
 * Example 1
 */

// import { createNodeTree, div, h1, p, figure, figcaption, img } from 'hypertext';

// const helloWorld =
//     createHTML(
//         div({ class: 'hello', id: 'world' },
//             h1('Hello World!'),
//             p('How are you?'),
//             figure({ class: 'img-section' },
//                 figcaption('Three different breeds of dogs.'),
//                 img({ alt: 'Maltese Terrier', src: 'dog1.jpg' }),
//                 img({ alt: 'Black Labrador', src: 'dog2.jpg' } })
//             )
//         )
//     )
// document.body.appendChild(helloWorld);

/** 
 * Example 2
 */

// import { div } from 'hypertext';
// import { diff, patch, createElement } from 'virtual-dom';

// // 1: Create a function that declares what the DOM should look like
// function render(count)  {
//     return ( 
//       div({style: {textAlign: 'center', lineHeight: (100 + count) + 'px',
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