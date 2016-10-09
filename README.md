# _hypertext_

Create [virtual-dom](https://github.com/Matt-Esch/virtual-dom)'s [virtual-hyperscript](https://github.com/Raynos/virtual-hyperscript) **VTrees** or **DOM elements** using **_hypertext_**


```php
**Working ALPHA**
```


## What you need to know:
#### **1**) _hypertext_ requires ES6 or CJS

&nbsp;&nbsp;&nbsp;&nbsp;<sup>Demo using **```npm run play```** tweak **```./playground.js```** then check port **`9966`**</sup>

&nbsp;&nbsp;&nbsp;&nbsp;<sup>To demo via ES5 use **```./dist/hypertext-not-for-production.min.js```** all tags will miserably be global.</sup>

- &nbsp;&nbsp;&nbsp;&nbsp;<sup>```npm i --save hypertext``` : Install</sup>
- &nbsp;&nbsp;&nbsp;&nbsp;<sup>```npm run play``` : Host playground.js on port 9966</sup>
- &nbsp;&nbsp;&nbsp;&nbsp;<sup>```npm run build``` : Builds es6 & cjs</sup>
- &nbsp;&nbsp;&nbsp;&nbsp;<sup>```npm run global``` : Builds not-for-production.min.js</sup>
- &nbsp;&nbsp;&nbsp;&nbsp;<sup>```npm run all``` : Builds all</sup>
- &nbsp;&nbsp;&nbsp;&nbsp;<sup>```npm run watch``` : Build and watch src</sup>

#### **2**) Import as you need
```javascript 
import { div, ul, li, a, header, footer, article, section, aside, h1, h3} from 'hypertext';
```
#### **3**) Case: Create HTML elements without a virtual-dom
```javascript 

import { createNodeTree, div, h1, p, figure, figcaption, img } from 'hypertext';

const helloWorld =
	createHTML(
		div({ class: 'hello', id: 'world' },
			h1('Hello World!'),
			p('How are you?'),
			figure({ class: 'img-section' },
				figcaption('Three different breeds of dogs.'),
				img({ alt: 'Maltese Terrier', src: 'dog1.jpg' }),
				img({ alt: 'Black Labrador', src: 'dog2.jpg' } })
			)
		)
	)
document.body.appendChild(helloWorld);
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
#### **4**) Case: Use hypertext with a virtual dom

hypertext currently supports any virtual dom based on [virtual-dom](https://github.com/Matt-Esch/virtual-dom)'s VTrees.
Such as: 
- [virtual-dom](https://github.com/Matt-Esch/virtual-dom)
- [mercury](https://github.com/Raynos/mercury)

&nbsp;&nbsp;&nbsp;&nbsp;<sup>Future updates will support additional virtual doms</sup>

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

**_hypertext_** is the only hyperscript that features identical tag notation to HTML without the use of a transformer as with JSX.
There's a few good reasons to use _hypertext_
- Those who know HTML but with little to no JavaScript knowledge already know **_hypertext_**.
- There is no set up or compiling for production use.
- hypertext is valid JavaScript.
- Only supports valid HTML tags (Custom HTML pending).
- Supports condtitions and easy to use iterations (loop() fn pending).
- For some, the syntax may be more readable than markup: ```</closingTag>``` === ```)```.
- Has no dependencies, but obviously requires a virtual DOM if you care about repaint/ reflow (You should).
- **_hypertext_** hopes to one day be virtual-dom agnostic (_e.g. React, Vue 2.0, incremental dom support_) as "most" of 
the differences between various virtual dom libraries do not warrant complete re-implementations of hypertext.

#### **5**) Thanks

To Matt Esch and Jake Verbaten for creating a bunch of cool libraries and modules that inspired hyperscript.

[MIT](https://github.com/julienetie/hypertext/blob/master/LICENSE)
Copyright (c) 2016 Julien Etienne
