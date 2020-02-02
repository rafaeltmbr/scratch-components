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

describe('Component addition', () => {
    it('should add next component', () => {
        const parent = new ScratchComponents('event');
        const child = new ScratchComponents('statement');

        const parentNextContainer = parent._containers.next;
        const childNode = child.getDOMNode();

        expect(parent.getChildren().next).toBe(null);
        expect(child.getParent()).toBe(null);
        expect(parentNextContainer.children[0]).toBe(undefined);

        expect(parent.addNext(child)).toBe(true);
        expect(parent.getChildren().next).toBe(child);
        expect(parentNextContainer.children[0]).toBe(childNode);
    });

    it('should add only instances from the ScratchComponent class', () => {
        const parent = new ScratchComponents('event');
        const parentNextContainer = parent._containers.next;

        expect(parent.getChildren().next).toBe(null);
        expect(parentNextContainer.children[0]).toBe(undefined);

        expect(parent.addNext({})).toBe(false);
        expect(parent.getChildren().next).toBe(null);
        expect(parentNextContainer.children[0]).toBe(undefined);
    });

    it('should not add itself', () => {
        const parent = new ScratchComponents('event');
        const parentNextContainer = parent._containers.next;

        expect(parent.getChildren().next).toBe(null);
        expect(parent.getParent()).toBe(null);
        expect(parentNextContainer.children[0]).toBe(undefined);

        expect(parent.addNext(parent)).toBe(false);
        expect(parent.getChildren().next).toBe(null);
        expect(parent.getParent()).toBe(null);
        expect(parentNextContainer.children[0]).toBe(undefined);
    });

    it('should not add a next component when fitting.next = false', () => {
        const statement = new ScratchComponents('statement', { fitting: { next: false } });
        const truthyBlock = new ScratchComponents('truthyBlock', { fitting: { next: false } });
        const truthyFalsyBlock = new ScratchComponents('truthyFalsyBlock');

        expect(statement.getChildren().next).toBe(null);
        expect(truthyBlock.getChildren().next).toBe(null);
        expect(truthyFalsyBlock.getParent()).toBe(null);
        expect(statement._containers.next).toBe(null);
        expect(truthyBlock._containers.next).toBe(null);
        expect(truthyFalsyBlock._addElements.previous).toBe(true);

        expect(statement.addNext(truthyFalsyBlock)).toBe(false);
        expect(statement.getChildren().next).toBe(null);
        expect(statement._containers.next).toBe(null);
        expect(truthyFalsyBlock.getParent()).toBe(null);

        expect(truthyBlock.addNext(truthyFalsyBlock)).toBe(false);
        expect(truthyBlock.getChildren().next).toBe(null);
        expect(truthyBlock._containers.next).toBe(null);
        expect(truthyFalsyBlock.getParent()).toBe(null);
    });

    it('should always add a next component on truthyFlasy, function and event', () => {
        const statement1 = new ScratchComponents('statement');
        const statement2 = new ScratchComponents('statement');
        const statement3 = new ScratchComponents('statement');
        const event = new ScratchComponents('event', { fitting: { next: false } });
        const function_ = new ScratchComponents('function', { fitting: { next: false } });
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock', { fitting: { next: false } });

        expect(event.getChildren().next).toBe(null);
        expect(event.addNext(statement1)).toBe(true);
        expect(event.getChildren().next).toBe(statement1);

        expect(function_.getChildren().next).toBe(null);
        expect(function_.addNext(statement2)).toBe(true);
        expect(function_.getChildren().next).toBe(statement2);

        expect(truthyFalsy.getChildren().next).toBe(null);
        expect(truthyFalsy.addNext(statement3)).toBe(true);
        expect(truthyFalsy.getChildren().next).toBe(statement3);
    });

    it('should add truthy child in truthyBlock and truthyFalsyBlock', () => {
        const truthy = new ScratchComponents('truthyBlock');
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const statement = new ScratchComponents('statement');

        expect(truthy.getChildren().truthy).toBe(null);
        expect(truthyFalsy.getChildren().truthy).toBe(null);
        expect(statement.getParent()).toBe(null);

        expect(truthy.addTruthy(statement)).toBe(true);
        expect(truthy.getChildren().truthy).toBe(statement);
        expect(statement.getParent()).toBe(truthy);

        expect(truthy.removeTruthy()).toBe(true);
        expect(truthy.getChildren().truthy).toBe(null);
        expect(statement.getParent()).toBe(null);

        expect(truthyFalsy.addTruthy(statement)).toBe(true);
        expect(truthyFalsy.getChildren().truthy).toBe(statement);
        expect(statement.getParent()).toBe(truthyFalsy);
    });

    it('should add falsy child in the truthyFalsyBlock', () => {
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const statement = new ScratchComponents('statement');

        expect(truthyFalsy.getChildren().falsy).toBe(null);
        expect(statement.getParent()).toBe(null);

        expect(truthyFalsy.addFalsy(statement)).toBe(true);
        expect(truthyFalsy.getChildren().falsy).toBe(statement);
        expect(statement.getParent()).toBe(truthyFalsy);
    });

    it('should not add truthy child in components that cannot have it', () => {
        const event = new ScratchComponents('event');
        const function_ = new ScratchComponents('function');
        const statement = new ScratchComponents('event');
        const truthy = new ScratchComponents('truthyBlock');

        expect(event.getChildren().truthy).toBe(null);
        expect(function_.getChildren().truthy).toBe(null);
        expect(statement.getChildren().truthy).toBe(null);
        expect(truthy.getParent()).toBe(null);

        expect(event.addTruthy(truthy)).toBe(false);
        expect(event.getChildren().truthy).toBe(null);
        expect(truthy.getParent()).toBe(null);

        expect(function_.addTruthy(truthy)).toBe(false);
        expect(function_.getChildren().truthy).toBe(null);
        expect(truthy.getParent()).toBe(null);

        expect(statement.addTruthy(truthy)).toBe(false);
        expect(statement.getChildren().truthy).toBe(null);
        expect(truthy.getParent()).toBe(null);
    });

    it('should not add falsy child in components that cannot have it', () => {
        const event = new ScratchComponents('event');
        const function_ = new ScratchComponents('function');
        const statement = new ScratchComponents('event');
        const truthy = new ScratchComponents('truthyBlock');
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');

        expect(event.getChildren().falsy).toBe(null);
        expect(function_.getChildren().falsy).toBe(null);
        expect(statement.getChildren().falsy).toBe(null);
        expect(truthy.getChildren().falsy).toBe(null);
        expect(truthyFalsy.getParent()).toBe(null);

        expect(event.addFalsy(truthyFalsy)).toBe(false);
        expect(event.getChildren().falsy).toBe(null);
        expect(truthyFalsy.getParent()).toBe(null);

        expect(function_.addFalsy(truthyFalsy)).toBe(false);
        expect(function_.getChildren().falsy).toBe(null);
        expect(truthyFalsy.getParent()).toBe(null);

        expect(statement.addFalsy(truthyFalsy)).toBe(false);
        expect(statement.getChildren().falsy).toBe(null);
        expect(truthyFalsy.getParent()).toBe(null);

        expect(truthy.addFalsy(truthyFalsy)).toBe(false);
        expect(truthy.getChildren().falsy).toBe(null);
        expect(truthyFalsy.getParent()).toBe(null);
    });

    it('should not add previous component in function and event blocks', () => {
        const function_ = new ScratchComponents('function');
        const event = new ScratchComponents('event');
        const truthy = new ScratchComponents('truthyBlock');
        const statement = new ScratchComponents('statement');

        expect(statement.getChildren().next).toBe(null);
        expect(function_.getParent()).toBe(null);

        expect(statement.addNext(function_)).toBe(false);
        expect(statement.getChildren().next).toBe(null);
        expect(function_.getParent()).toBe(null);

        expect(statement.addNext(event)).toBe(false);
        expect(statement.getChildren().next).toBe(null);
        expect(event.getParent()).toBe(null);

        expect(statement.addNext(truthy)).toBe(true);
        expect(statement.getChildren().next).toBe(truthy);
        expect(truthy.getParent()).toBe(statement);
    });

    it('should add a copy without change the original instance', () => {
        const statement = new ScratchComponents('statement');
        const function_ = new ScratchComponents('function');
        const statementCopy = new ScratchComponents(statement);

        expect(function_.getChildren().next).toBe(null);
        expect(statement.getParent()).toBe(null);
        expect(statementCopy.getParent()).toBe(null);

        expect(function_.addNext(statementCopy)).toBe(true);
        expect(function_.getChildren().next).toBe(statementCopy);
        expect(statement.getParent()).toBe(null);
        expect(statementCopy.getParent()).toBe(function_);
    });

    it('should remove a node from its parent before adding it into another', () => {
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const event = new ScratchComponents('event');
        const function_ = new ScratchComponents('function');

        expect(truthyFalsy.getParent()).toBe(null);
        expect(event.getChildren().next).toBe(null);
        expect(function_.getChildren().next).toBe(null);

        expect(event.addNext(truthyFalsy)).toBe(true);
        expect(event.getChildren().next).toBe(truthyFalsy);
        expect(truthyFalsy.getParent()).toBe(event);

        expect(function_.addNext(truthyFalsy)).toBe(true);
        expect(function_.getChildren().next).toBe(truthyFalsy);
        expect(truthyFalsy.getParent()).toBe(function_);
        expect(event.getChildren().next).toBe(null);
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

        expect(statement.addNext(statement2)).toBe(true);
        expect(statement.getChildren().next).toBe(statement2);
        expect(statement2.getParent()).toBe(statement);
        expect(statement.removeNext()).toBe(true);
        expect(statement.getChildren().next).toBe(null);
        expect(statement2.getParent()).toBe(null);

        expect(event.addNext(statement2)).toBe(true);
        expect(event.getChildren().next).toBe(statement2);
        expect(statement2.getParent()).toBe(event);
        expect(event.removeNext()).toBe(true);
        expect(event.getChildren().next).toBe(null);
        expect(statement2.getParent()).toBe(null);

        expect(function_.addNext(statement2)).toBe(true);
        expect(function_.getChildren().next).toBe(statement2);
        expect(statement2.getParent()).toBe(function_);
        expect(function_.removeNext()).toBe(true);
        expect(function_.getChildren().next).toBe(null);
        expect(statement2.getParent()).toBe(null);

        expect(truthy.addNext(statement2)).toBe(true);
        expect(truthy.getChildren().next).toBe(statement2);
        expect(statement2.getParent()).toBe(truthy);
        expect(truthy.removeNext()).toBe(true);
        expect(truthy.getChildren().next).toBe(null);
        expect(statement2.getParent()).toBe(null);

        expect(truthyFalsy.addNext(statement2)).toBe(true);
        expect(truthyFalsy.getChildren().next).toBe(statement2);
        expect(statement2.getParent()).toBe(truthyFalsy);
        expect(truthyFalsy.removeNext()).toBe(true);
        expect(truthyFalsy.getChildren().next).toBe(null);
        expect(statement2.getParent()).toBe(null);
    });

    it('should remove truthy child', () => {
        const truthy = new ScratchComponents('truthyBlock');
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const statement = new ScratchComponents('statement');

        expect(truthy.addTruthy(statement)).toBe(true);
        expect(truthy.getChildren().truthy).toBe(statement);
        expect(statement.getParent()).toBe(truthy);
        expect(truthy.removeTruthy()).toBe(true);
        expect(truthy.getChildren().truthy).toBe(null);
        expect(statement.getParent()).toBe(null);

        expect(truthyFalsy.addTruthy(statement)).toBe(true);
        expect(truthyFalsy.getChildren().truthy).toBe(statement);
        expect(statement.getParent()).toBe(truthyFalsy);
        expect(truthyFalsy.removeTruthy()).toBe(true);
        expect(truthyFalsy.getChildren().truthy).toBe(null);
        expect(statement.getParent()).toBe(null);
    });

    it('should remove falsy child', () => {
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const statement = new ScratchComponents('statement');

        expect(truthyFalsy.addFalsy(statement)).toBe(true);
        expect(truthyFalsy.getChildren().falsy).toBe(statement);
        expect(statement.getParent()).toBe(truthyFalsy);
        expect(truthyFalsy.removeFalsy()).toBe(true);
        expect(truthyFalsy.getChildren().falsy).toBe(null);
        expect(statement.getParent()).toBe(null);
    });

    it('should remove any child that matchs the specified one', () => {
        const truthyFalsy = new ScratchComponents('truthyFalsyBlock');
        const statement = new ScratchComponents('statement');
        const statement2 = new ScratchComponents('statement');
        const statement3 = new ScratchComponents('statement');

        expect(truthyFalsy.addTruthy(statement)).toBe(true);
        expect(truthyFalsy.getChildren().truthy).toBe(statement);
        expect(statement.getParent()).toBe(truthyFalsy);
        expect(truthyFalsy.addFalsy(statement2)).toBe(true);
        expect(truthyFalsy.getChildren().falsy).toBe(statement2);
        expect(statement2.getParent()).toBe(truthyFalsy);
        expect(truthyFalsy.addNext(statement3)).toBe(true);
        expect(truthyFalsy.getChildren().next).toBe(statement3);
        expect(statement3.getParent()).toBe(truthyFalsy);

        expect(truthyFalsy.removeChild(statement)).toBe(true);
        expect(truthyFalsy.getChildren().truthy).toBe(null);
        expect(statement.getParent()).toBe(null);
        expect(truthyFalsy.removeChild(statement2)).toBe(true);
        expect(truthyFalsy.getChildren().falsy).toBe(null);
        expect(statement2.getParent()).toBe(null);
        expect(truthyFalsy.removeChild(statement3)).toBe(true);
        expect(truthyFalsy.getChildren().next).toBe(null);
        expect(statement3.getParent()).toBe(null);

        expect(truthyFalsy.removeChild(statement3)).toBe(false);
    });
});

describe('Get methods', () => {

});

describe('Event listening', () => {

});
