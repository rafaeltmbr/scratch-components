/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import ScratchComponents from '../../src/ScratchComponent';
import defaults from '../../src/ScratchComponentDefaults';

describe('Component creation', () => {
    it('should throw an error when the shape type is not specified', () => {
        expect(() => new ScratchComponents()).toThrow();
        expect(() => new ScratchComponents('')).toThrow();
        expect(() => new ScratchComponents('events')).toThrow();
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
        expect(c._opt).toEqual(defaults);
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

        expect(c._opt).not.toEqual(defaults);
        expect(c._opt.fitting.next).toBeFalsy();
        expect(c._opt.attributes.style.width).toBe('200px');
    });

    it('should support copy constructor', () => {
        const c1 = new ScratchComponents('truthyFalsyBlock', {
            attributes: { class: 'truthy-falsy-block' },
            fitting: { next: false },
        });

        expect(() => new ScratchComponents(c1)).not.toThrow();
        const c2 = new ScratchComponents(c1);

        expect(c2._id).toBeGreaterThan(c1._id);
        expect(c2._shapeName).toBe(c1._shapeName);
        expect(c1._opt).toEqual(c2._opt);
        expect(c1._dimensions).toEqual(c2._dimensions);
        expect(c1).not.toBe(c2);
        expect(c2._opt).not.toBe(c1._opt);
        expect(c2._dimensions).not.toBe(c1._dimensions);
    });

    it('should build the right DOM to the statement component', () => {
        const c = new ScratchComponents('statement');
        const node = c.getDOMNode();
        expect(node).toBeInstanceOf(Element);
        expect(node.children.length).toBe(4);
        expect(node.children[0].tagName).toBe('svg');
        expect(node.children[1].className).toBe('scratch-previous-container');
        expect(node.children[2].className).toBe('scratch-description-container');
        expect(node.children[3].className).toBe('scratch-next-container');
    });

    it('should build the right DOM to the event component', () => {
        const c = new ScratchComponents('event');
        const node = c.getDOMNode();
        expect(node).toBeInstanceOf(Element);
        expect(node.children.length).toBe(4);
        expect(node.children[0].tagName).toBe('svg');
        expect(node.children[1].className).toBe('scratch-previous-container');
        expect(node.children[2].className).toBe('scratch-description-container');
        expect(node.children[3].className).toBe('scratch-next-container');
    });

    it('should build the right DOM to the function component', () => {
        const c = new ScratchComponents('function');
        const node = c.getDOMNode();
        expect(node).toBeInstanceOf(Element);
        expect(node.children.length).toBe(4);
        expect(node.children[0].tagName).toBe('svg');
        expect(node.children[1].className).toBe('scratch-previous-container');
        expect(node.children[2].className).toBe('scratch-description-container');
        expect(node.children[3].className).toBe('scratch-next-container');
    });

    it('should build the right DOM to the truthyBlock component', () => {
        const c = new ScratchComponents('truthyBlock');
        const node = c.getDOMNode();
        expect(node).toBeInstanceOf(Element);
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
        expect(node).toBeInstanceOf(Element);
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
        expect(d.getDOMNode().children[3]).toBeUndefined();
    });

    it('should not build the truthyBlock next container when fitting.next is false', () => {
        const c = new ScratchComponents('truthyBlock', { fitting: { next: true } });
        expect(c.getDOMNode().children[4].className).toBe('scratch-next-container');

        const d = new ScratchComponents('truthyBlock', { fitting: { next: false } });
        expect(d.getDOMNode().children[4]).toBeUndefined();
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

describe('Component addition', () => {
    it('should add next component', () => {
        const parent = new ScratchComponents('event');
        const child = new ScratchComponents('statement');

        const parentNextContainer = parent._containers.next;
        const childNode = child.getDOMNode();

        expect(parent.getChildren().next).toBeNull();
        expect(child.getParent()).toBeNull();
        expect(parentNextContainer.children[0]).toBeUndefined();

        expect(parent.addNext(child)).toBeTruthy();
        expect(parent.getChildren().next).toBe(child);
        expect(parentNextContainer.children[0]).toBe(childNode);
    });

    it('should add only instances from the ScratchComponent class', () => {
        const parent = new ScratchComponents('event');
        const parentNextContainer = parent._containers.next;

        expect(parent.getChildren().next).toBeNull();
        expect(parentNextContainer.children[0]).toBeUndefined();

        expect(parent.addNext({})).toBeFalsy();
        expect(parent.getChildren().next).toBeNull();
        expect(parentNextContainer.children[0]).toBeUndefined();
    });

    it('should not add itself', () => {
        const parent = new ScratchComponents('event');
        const parentNextContainer = parent._containers.next;

        expect(parent.getChildren().next).toBeNull();
        expect(parent.getParent()).toBeNull();
        expect(parentNextContainer.children[0]).toBeUndefined();

        expect(parent.addNext(parent)).toBeFalsy();
        expect(parent.getChildren().next).toBeNull();
        expect(parent.getParent()).toBeNull();
        expect(parentNextContainer.children[0]).toBeUndefined();
    });

    it('should not add a next component when fitting.next = false', () => {
        const statement = new ScratchComponents('statement', { fitting: { next: false } });
        const truthyBlock = new ScratchComponents('truthyBlock', { fitting: { next: false } });
        const truthyFalsyBlock = new ScratchComponents('truthyFalsyBlock');

        expect(statement.getChildren().next).toBeNull();
        expect(truthyBlock.getChildren().next).toBeNull();
        expect(truthyFalsyBlock.getParent()).toBeNull();
        expect(statement._containers.next).toBeNull();
        expect(truthyBlock._containers.next).toBeNull();
        expect(truthyFalsyBlock._addElements.previous).toBeTruthy();

        expect(statement.addNext(truthyFalsyBlock)).toBeFalsy();
        expect(statement.getChildren().next).toBeNull();
        expect(statement._containers.next).toBeNull();
        expect(truthyFalsyBlock.getParent()).toBeNull();

        expect(truthyBlock.addNext(truthyFalsyBlock)).toBeFalsy();
        expect(truthyBlock.getChildren().next).toBeNull();
        expect(truthyBlock._containers.next).toBeNull();
        expect(truthyFalsyBlock.getParent()).toBeNull();
    });

    it('should always add a next component on truthyFlasy, function and event', () => {
        const statement1 = new ScratchComponents('statement');
        const statement2 = new ScratchComponents('statement');
        const statement3 = new ScratchComponents('statement');
        const event = new ScratchComponents('event', { fitting: { next: false } });
        const function_ = new ScratchComponents('function', { fitting: { next: false } });
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock', { fitting: { next: false } });

        expect(event.getChildren().next).toBeNull();
        expect(event.addNext(statement1)).toBeTruthy();
        expect(event.getChildren().next).toBe(statement1);

        expect(function_.getChildren().next).toBeNull();
        expect(function_.addNext(statement2)).toBeTruthy();
        expect(function_.getChildren().next).toBe(statement2);

        expect(truthyFalsy.getChildren().next).toBeNull();
        expect(truthyFalsy.addNext(statement3)).toBeTruthy();
        expect(truthyFalsy.getChildren().next).toBe(statement3);
    });

    it('should add truthy child in truthyBlock and truthyFalsyBlock', () => {
        const truthy = new ScratchComponents('truthyBlock');
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const statement = new ScratchComponents('statement');

        expect(truthy.getChildren().truthy).toBeNull();
        expect(truthyFalsy.getChildren().truthy).toBeNull();
        expect(statement.getParent()).toBeNull();

        expect(truthy.addTruthy(statement)).toBeTruthy();
        expect(truthy.getChildren().truthy).toBe(statement);
        expect(statement.getParent()).toBe(truthy);

        expect(truthy.removeTruthy()).toBeTruthy();
        expect(truthy.getChildren().truthy).toBeNull();
        expect(statement.getParent()).toBeNull();

        expect(truthyFalsy.addTruthy(statement)).toBeTruthy();
        expect(truthyFalsy.getChildren().truthy).toBe(statement);
        expect(statement.getParent()).toBe(truthyFalsy);
    });

    it('should add falsy child in the truthyFalsyBlock', () => {
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const statement = new ScratchComponents('statement');

        expect(truthyFalsy.getChildren().falsy).toBeNull();
        expect(statement.getParent()).toBeNull();

        expect(truthyFalsy.addFalsy(statement)).toBeTruthy();
        expect(truthyFalsy.getChildren().falsy).toBe(statement);
        expect(statement.getParent()).toBe(truthyFalsy);
    });

    it('should not add truthy child in components that cannot have it', () => {
        const event = new ScratchComponents('event');
        const function_ = new ScratchComponents('function');
        const statement = new ScratchComponents('event');
        const truthy = new ScratchComponents('truthyBlock');

        expect(event.getChildren().truthy).toBeNull();
        expect(function_.getChildren().truthy).toBeNull();
        expect(statement.getChildren().truthy).toBeNull();
        expect(truthy.getParent()).toBeNull();

        expect(event.addTruthy(truthy)).toBeFalsy();
        expect(event.getChildren().truthy).toBeNull();
        expect(truthy.getParent()).toBeNull();

        expect(function_.addTruthy(truthy)).toBeFalsy();
        expect(function_.getChildren().truthy).toBeNull();
        expect(truthy.getParent()).toBeNull();

        expect(statement.addTruthy(truthy)).toBeFalsy();
        expect(statement.getChildren().truthy).toBeNull();
        expect(truthy.getParent()).toBeNull();
    });

    it('should not add falsy child in components that cannot have it', () => {
        const event = new ScratchComponents('event');
        const function_ = new ScratchComponents('function');
        const statement = new ScratchComponents('event');
        const truthy = new ScratchComponents('truthyBlock');
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');

        expect(event.getChildren().falsy).toBeNull();
        expect(function_.getChildren().falsy).toBeNull();
        expect(statement.getChildren().falsy).toBeNull();
        expect(truthy.getChildren().falsy).toBeNull();
        expect(truthyFalsy.getParent()).toBeNull();

        expect(event.addFalsy(truthyFalsy)).toBeFalsy();
        expect(event.getChildren().falsy).toBeNull();
        expect(truthyFalsy.getParent()).toBeNull();

        expect(function_.addFalsy(truthyFalsy)).toBeFalsy();
        expect(function_.getChildren().falsy).toBeNull();
        expect(truthyFalsy.getParent()).toBeNull();

        expect(statement.addFalsy(truthyFalsy)).toBeFalsy();
        expect(statement.getChildren().falsy).toBeNull();
        expect(truthyFalsy.getParent()).toBeNull();

        expect(truthy.addFalsy(truthyFalsy)).toBeFalsy();
        expect(truthy.getChildren().falsy).toBeNull();
        expect(truthyFalsy.getParent()).toBeNull();
    });

    it('should not add previous component in function and event blocks', () => {
        const function_ = new ScratchComponents('function');
        const event = new ScratchComponents('event');
        const truthy = new ScratchComponents('truthyBlock');
        const statement = new ScratchComponents('statement');

        expect(statement.getChildren().next).toBeNull();
        expect(function_.getParent()).toBeNull();

        expect(statement.addNext(function_)).toBeFalsy();
        expect(statement.getChildren().next).toBeNull();
        expect(function_.getParent()).toBeNull();

        expect(statement.addNext(event)).toBeFalsy();
        expect(statement.getChildren().next).toBeNull();
        expect(event.getParent()).toBeNull();

        expect(statement.addNext(truthy)).toBeTruthy();
        expect(statement.getChildren().next).toBe(truthy);
        expect(truthy.getParent()).toBe(statement);
    });

    it('should add a copy without change the original instance', () => {
        const statement = new ScratchComponents('statement');
        const function_ = new ScratchComponents('function');
        const statementCopy = new ScratchComponents(statement);

        expect(function_.getChildren().next).toBeNull();
        expect(statement.getParent()).toBeNull();
        expect(statementCopy.getParent()).toBeNull();

        expect(function_.addNext(statementCopy)).toBeTruthy();
        expect(function_.getChildren().next).toBe(statementCopy);
        expect(statement.getParent()).toBeNull();
        expect(statementCopy.getParent()).toBe(function_);
    });

    it('should remove a node from its parent before adding it into another', () => {
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const event = new ScratchComponents('event');
        const function_ = new ScratchComponents('function');

        expect(truthyFalsy.getParent()).toBeNull();
        expect(event.getChildren().next).toBeNull();
        expect(function_.getChildren().next).toBeNull();

        expect(event.addNext(truthyFalsy)).toBeTruthy();
        expect(event.getChildren().next).toBe(truthyFalsy);
        expect(truthyFalsy.getParent()).toBe(event);

        expect(function_.addNext(truthyFalsy)).toBeTruthy();
        expect(function_.getChildren().next).toBe(truthyFalsy);
        expect(truthyFalsy.getParent()).toBe(function_);
        expect(event.getChildren().next).toBeNull();
    });
});

describe('Component remotion', () => {
    it('should remove next child', () => {
        const statement = new ScratchComponents('statement');
        const event = new ScratchComponents('event');
        const function_ = new ScratchComponents('function');
        const truthy = new ScratchComponents('truthyBlock');
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const statement2 = new ScratchComponents('statement');

        expect(statement.addNext(statement2)).toBeTruthy();
        expect(statement.getChildren().next).toBe(statement2);
        expect(statement2.getParent()).toBe(statement);
        expect(statement.removeNext()).toBeTruthy();
        expect(statement.getChildren().next).toBeNull();
        expect(statement2.getParent()).toBeNull();

        expect(event.addNext(statement2)).toBeTruthy();
        expect(event.getChildren().next).toBe(statement2);
        expect(statement2.getParent()).toBe(event);
        expect(event.removeNext()).toBeTruthy();
        expect(event.getChildren().next).toBeNull();
        expect(statement2.getParent()).toBeNull();

        expect(function_.addNext(statement2)).toBeTruthy();
        expect(function_.getChildren().next).toBe(statement2);
        expect(statement2.getParent()).toBe(function_);
        expect(function_.removeNext()).toBeTruthy();
        expect(function_.getChildren().next).toBeNull();
        expect(statement2.getParent()).toBeNull();

        expect(truthy.addNext(statement2)).toBeTruthy();
        expect(truthy.getChildren().next).toBe(statement2);
        expect(statement2.getParent()).toBe(truthy);
        expect(truthy.removeNext()).toBeTruthy();
        expect(truthy.getChildren().next).toBeNull();
        expect(statement2.getParent()).toBeNull();

        expect(truthyFalsy.addNext(statement2)).toBeTruthy();
        expect(truthyFalsy.getChildren().next).toBe(statement2);
        expect(statement2.getParent()).toBe(truthyFalsy);
        expect(truthyFalsy.removeNext()).toBeTruthy();
        expect(truthyFalsy.getChildren().next).toBeNull();
        expect(statement2.getParent()).toBeNull();
    });

    it('should remove truthy child', () => {
        const truthy = new ScratchComponents('truthyBlock');
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const statement = new ScratchComponents('statement');

        expect(truthy.addTruthy(statement)).toBeTruthy();
        expect(truthy.getChildren().truthy).toBe(statement);
        expect(statement.getParent()).toBe(truthy);
        expect(truthy.removeTruthy()).toBeTruthy();
        expect(truthy.getChildren().truthy).toBeNull();
        expect(statement.getParent()).toBeNull();

        expect(truthyFalsy.addTruthy(statement)).toBeTruthy();
        expect(truthyFalsy.getChildren().truthy).toBe(statement);
        expect(statement.getParent()).toBe(truthyFalsy);
        expect(truthyFalsy.removeTruthy()).toBeTruthy();
        expect(truthyFalsy.getChildren().truthy).toBeNull();
        expect(statement.getParent()).toBeNull();
    });

    it('should remove falsy child', () => {
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const statement = new ScratchComponents('statement');

        expect(truthyFalsy.addFalsy(statement)).toBeTruthy();
        expect(truthyFalsy.getChildren().falsy).toBe(statement);
        expect(statement.getParent()).toBe(truthyFalsy);
        expect(truthyFalsy.removeFalsy()).toBeTruthy();
        expect(truthyFalsy.getChildren().falsy).toBeNull();
        expect(statement.getParent()).toBeNull();
    });

    it('should remove any child that matchs the specified one', () => {
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const statement = new ScratchComponents('statement');
        const statement2 = new ScratchComponents('statement');
        const statement3 = new ScratchComponents('statement');

        expect(truthyFalsy.addTruthy(statement)).toBeTruthy();
        expect(truthyFalsy.getChildren().truthy).toBe(statement);
        expect(statement.getParent()).toBe(truthyFalsy);
        expect(truthyFalsy.addFalsy(statement2)).toBeTruthy();
        expect(truthyFalsy.getChildren().falsy).toBe(statement2);
        expect(statement2.getParent()).toBe(truthyFalsy);
        expect(truthyFalsy.addNext(statement3)).toBeTruthy();
        expect(truthyFalsy.getChildren().next).toBe(statement3);
        expect(statement3.getParent()).toBe(truthyFalsy);

        expect(truthyFalsy.removeChild(statement)).toBeTruthy();
        expect(truthyFalsy.getChildren().truthy).toBeNull();
        expect(statement.getParent()).toBeNull();
        expect(truthyFalsy.removeChild(statement2)).toBeTruthy();
        expect(truthyFalsy.getChildren().falsy).toBeNull();
        expect(statement2.getParent()).toBeNull();
        expect(truthyFalsy.removeChild(statement3)).toBeTruthy();
        expect(truthyFalsy.getChildren().next).toBeNull();
        expect(statement3.getParent()).toBeNull();

        expect(truthyFalsy.removeChild(statement3)).toBeFalsy();
    });
});

describe('Get methods', () => {

});

describe('Event listening', () => {

});
