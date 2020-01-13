/* eslint-disable no-underscore-dangle */
import ScratchSVGPath from '../util/ScratchSVGPath';
import ManipulateDOM from '../util/ManipulateDOM';
import ManipulateObject from '../util/ManipulateObject';
import defaults from './ScratchComponentDefaults';

export default class ScratchComponent {
    constructor(componentType, options = {}) {
        window.objectHardCopy = ManipulateObject.objectHardCopy;
        window.objectMerge = ManipulateObject.objectMerge;
        this._assingOptions(options);
        this._createComponent(componentType);
    }

    _assingOptions(options) {
        this._opt = {};
        ManipulateObject.objectHardCopy(this._opt, defaults);

        const optionsCopy = {};
        ManipulateObject.objectHardCopy(optionsCopy, options);
        ManipulateObject.objectMerge(this._opt, optionsCopy);
    }

    _createComponent(type) {
        const { path, dimensions } = ScratchSVGPath[type](this._opt);
        const html = ScratchComponent.createSVGElementInnerHTML(path, dimensions, this._opt);
        this._node = ManipulateDOM.createNodeElement(html);
        this._opt.dimensions.height = dimensions.height;
    }

    static createSVGElementInnerHTML(path, dimensions, options) {
        const attributes = ScratchComponent.convertAttributesToHTML(options.attributes);
        const childrenContainer = ScratchComponent.createChildrenContainers(dimensions);

        const innerHTML = (
            `<div ${attributes} style="width: ${dimensions.width}px; height: ${dimensions.height}px; `
            + `top: ${options.position.top}px; left: ${options.position.left}px; position: absolute;">`
            + `<svg stroke-width="${dimensions.strokeWidth}" style="width: 100%; height: 100%">`
            + `<path d="${path}" /></svg>`
            + `${childrenContainer}</div>`
        );

        return innerHTML;
    }

    static convertAttributesToHTML(attributes) {
        const html = Object.keys(attributes).map((k) => `${k}="${attributes[k]}"`).join(' ');
        return html;
    }

    static createChildrenContainers(dimensions) {
        const {
            childrenContainer: cc,
            truthyChildrenContainer: tcc,
            falsyChildrenContainer: fcc,
        } = dimensions;

        const ccHTML = (
            ScratchComponent.createContainerHTML('scratch-children-container', cc));

        const tccHTML = (
            ScratchComponent.createContainerHTML('scratch-truthy-children-container', tcc));

        const fccHTML = (
            ScratchComponent.createContainerHTML('scratch-falsy-children-container', fcc));

        const containersHTML = ccHTML + tccHTML + fccHTML;

        return containersHTML;
    }

    static createContainerHTML(className, dimensions) {
        const containerHTML = (dimensions ? (
            `<div class="${className || ''}" style="position: absolute; `
            + `width: ${dimensions.width}px; `
            + `height: ${dimensions.height}px; `
            + `top: ${dimensions.top}px; `
            + `left: ${dimensions.left}px"></div>`
        ) : '');

        return containerHTML;
    }

    getNodeElement() {
        return this._node;
    }

    getDimensions() {
        return {
            top: this._opt.position.top,
            left: this._opt.position.left,
            width: this._opt.dimensions.width,
            height: this._opt.dimensions.height,
        };
    }
}
