/**
 * Pass a condition once with a given reference.
 * @param {string} reference - A unique reference per conditon.
 * @return {Boolean}
 */
export default function once(reference) {
    if (!once.prototype.references) {
        once.prototype.references = {};
    }
    // Store reference if dosen't exist.
    if (!once.prototype.references.hasOwnProperty(reference)) {
        once.prototype.references[reference] = null;
        return true;
    } else {
        return false;
    }
}