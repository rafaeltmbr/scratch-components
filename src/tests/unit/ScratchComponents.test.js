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
    it('should add next component', () => {
        const parent = new ScratchComponents('event');
        const child = new ScratchComponents('statement');

        const parentNextContainer = parent._containers.next;
        const childNode = child.getDOMNode();

        expect(parent._next).toBe(null);
        expect(child._parent).toBe(null);
        expect(parentNextContainer.children[0]).toBe(undefined);

        parent.addNext(child);
        expect(parent._next).toBe(child);
        expect(parentNextContainer.children[0]).toBe(childNode);
    });

    it('should add only instances from ScratchComponent class', () => {
        const parent = new ScratchComponents('event');
        const parentNextContainer = parent._containers.next;

        expect(parent._next).toBe(null);
        expect(parentNextContainer.children[0]).toBe(undefined);

        parent.addNext({});
        expect(parent._next).toBe(null);
        expect(parentNextContainer.children[0]).toBe(undefined);
    });

    it('should not add itself', () => {
        const parent = new ScratchComponents('event');
        const parentNextContainer = parent._containers.next;

        expect(parent._next).toBe(null);
        expect(parent._parent).toBe(null);
        expect(parentNextContainer.children[0]).toBe(undefined);

        parent.addNext(parent);
        expect(parent._next).toBe(null);
        expect(parent._parent).toBe(null);
        expect(parentNextContainer.children[0]).toBe(undefined);
    });

    it('should not add a next component on stament and truthyBlock', () => {
        const statement = new ScratchComponents('statement', { fitting: { next: false } });
        const truthyBlock = new ScratchComponents('truthyBlock', { fitting: { next: false } });
        const truthyFalsyBlock = new ScratchComponents('truthyFalsyBlock');

        expect(statement._next).toBe(null);
        expect(truthyBlock._next).toBe(null);
        expect(truthyFalsyBlock._parent).toBe(null);
        expect(statement._containers.next).toBe(null);
        expect(truthyBlock._containers.next).toBe(null);
        expect(truthyFalsyBlock._addElements.previous).toBe(true);

        statement.addNext(truthyFalsyBlock);
        expect(statement._next).toBe(null);
        expect(statement._containers.next).toBe(null);
        expect(truthyFalsyBlock._parent).toBe(null);

        truthyBlock.addNext(truthyFalsyBlock);
        expect(truthyBlock._next).toBe(null);
        expect(truthyBlock._containers.next).toBe(null);
        expect(truthyFalsyBlock._parent).toBe(null);
    });

    it('should always add next component on truthyFlasy, function and event', () => {
        const statement1 = new ScratchComponents('statement');
        const statement2 = new ScratchComponents('statement');
        const statement3 = new ScratchComponents('statement');
        const event = new ScratchComponents('event', { fitting: { next: false } });
        const function_ = new ScratchComponents('function', { fitting: { next: false } });
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock', { fitting: { next: false } });

        expect(event._next).toBe(null);
        event.addNext(statement1);
        expect(event._next).toBe(statement1);

        expect(function_._next).toBe(null);
        function_.addNext(statement2);
        expect(function_._next).toBe(statement2);

        expect(truthyFalsy._next).toBe(null);
        truthyFalsy.addNext(statement3);
        expect(truthyFalsy._next).toBe(statement3);
    });

    it('should add copy with change the original instance', () => {
        const statement = new ScratchComponents('statement');
        const function_ = new ScratchComponents('function');
        const statementCopy = new ScratchComponents(statement);

        expect(function_._next).toBe(null);
        expect(statement._parent).toBe(null);
        expect(statementCopy._parent).toBe(null);

        function_.addNext(statementCopy);
        expect(function_._next).toBe(statementCopy);
        expect(statement._parent).toBe(null);
        expect(statementCopy._parent).toBe(function_);
    });

    it('should remove node from parent before adding it into another', () => {
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const event = new ScratchComponents('event');
        const function_ = new ScratchComponents('function');

        expect(truthyFalsy._parent).toBe(null);
        expect(event._next).toBe(null);
        expect(function_._next).toBe(null);

        event.addNext(truthyFalsy);
        expect(event._next).toBe(truthyFalsy);
        expect(truthyFalsy._parent).toBe(event);

        function_.addNext(truthyFalsy);
        expect(function_._next).toBe(truthyFalsy);
        expect(truthyFalsy._parent).toBe(function_);
        expect(event._next).toBe(null);
    });
});
