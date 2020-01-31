/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import ScratchComponents from '../../ScratchComponent';
import defaults from '../../ScratchComponentDefaults';
import object from '../../util/object';

describe('Component creation', () => {
    it('should throw an error when the shape type is not specified', () => {
        expect(() => new ScratchComponents()).toThrow();
        expect(() => new ScratchComponents('')).toThrow();
        expect(() => new ScratchComponents('not a valid shape name')).toThrow();
    });

    it('should create components with valid shape names', () => {
        expect(() => new ScratchComponents('event')).not.toThrow();
        expect(() => new ScratchComponents('function')).not.toThrow();
        expect(() => new ScratchComponents('statement')).not.toThrow();
        expect(() => new ScratchComponents('truthyBlock')).not.toThrow();
        expect(() => new ScratchComponents('truthyFalsyBlock')).not.toThrow();
    });

    it('should assign default properties', () => {
        const c = new ScratchComponents('truthyFalsyBlock');
        expect(typeof c._opt).toBe('object');
        expect(object.hasTheSamePropertiesAndValues(c._opt, defaults)).toBe(true);
    });

    it('should overwrite default properties', () => {
        const c = new ScratchComponents('truthyFalsyBlock', {
            attributes: {
                style: {
                    width: '200px',
                },
            },
            fitting: {
                next: false,
            },
        });

        expect(object.hasTheSamePropertiesAndValues(c._opt, defaults)).toBe(false);
        expect(c._opt.fitting.next).toBe(false);
        expect(c._opt.attributes.style.width).toBe('200px');
    });

    it('should support copy constructor', () => {
        const c1 = new ScratchComponents('truthyFalsyBlock', {
            attributes: { class: 'truthy-falsy-block' },
            fitting: { next: false },
        });

        expect(() => new ScratchComponents(c1)).not.toThrow();
        const c2 = new ScratchComponents(c1);

        expect(c2._id > c1._id).toBe(true);
        expect(c2._shapeName).toBe(c1._shapeName);
        expect(object.hasTheSamePropertiesAndValues(c1._opt, c2._opt)).toBe(true);
        expect(object.hasTheSamePropertiesAndValues(c1._dimensions, c2._dimensions)).toBe(true);
        expect(c1).not.toBe(c2);
        expect(c2._opt).not.toBe(c1._opt);
        expect(c2._dimensions).not.toBe(c1._dimensions);
    });

    it('should build the right DOM to the statement component', () => {
        const c = new ScratchComponents('statement');
        const node = c.getDOMNode();
        expect(node instanceof Element).toBe(true);
        expect(node.children.length).toBe(4);
        expect(node.children[0].tagName).toBe('svg');
        expect(node.children[1].className).toBe('scratch-previous-container');
        expect(node.children[2].className).toBe('scratch-description-container');
        expect(node.children[3].className).toBe('scratch-next-container');
    });

    it('should build the right DOM to the event component', () => {
        const c = new ScratchComponents('event');
        const node = c.getDOMNode();
        expect(node instanceof Element).toBe(true);
        expect(node.children.length).toBe(4);
        expect(node.children[0].tagName).toBe('svg');
        expect(node.children[1].className).toBe('scratch-previous-container');
        expect(node.children[2].className).toBe('scratch-description-container');
        expect(node.children[3].className).toBe('scratch-next-container');
    });

    it('should build the right DOM to the function component', () => {
        const c = new ScratchComponents('function');
        const node = c.getDOMNode();
        expect(node instanceof Element).toBe(true);
        expect(node.children.length).toBe(4);
        expect(node.children[0].tagName).toBe('svg');
        expect(node.children[1].className).toBe('scratch-previous-container');
        expect(node.children[2].className).toBe('scratch-description-container');
        expect(node.children[3].className).toBe('scratch-next-container');
    });

    it('should build the right DOM to the truthyBlock component', () => {
        const c = new ScratchComponents('truthyBlock');
        const node = c.getDOMNode();
        expect(node instanceof Element).toBe(true);
        expect(node.children.length).toBe(5);
        expect(node.children[0].tagName).toBe('svg');
        expect(node.children[1].className).toBe('scratch-previous-container');
        expect(node.children[2].className).toBe('scratch-description-container');
        expect(node.children[3].className).toBe('scratch-truthy-container');
        expect(node.children[4].className).toBe('scratch-next-container');
    });

    it('should build the right DOM to the truthyFalsyBlock component', () => {
        const c = new ScratchComponents('truthyFalsyBlock');
        const node = c.getDOMNode();
        expect(node instanceof Element).toBe(true);
        expect(node.children.length).toBe(6);
        expect(node.children[0].tagName).toBe('svg');
        expect(node.children[1].className).toBe('scratch-previous-container');
        expect(node.children[2].className).toBe('scratch-description-container');
        expect(node.children[3].className).toBe('scratch-truthy-container');
        expect(node.children[4].className).toBe('scratch-falsy-container');
        expect(node.children[5].className).toBe('scratch-next-container');
    });

    it('should not build the statement next container when fitting.next is false', () => {
        const c = new ScratchComponents('statement', { fitting: { next: true } });
        expect(c.getDOMNode().children[3].className).toBe('scratch-next-container');

        const d = new ScratchComponents('statement', { fitting: { next: false } });
        expect(d.getDOMNode().children[3]).toBe(undefined);
    });

    it('should not build the truthyBlock next container when fitting.next is false', () => {
        const c = new ScratchComponents('truthyBlock', { fitting: { next: true } });
        expect(c.getDOMNode().children[4].className).toBe('scratch-next-container');

        const d = new ScratchComponents('truthyBlock', { fitting: { next: false } });
        expect(d.getDOMNode().children[4]).toBe(undefined);
    });

    it('should allow attribute insertion', () => {
        const c = new ScratchComponents('statement', {
            attributes: {
                class: 'statement-class',
                id: 'statement-tag',
                'data-status': 'testing',
            },
        });

        expect(c.getDOMNode().className).toBe('statement-class');
        expect(c.getDOMNode().id).toBe('statement-tag');
        expect(c.getDOMNode().getAttribute('data-status')).toBe('testing');
    });

    it('should allow style modification', () => {
        const c = new ScratchComponents('statement', {
            attributes: {
                style: {
                    width: '123px',
                    'line-height': '37px',
                    'stroke-width': '3px',
                    'background-color': 'rgb(50, 100, 200)',
                },
            },
        });

        const style = window.getComputedStyle(c.getDOMNode());
        expect(style.width).toBe('123px');
        expect(style.lineHeight).toBe('37px');
        expect(style.strokeWidth).toBe('3px');
        expect(style.backgroundColor).toBe('rgb(50, 100, 200)');
    });
});

describe('Add component', () => {
    
});