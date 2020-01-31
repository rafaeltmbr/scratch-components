/* eslint-disable no-param-reassign */
class objectUtil {
    static deepCopy(dst, src) {
        Object.keys(src).forEach((k) => {
            if (objectUtil.isArray(src[k])) {
                dst[k] = src[k].map((e) => e);
            } else if (objectUtil.isObject(src[k])) {
                objectUtil.deepCopy(dst[k] = {}, src[k]);
            } else {
                dst[k] = src[k];
            }
        });
    }

    static merge(dst, src) {
        Object.keys(src).forEach((k) => {
            if (objectUtil.isObject(src[k])) {
                if (!objectUtil.isObject(dst[k])) {
                    dst[k] = {};
                }

                objectUtil.merge(dst[k], src[k]);
            } else {
                dst[k] = src[k];
            }
        });
    }

    static toArray(object) {
        return Object.keys(object).map((k) => object[k]);
    }

    /* eslint-enable no-param-reassign */
    static deepClone(object) {
        const clone = {};
        objectUtil.deepCopy(clone, object);
        return clone;
    }


    static isObject(data) {
        return (data !== null) && (typeof data === 'object') && (!Array.isArray(data));
    }

    static isArray(data) {
        return Array.isArray(data) && typeof data === 'object';
    }

    static hasTheSamePropertiesAndValues(obj1, obj2) {
        if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;

        const prop1 = objectUtil.toArray(obj1);
        const prop2 = objectUtil.toArray(obj2);

        if (prop1.length !== prop2.length) return false;

        const comp = prop1.map((p, index) => objectUtil
            .hasTheSamePropertiesAndValues(p, prop2[index]));
        return comp ? comp.reduce((acc = true, v) => v && acc) : true;
    }
}

export default objectUtil;
