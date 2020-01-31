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
});
