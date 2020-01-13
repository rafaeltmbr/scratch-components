/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import ScratchSVGPath from '../util/ScratchSVGPath';
import ManipulateDOM from '../util/ManipulateDOM';
import ManipulateObject from '../util/ManipulateObject';
import defaults from './ScratchComponentDefaults';

export default class ScratchComponent {
    constructor(componentType, options = {}) {
        this._type = componentType;
        this._truthyChild = null;
        this._falsyChild = null;

        this._assingOptions(options);
        this._createComponent(componentType);

        this._svg = this._node.children[0];
        this._truthyChildContainer = this._node.children[1];
        this._falsyChildContainer = this._node.children[2];
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
        this._opt.dimensions.fittingHeight = dimensions.fittingHeight;
    }

    static createSVGElementInnerHTML(path, dimensions, options) {
        const attributes = ScratchComponent.convertAttributesToHTML(options.attributes);
        const childrenContainer = ScratchComponent.createChildContainers(dimensions);

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

    static createChildContainers(dimensions) {
        const {
            truthyChildContainer: tcc,
            falsyChildContainer: fcc,
        } = dimensions;

        const tccHTML = (
            ScratchComponent.createContainerHTML('scratch-truthy-children-container', tcc));

        const fccHTML = (
            ScratchComponent.createContainerHTML('scratch-falsy-children-container', fcc));

        const containersHTML = tccHTML + fccHTML;

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
            width: this._opt.dimensions.width,
            height: this._opt.dimensions.height,
            fittingHeight: this._opt.dimensions.fittingHeight,
        };
    }

    setPosition({ top, left }) {
        if (typeof top === 'number' && top >= 0) {
            this._opt.position.top = top;
            this._node.style.setProperty('top', `${top}px`);
        }

        if (typeof left === 'number' && left >= 0) {
            this._opt.position.left = left;
            this._node.style.setProperty('left', `${left}px`);
        }
    }

    getPosition() {
        return {
            top: this._opt.position.top,
            left: this._opt.position.left,
        };
    }

    addTruthyChild(child) {
        if (!(child instanceof ScratchComponent)) return;

        this.removeTruthyChild();
        this._truthyChild = child;
        this._truthyChildContainer.appendChild(child._node);
        this._truthyChildContainerHeightBackup = this._opt.dimensions.truthyChildContainerHeight;
        this.resize({ truthyChildContainerHeight: child.getDimensions().fittingHeight });
        child.setPosition({ top: 0, left: 0 });
    }

    removeTruthyChild() {
        if (this._truthyChild) {
            this._truthyChildContainer.removeChild(this._truthyChildContainer.children[0]);
            this._truthyChild = null;
            this.resize({ truthyChildContainerHeight: this._truthyChildContainerHeightBackup });
        }
    }

    resize(dimensions) {
        if (!ManipulateObject.isObject(dimensions)) return;

        ManipulateObject.objectMerge(this._opt.dimensions, dimensions);
        const { path, dimensions: dim } = ScratchSVGPath[this._type](this._opt);

        this._node.style.setProperty('width', `${dim.width}px`);
        this._node.style.setProperty('height', `${dim.height}px`);

        this._svg.setAttribute('stroke-width', dim.strokeWidth);
        this._svg.children[0].setAttribute('d', path);

        this._resizeChildContainers(dim);
    }

    _resizeChildContainers(dim) {
        const {
            truthyChildContainer: tcc,
            falsyChildContainer: fcc,
        } = dim;

        if (this._truthyChildContainer) {
            this._truthyChildContainer.style.setProperty('height', `${tcc.height}px`);
            this._truthyChildContainer.style.setProperty('width', `${tcc.width}px`);
        }

        if (this._falsyChildContainer) {
            this._falsyChildContainer.style.setProperty('height', `${fcc.height}px`);
            this._falsyChildContainer.style.setProperty('width', `${fcc.width}px`);
        }
    }
}
