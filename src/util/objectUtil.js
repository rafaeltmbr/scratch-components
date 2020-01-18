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
}

export default objectUtil;
