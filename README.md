# _Hypertext_

```php
Alpha
```

Create HTML in JavaScript via [virtual-dom](https://github.com/Matt-Esch/virtual-dom) VTrees or directly to the DOM: [virtual-hyperscript](https://github.com/Raynos/virtual-hyperscript) alternative.


## What you need to know:
#### **1**) _Hypertext_ is written in ES6, but can be used in any workflow.
See: [Hypertext with ES6, ES5, CommonJS, AMD & globals](https://github.com/julienetie/hypertext/wiki/Hypertext-with-ES6,-ES5,-CommonJS,-AMD-&-globals)

&nbsp;&nbsp;&nbsp;&nbsp;Demo using **```npm run play```** tweak **```./playground.js```** then check port **`9966`**

&nbsp;&nbsp;&nbsp;&nbsp;To demo directly use **```./dist/hypertext-not-for-production.min.js```** all tags will miserably be global.

- &nbsp;&nbsp;&nbsp;&nbsp;```npm i --save hypertext``` : Install
- &nbsp;&nbsp;&nbsp;&nbsp;```npm run build``` : Builds all distributions
- &nbsp;&nbsp;&nbsp;&nbsp;```npm run play``` : Host playground.js on port 9966

#### **2**) Import as you need
```javascript 
import { div, ul, li, a, header, footer, article, section, aside, h1, h3} from 'hypertext';
```
#### **3**) Case: Create HTML elements without a virtual-dom
```javascript 

import { createNodes, div, h1, p, figure, figcaption, img } from 'hypertext';

const helloWorldTree =
		div({ class: 'hello', id: 'world' },
			h1('Hello World!'),
			p('How are you?'),
			figure({ class: 'img-section' },
				figcaption('Three different breeds of dogs.'),
				img({ alt: 'Maltese Terrier', src: 'dog1.jpg' }),
				img({ alt: 'Black Labrador', src: 'dog2.jpg' })
			)
		);
	
let helloWorldNodes = createNodes(helloWorldTree);
document.body.appendChild(helloWorldNodes);
```
Will create: 
```html 
        <div class="hello" id="world">
            <h1>Hello World!</h1>
            <p>How are you?</p>
            <figure class="img-section">
                <figcaption>Three different breeds of dogs</figcaption>
                <img alt="Maltese Terrier" src="dog1.jpg">
                <img alt="Black Labrador" src="dog2.jpg">
            </figure>
        </div>
```
#### **4**) Case: Use Hypertext with a virtual dom

Hypertext currently supports any virtual dom based on [virtual-dom](https://github.com/Matt-Esch/virtual-dom)'s VTrees.
Such as: 
- [virtual-dom](https://github.com/Matt-Esch/virtual-dom)
- [mercury](https://github.com/Raynos/mercury)

A modification of virtual-dom's example:
```
import { div } from 'hypertext';
import { diff, patch, createElement } from 'virtual-dom';

// 1: Create a function that declares what the DOM should look like
function render(count)  {
    return ( 
      div({style: {textAlign: 'center', lineHeight: (100 + count) + 'px',
         border: '1px solid red', width: (100 + count) + 'px', height: (100 + count) + 'px'}}, 
         [String(count)]
      )
    )
}

// 2: Initialise the document
var count = 0;

var tree = render(count);               // We need an initial tree
var rootNode = createElement(tree);     // Create an initial root DOM node ...
document.body.appendChild(rootNode);    // ... and it should be in the document

// 3: Wire up the update logic
setInterval(function () {
      count++;

      var newTree = render(count);
      var patches = diff(tree, newTree);
      
      rootNode = patch(rootNode, patches);
      tree = newTree;
}, 1000);
```
#### **5**) Ramblings

**_Hypertext_** features identical tag notation to HTML without the use of a transformer as with JSX.
There's a few good reasons to use _Hypertext_
- Those who know HTML but with little to no JavaScript knowledge already know **_Hypertext_**.
- There is no set up or compiling for production use.
- Hypertext is valid JavaScript.
- Only supports valid HTML tags (Custom HTML pending).
- Supports condtitions and easy to use iterations (loop() fn pending).
- For some, the syntax may be more readable than markup: ```</closingTag>``` === ```)```.
- Has no dependencies, but obviously requires a virtual DOM if you care about repaint/ reflow (You should).
- **_Hypertext_** hopes to one day be virtual-dom agnostic (_e.g. React, Vue 2.0, incremental dom support_) as "most" of 
the differences between various virtual dom libraries do not warrant complete re-implementations of Hypertext.


#### **6**) Contribute

- &nbsp;&nbsp;&nbsp;&nbsp;```npm run es``` : Builds hypertext.es.js
- &nbsp;&nbsp;&nbsp;&nbsp;```npm run umd``` : Builds hypertext.js
- &nbsp;&nbsp;&nbsp;&nbsp;```npm run globals``` : Builds not-for-production.min.js
- &nbsp;&nbsp;&nbsp;&nbsp;```npm run watch``` : Build and watch src for es


#### **7**) Thanks

To Matt Esch and Jake Verbaten for creating a bunch of cool libraries and modules that made Hypertext feasible.

[MIT](https://github.com/julienetie/hypertext/blob/master/LICENSE)
Copyright (c) 2016 Julien Etienne
