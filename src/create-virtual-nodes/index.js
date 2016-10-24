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
      descendantHooks,
      key
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
    let key = null;
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






  if(element.nodeType === 3){
  // Text.
    vTree.text = element.nodeValue;
    vTree.version = '2';
    vTree.type = "VirtualText";
  }else{

  if(element.childNodes.length){
    // Children.
    vTree.children = getChildNodesAsArray(element.childNodes); 
  }else{
    vTree.children = [];
  }

      const definedAttributes = getDefinedAttributes(element.attributes);

    if(element.attributes){

      // Properties.
      vTree.properties = definedAttributes.attr;
      
      // Namespace.
      vTree.namespace = definedAttributes.namespace ? true : null;

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

      vTree.hooks = virtualNode.hooks;

      vTree.key = virtualNode.key;


      vTree.version = '2';
      vTree.type = "VirtualNode";
    }


  // Is Virtual Node.
  vTree.virtualNode = true;



  return vTree;
}

export default createVTree;