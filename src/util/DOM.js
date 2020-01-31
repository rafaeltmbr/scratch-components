class DOMUtil {
    static createNodeElement(html) {
        const node = document.createElement('div');
        node.innerHTML = html;
        return node.children.length === 1 ? node.children[0] : node.children;
    }

    // function extracted from https://stackoverflow.com/questions/4817029
    static isTouch() {
        const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

        const mq = (
            window.matchMedia
                ? (query) => window.matchMedia(query).matches
                : undefined
        );

        // eslint-disable-next-line no-undef
        if (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) {
            return true;
        }

        // include the 'heartz' as a way to have a non matching MQ to help terminate the join
        // https://git.io/vznFH
        const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return (mq ? mq(query) : false);
    }
}

export default DOMUtil;
