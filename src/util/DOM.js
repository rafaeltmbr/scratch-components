class DOMUtil {
    static createNodeElement(html) {
        const node = document.createElement('div');
        node.innerHTML = html;
        return node.children.length === 1 ? node.children[0] : node.children;
    }
}

export default DOMUtil;
