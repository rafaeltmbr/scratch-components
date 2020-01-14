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
        this._nextComponent = null;
        this._resizeListeners = [];
        this._truthyChildResizeHandlerBinded = this._truthyChildResizeHandler.bind(this);
        this._falsyChildResizeHandlerBinded = this._falsyChildResizeHandler.bind(this);
        this._nextComponentResizeHandlerBinded = this._nextComponentResizeHandler.bind(this);

        this._assingOptions(options);
        this._createComponent(componentType);

        const childrenLength = this._node.children.length;
        this._svg = this._node.children[0];
        this._truthyChildContainer = childrenLength > 2 ? this._node.children[1] : null;
        this._falsyChildContainer = childrenLength > 3 ? this._node.children[2] : null;
        this._nextComponentContainer = this._node.children[childrenLength - 1];
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
        this._updateDimensions(dimensions);
    }

    static createSVGElementInnerHTML(path, dimensions, options) {
        const attributes = ScratchComponent.convertAttributesToHTML(options.attributes);
        const childrenContainer = ScratchComponent.createChildContainers(dimensions);

        const innerHTML = (
            `<div ${attributes} style="width: ${dimensions.width}px; height: ${dimensions.height}px; `
            + `top: ${options.position.top}px; left: ${options.position.left}px; position: absolute;">`
            + `<svg stroke-width="${dimensions.strokeWidth}" style="width: 100%; height: 100%">`
            + `<path d="${path}" /></svg>`
            + `${childrenContainer}<div class="scratch-next-component-container" `
            + `style="width: 100%; height: ${dimensions.strokeWidth}px; top: ${dimensions.fittingHeight}px; `
            + 'left: 0px; position: absolute;"></div></div>'
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
            fittingHeight: (
                this._opt.dimensions.fittingHeight
                + (this._nextComponent
                    ? this._nextComponent.getDimensions().fittingHeight
                    : 0)
            ),
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
        child.addResizeListener(this._truthyChildResizeHandlerBinded);
        child.setPosition({ top: 0, left: 0 });
    }

    removeTruthyChild() {
        if (this._truthyChild) {
            this._truthyChildContainer.removeChild(this._truthyChildContainer.children[0]);
            this._truthyChild = null;
            this.resize({ truthyChildContainerHeight: this._truthyChildContainerHeightBackup });
        }
    }

    addFalsyChild(child) {
        if (!(child instanceof ScratchComponent)) return;

        this.removeFalsyChild();
        this._falsyChild = child;
        this._falsyChildContainer.appendChild(child._node);
        this._falsyChildContainerHeightBackup = this._opt.dimensions.falsyChildContainerHeight;
        this.resize({ falsyChildContainerHeight: child.getDimensions().fittingHeight });
        child.addResizeListener(this._falsyChildResizeHandlerBinded);
        child.setPosition({ top: 0, left: 0 });
    }

    removeFalsyChild() {
        if (this._falsyChild) {
            this._falsyChildContainer.removeChild(this._falsyChildContainer.children[0]);
            this._falsyChild = null;
            this.resize({ falsyChildContainerHeight: this._falsyChildContainerHeightBackup });
        }
    }

    addNextComponent(next) {
        if (!(next instanceof ScratchComponent)) return;

        this.removeNextComponent();
        this._nextComponent = next;
        this._nextComponentContainer.appendChild(next._node);
        this._nextComponentContainerHeightBackup = (
            this._opt.dimensions.nextComponentContainerHeight);

        this.resize({ nextComponentContainerHeight: next.getDimensions().fittingHeight });
        next.addResizeListener(this._nextComponentResizeHandlerBinded);
        next.setPosition({ top: 0, left: 0 });
    }

    removeNextComponent() {
        if (this._nextComponent) {
            this._nextComponentContainer.removeChild(this._nextComponentContainer.children[0]);
            this._nextComponent = null;
            this.resize({ nextComponentContainerHeight: 0 });
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

        this._resizeAndRepositionChildContainers(dim);
        this._updateDimensions(dim);
        this._callResizeListeners();
    }

    _resizeAndRepositionChildContainers(dim) {
        const {
            truthyChildContainer: tcc,
            falsyChildContainer: fcc,
            nextComponentContainer: ncc,
        } = dim;

        if (this._truthyChildContainer) {
            this._truthyChildContainer.style.setProperty('height', `${tcc.height + ncc.height}px`);
            this._truthyChildContainer.style.setProperty('width', `${tcc.width}px`);
            this._truthyChildContainer.style.setProperty('top', `${tcc.top}px`);
            this._truthyChildContainer.style.setProperty('left', `${tcc.left}px`);
        }

        if (this._falsyChildContainer) {
            this._falsyChildContainer.style.setProperty('height', `${fcc.height + ncc.height}px`);
            this._falsyChildContainer.style.setProperty('width', `${fcc.width}px`);
            this._falsyChildContainer.style.setProperty('top', `${fcc.top}px`);
            this._falsyChildContainer.style.setProperty('left', `${fcc.left}px`);
        }

        this._nextComponentContainer.style.setProperty('width', `${dim.width}px`);
        this._nextComponentContainer.style.setProperty('top', `${dim.fittingHeight}px`);
    }

    _updateDimensions(dimensions) {
        this._opt.dimensions.height = dimensions.height;
        this._opt.dimensions.width = dimensions.width;
        this._opt.dimensions.fittingHeight = dimensions.fittingHeight;
    }

    _truthyChildResizeHandler(target) {
        this.resize({ truthyChildContainerHeight: target.getDimensions().fittingHeight });
    }

    _falsyChildResizeHandler(target) {
        this.resize({ falsyChildContainerHeight: target.getDimensions().fittingHeight });
    }

    _nextComponentResizeHandler(target) {
        this.resize({ nextComponentHeight: target.getDimensions().fittingHeight });
    }

    addResizeListener(listener) {
        if (this._resizeListeners.find(listener)) return;

        this._resizeListeners.push(listener);
    }

    removeResizeListener(listener) {
        for (let i = this._resizeListeners.length - 1; i >= 0; i -= 1) {
            if (this._resizeListeners[i] === listener) {
                this._resizeListeners.splice(i, 1);
                break;
            }
        }
    }

    _callResizeListeners() {
        this._resizeListeners.forEach((listener) => listener(this));
    }
}