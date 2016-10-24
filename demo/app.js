// // var layout = createNodes(
// var tree = 
// div({class:'main-wrapper'},

//   div({class:'hero-image'},
//     div({class:'hero-content'},
//       div({class:'hc-label'},'The Italian Dolomites'),
//       div({class:'hc-desc'},'Interview with Andy Free about his trip to the dolomites in Italy'),
//       div({class:'hc-footer'},
//         div({class:'hcf-comments'},span({class:'amount'},'168'),'Comments'),
//         div({class:'hcf-divider'}),
//         div({class:'hcf-shares'},span({class:'amount'},'26.842'),'Shares'),
//         div({class:'hcf-toggle'},
//           p({class:'hcft-label'},'More Articles'),
//           div({class:'hcft-icon-holder'},
//             i({class:'hcft-icon closed fa fa-chevron-down'}),
//             i({class:'hcft-icon opened fa fa-times'})
//           )
//         )
//       )
//     )
//   ),
 
//   div({class:'scroll-content'},
//     div({class:'sc-row'},
//       div({class:'content-article'},
//         div({class:'article-number'},'01'),
//         div({class:'article-info'},
//           div({class:'ai-label'},'Visiting Vester Peak'),
//           div({class:'ai-desc'},'Everything you should know about hiking in the mountains'),
//           div({class:'ai-footer'},
//             div({class:'aif-comments'},span({class:'amount'},'24'),'Comments'),
//             div({class:'aif-divider'}),
//             div({class:'aif-shares'},span({class:'amount'},'128'),'Shares')
//           )
//         ),
//         div({class:'article-image ca-1'})
//       ),
//       div({class:'content-article'},
//         div({class:'article-number'},'02'),
//         div({class:'article-info'},
//           div({class:'ai-label'},'Trailing Together'),
//           div({class:'ai-desc'},'Walking among the nature in the Rocky Mountain National Park, Colorado'),
//           div({class:'ai-footer'},
//             div({class:'aif-comments'},span({class:'amount'},'458'),'Comments'),
//             div({class:'aif-divider'}),
//             div({class:'aif-shares'},span({class:'amount'},'110'),'Shares')
//           )
//         ),
//         div({class:'article-image ca-2'})
//       )
//     ),
//     div({class:'sc-row'},
//       div({class:'content-article'},
//         div({class:'article-number'},'03'),
//         div({class:'article-info'},
//           div({class:'ai-label'},'The Magic Pond'),
//           div({class:'ai-desc'},'The scenery is set like a Monet painting'),
//           div({class:'ai-footer'},
//             div({class:'aif-comments'},span({class:'amount'},1640),'Comments'),
//             div({class:'aif-divider'}),
//             div({class:'aif-shares'},span({class:'amount'},86.451),'Shares')
//           )
//         ),
//         div({class:'article-image ca-3'})
//       ),
//       div({class:'content-article'},
//         div({class:'article-number'},'04'),
//         div({class:'article-info'},
//           div({class:'ai-label'},'Beach Essentials'),
//           div({class:'ai-desc'},'What should you bring to the beach, and what beaches should you visit?'),
//           div({class:'ai-footer'},
//             div({class:'aif-comments'},span({class:'amount'},58),'Comments'),
//             div({class:'aif-divider'}),
//             div({class:'aif-shares'},span({class:'amount'},1.359),'Shares')
//           )
//         ),
//         div({class:'article-image ca-4'})
//       )
//     ),
//     div({class:'sc-row'},
//       div({class:'content-article'},
//         div({class:'article-number'},'05'),
//         div({class:'article-info'},
//           div({class:'ai-label'},'Romantic Camping'),
//           div({class:'ai-desc'},'We went to Norway to find out just how romantic it can be sleeping under the stars'),
//           div({class:'ai-footer'},
//             div({class:'aif-comments'},span({class:'amount'},14),'Comments'),
//             div({class:'aif-divider'}),
//             div({class:'aif-shares'},span({class:'amount'},36),'Shares')
//           )
//         ),
//         div({class:'article-image ca-5'})
//       ),
//       div({class:'content-article'},
//         div({class:'article-number'},'06'),
//         div({class:'article-info'},
//           div({class:'ai-label'},'Cave Explorers'),
//           div({class:'ai-desc'},'In USA there\'s over a thousand caves. We list everyone that you should visit.'),
//           div({class:'ai-footer'},
//             div({class:'aif-comments'},span({class:'amount'},3590),'Comments'),
//             div({class:'aif-divider'}),
//             div({class:'aif-shares'},span({class:'amount'},129.547),'Shares')
//           )
//         ),
//         div({class:'article-image ca-6'})
//       )
//     )
//   )
// )
// // );
// // document.body.appendChild(layout)
// console.log(tree)
const version = '2';

const isThunk = (thunk) => {
  return thunk && thunk.type === "Thunk";
}

const isVirtualNode = (VirtualNode) => {
  return VirtualNode && VirtualNode.type === "VirtualNode" && VirtualNode.version === version;
};


const isWidget = (widget) => {
  return widget && widget.type === "Widget";
};


const isHook = (hook) => {
  return hook &&
    (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
      typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
};


function VirtualNode(propertiesVal, childrenVal, keyVal, namespaceVal) {

    let properties = propertiesVal || {};
    let children = childrenVal || [];
    let key = keyVal != null ? keyVal + '' : undefined;
    let namespace = (typeof namespaceVal === "string") ? namespaceVal : null;

    const count = (children && children.length) || 0;
    let descendants = 0;
    let hasWidgets = false;
    let hasThunks = false;
    let descendantHooks = false;
    let hooks;
    let propName;
    let property;
    let i;
    let child;

    for (propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            property = properties[propName];
            if (isHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {};
                }

                hooks[propName] = property;
            }
        }
    }

    for (i = 0; i < count; i++) {
        child = children[i]

        // TODO fix condition 
        if (true) {
            descendants += child.count || 0;

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true;
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true;
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true;
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true;
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    return {
      count:  count + descendants || 0,
      hasWidgets,
      hasThunks,
      hooks,
      descendantHooks
    }
}









const createVTree = (interfaceSelector, whitespaceRules = 'trim') => {

  var element;
  var vTree = {};
  if(interfaceSelector.nodeType){
    element = interfaceSelector;
  }else{
    element = document.querySelector(interfaceSelector);
  }

  function getDefinedAttributes(attributes){
    const attr = {};
    const attributesLength = attributes.length;
    let attribute;
    let attributeName;
    let namespace = false;
    let key = false;
    let event = false;

    for(let i = 0; i < attributesLength; i++){
      attribute = attributes[i];
      attributeName = attributes[i].name;

      // Ignore
      switch(attributeName){
        case 'key':
          key = attribute.value;
        break;
        case 'event':
          event = attribute.value;
        break;
        default:
        attr[attribute.name] = attribute.value;
      }

      // Also
      switch(attributeName){
        case 'xmlns':
        case 'xmlns:svg':
        case 'xmlns:xlink':
          namespace = attribute.value;
        break;
      }

    }

    return {attr, namespace, key};
  }
  
  // function getChildrenAsArray(children){
  //   const childrenArr = [];
  //   const childrenLength = children.length;

  //   for(let i = 0; i < childrenLength; i++){
  //     childrenArr.push(createVTree(children[i]));
  //   }
  //   return childrenArr;
  // }


  function getChildNodesAsArray(childNodes){
    const ignoreTrim = !(whitespaceRules === 'ignore-trim');
    const childNodesArr = [];
    let childNodesLength = childNodes.length;

      for(let i = 0; i < childNodesLength; i++){
        if(childNodes[i].nodeType === 3 & ignoreTrim){
          /*
           *  "\t" TAB \u0009
           *  "\n" LF  \u000A
           *  "\r" CR  \u000D
           *  " "  SPC \u0020
          */
          if(childNodes[i].nodeValue === childNodes[i].nodeValue.replace(/^\s+|\s+$/g, '')){
             childNodesArr.push(createVTree(childNodes[i],whitespaceRules));
          }
        }else{
          childNodesArr.push(createVTree(childNodes[i],whitespaceRules));
        }
      }

    return childNodesArr;
  }


  if(element.nodeType !== 3){
    // Tag name.
    vTree.tagName = element.tagName;
  }


  if(element.childNodes.length){
    // Children.
    vTree.children = getChildNodesAsArray(element.childNodes); 
  }


  if(element.nodeType === 3){
  // Text.
    vTree.text = element.nodeValue;
  }else{

      const definedAttributes = getDefinedAttributes(element.attributes);

    if(element.attributes){

      // Properties.
      vTree.properties = definedAttributes.attr;
      
      // Namespace.
      vTree.namespace = !!definedAttributes.namespace;

      // Event.
      vTree.event = !!definedAttributes.event;  


      }

      const virtualNode = VirtualNode(
        vTree.properties, 
        vTree.children, 
        definedAttributes.key, 
        definedAttributes.namespace, 
        definedAttributes.event)


      vTree.hasThunks = virtualNode.hasThunks;

      vTree.count = virtualNode.count;

      vTree.hasWidgets = virtualNode.hasWidgets;

      vTree.descendantHooks = virtualNode.descendantHooks;

    }


  // Is Virtual Node.
  vTree.virtualNode = true;



  return vTree;
}

console.log(createVTree('.main-wrapper'));