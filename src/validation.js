export function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
    '\n' +
    'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

export function UnsupportedValueType(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unsupported.value-type';
    err.message = 'Unexpected value type for input passed to h().\n' +
        'Expected a ' +
        errorString(data.expected) +
        ' but got:\n' +
        errorString(data.received) +
        '.\n' +
        'The vnode is:\n' +
        errorString(data.Vnode);
    '\n' +
    'Suggested fix: Cast the value passed to h() to a string using String(value).';
    err.Vnode = data.Vnode;

    return err;
}


export function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}
