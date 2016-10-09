import { 
  createNodes,
  div, 
  header, 
  ul,
  li, 
  a, 
  section, 
  article, 
  h1,
  h2,
  nav,
  mark,
  img, 
  figcaption, 
  figure,
  footer, 
  aside
} from './index';

// Data
var image = {
  src: 'https://www.google.co.uk/logos/doodles/2016/100th-anniversary-of-completion-of-the-trans-siberian-railway-6269398706814976-vacta.gif',
  width: 85,
  height: 85,
  alt: 'Jennifer Marsman'
};

var articleSection2 = 'This is the second article. These articles could be blog posts, etc.';
var article1Header = 'Article #1h1';
// Data




/// HTML 1
var html1 = div(
    100000000000000,
  header({ class: 'red', 'data-hello': 'World!', style: {'background': '#2f2', border: '2px dashed blue'}},
            h1('Header in h1'),
            h2('Subheader in h2')
        ),
  nav(
      ul(
          li(a({ href: 'http://google.com', class: 'some-class' }, 'Menu Option 1a')),
          li(a({ href: 'http://facebook.com', class: 'some-class' }, 'Menu Option 2a')),
          li(a({ href: 'http://youtube.com' }, 'Menu Option 3a'))
      )
  ),
  section(
      article(
          header({ id: 'juliensHeader' },
              h1(article1Header)
          ),
          section(
              'This is the first article. This is',
              mark('highlightedmark'),
              '.'
          )
      ),
      article(
          header(
              h1('Article #2h1')
          ),
          section({ id: 'whatsUpJack' },
              articleSection2
          )
      )
  ),
  aside(
      section(
          h1('THIS EVENT',{'ev-click': (e)=>{alert('yayayaaa')}}),
          ul(
              li(a({ href: '#' }, 'Link 1a')),
              li(a({ href: '#' }, 'Link 2a')),
              li(a({ href: '#' }, 'Link 3a'))
          )
      ),
      figure(
          img({src: image.src, width: image.width, height: image.height, alt: image.alt}),
          figcaption('Jennifer Marsman')
      )
  ),
  footer('Footer - Copyright 2016')
  );




/// HTML 2
var html2 = div(

  header({ class: 'red', 'data-hello': 'World!', style: {'background': 'pink'}},
            h1('Header in h1'),
            h2('Subheader in h2')
        ),
  nav(
      ul(
          li(a({ href: 'http://google.com', class: 'some-class' }, 'Menu Option 1a')),
          h1(
            'WHAT THIS IS NOT THE SAMMEEEE'
            ),
          li(a({ href: 'http://youtube.com' }, 'Menu Option 3a'))
      )
  ),
  section(
      article(
          header({ id: 'juliensHeader' },
              h1('BLALALALALALALALA')
          ),
          section(
              'This is the first article. This is',
              mark('highlightedmark'),
              '.'
          )
      ),
      article(
          header(
              h1('Article #2h1')
          ),
          section({ id: 'whatsUpJack' },
              articleSection2
          )
      )
  ),
  100000000000000,
  aside(
      section(
          h1('Linksh1'),
          ul(
              li(a({ href: '#' }, 'Link 1a')),
              li(a({ href: '#' }, 'Link 2a')),
              li(a({ href: '#' }, 'Link 3a'))
          )
      ),
      figure(
          img({src: 'https://avatars0.githubusercontent.com/u/7676299?v=3&s=466', width: image.width, height: image.height, alt: image.alt}),
          figcaption('ergergergerg')
      )
  ),
  footer('FOOOOOOOOOOOOOOOOO')
  );


// Render page intially 
var el = createNodes(html1);
document.body.appendChild(el);


//Make changes

// setTimeout(function() {  
//   var patches = diff(html1, html2);
//   patch(el, patches)
// }, 2000)



// setTimeout(function() {
  
//   var patches = diff(html2, html1);
//   patch(el, patches)
// }, 4000)