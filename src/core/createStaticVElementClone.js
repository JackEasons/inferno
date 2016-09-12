import { isBrowser, isNull, isArray, isStringOrNumber, isInvalid } from './utils';
import { documentCreateElement } from '../DOM/utils';
import { patchProp } from '../DOM/patching';
function mountStaticChildren(children, dom, isSVG) {
    if (isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            mountStaticChildren(child, dom, isSVG);
        }
    }
    else if (isStringOrNumber(children)) {
        dom.appendChild(document.createTextNode(children));
    }
    else if (!isInvalid(children)) {
        mountStaticNode(children, dom, isSVG);
    }
}
function mountStaticNode(node, parentDom, isSVG) {
    const tag = node.tag;
    if (tag === 'svg') {
        isSVG = true;
    }
    const dom = documentCreateElement(tag, isSVG);
    const children = node.children;
    if (!isNull(children)) {
        mountStaticChildren(children, dom, isSVG);
    }
    const props = node.props;
    if (!isNull(props)) {
        for (let prop in props) {
            patchProp(prop, null, props[prop], dom);
        }
    }
    if (parentDom) {
        parentDom.appendChild(dom);
    }
    return dom;
}
export default function createStaticVElementClone(bp, isSVG) {
    if (!isBrowser) {
        return null;
    }
    const staticNode = bp.staticVElement;
    const dom = mountStaticNode(staticNode, null, isSVG);
    if (isSVG) {
        bp.svgClone = dom;
    }
    else {
        bp.clone = dom;
    }
    return dom.cloneNode(true);
}
//# sourceMappingURL=createStaticVElementClone.js.map