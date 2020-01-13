/* eslint-disable no-param-reassign */
class ManipulateObject {
    static objectHardCopy(dst, src) {
        Object.keys(src).forEach((k) => {
            if (ManipulateObject.isArray(src[k])) {
                dst[k] = src[k].map((e) => e);
            } else if (ManipulateObject.isObject(src[k])) {
                ManipulateObject.objectHardCopy(dst[k] = {}, src[k]);
            } else {
                dst[k] = src[k];
            }
        });
    }

    static objectMerge(dst, src) {
        Object.keys(src).forEach((k) => {
            if (ManipulateObject.isObject(src[k])) {
                if (!ManipulateObject.isObject(dst[k])) {
                    dst[k] = {};
                }

                ManipulateObject.objectMerge(dst[k], src[k]);
            } else {
                dst[k] = src[k];
            }
        });
    }

    static isObject(data) {
        return (data !== null) && (typeof data === 'object') && (!Array.isArray(data));
    }

    static isArray(data) {
        return Array.isArray(data) && typeof data === 'object';
    }
}

export default ManipulateObject;
