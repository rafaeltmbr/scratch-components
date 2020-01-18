/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import ScratchSVGPath from '../util/ScratchSVGPath';
import DOMUtil from '../util/DOMUtil';
import objectUtil from '../util/objectUtil';
import defaults from './ScratchComponentDefaults';

export default class ScratchComponent {
    constructor(shapeNameOrComponentInstance, options = {}) {
        window.strAttr = ScratchComponent.createStringOfAttributes;

        if (ScratchComponent.isValidShapeName(shapeNameOrComponentInstance)) {
            this._shapeNameConstructor(shapeNameOrComponentInstance, options);
        } else if (shapeNameOrComponentInstance instanceof ScratchComponent) {
            this._componentInstanceConstructor(shapeNameOrComponentInstance, options);
        } else {
            throw new Error('Invalid shapeNameOrComponentInstance');
        }
    }

    static isValidShapeName(shapeName) {
        return typeof shapeName === 'string' && typeof ScratchSVGPath[shapeName] === 'function';
    }

    _shapeNameConstructor(shapeName, options) {
        this._createInitialProperties(shapeName);
        this._assingOptions(options);
        this._createDOMNode(shapeName);
        this._createNodeShortcuts();
    }

    _componentInstanceConstructor(componentInstance, options) {
        this._createInitialProperties(componentInstance._shapeName);
        this._assignOptionsFromComponent(componentInstance, options);
        this._createDOMNode(this._shapeName);
        this._createNodeShortcuts();
        this._addChildrenAndNextComponents(componentInstance);
    }

    _createInitialProperties(shapeName) {
        this._shapeName = shapeName;
        this._opt = {};
        this._DOMNode = null;
        this._truthy = null;
        this._falsy = null;
        this._next = null;
        this._resizeListeners = [];
        this._truthyResizeHandlerBinded = this._truthyResizeHandler.bind(this);
        this._falsyResizeHandlerBinded = this._falsyResizeHandler.bind(this);
        this._nextResizeHandlerBinded = this._nextResizeHandler.bind(this);
    }

    _assingOptions(options) {
        objectUtil.merge(this._opt, defaults);
        objectUtil.merge(this._opt, options);
    }

    _createDOMNode(shapeName) {
        const { path, dimensions } = ScratchSVGPath[shapeName](this._opt);
        const html = ScratchComponent.createComponentHTML(path, dimensions, this._opt);
        this._DOMNode = DOMUtil.createNodeElement(html);
        this._updateDimensions(dimensions);
    }

    _createNodeShortcuts() {
        const childrenLength = this._DOMNode.children.length;
        this._svg = this._DOMNode.children[0];
        this._truthyContainer = childrenLength > 2 ? this._DOMNode.children[1] : null;
        this._falsyContainer = childrenLength > 3 ? this._DOMNode.children[2] : null;
        this._nextContainer = this._DOMNode.children[childrenLength - 1];
    }

    _assignOptionsFromComponent(componentInstance, options) {
        objectUtil.deepCopy(this._opt, componentInstance._opt);
        objectUtil.merge(this._opt, options);
    }

    _addChildrenAndNextComponents(componentInstance) {
        if (componentInstance._truthy) {
            this.addTruthyChild(new ScratchComponent(componentInstance._truthy));
        }
        if (componentInstance._falsy) {
            this.addFalsyChild(new ScratchComponent(componentInstance._falsy));
        }
        if (componentInstance._next) {
            this.addNextComponent(new ScratchComponent(componentInstance._next));
        }
    }

    static createComponentHTML(path, dimensions, options) {
        const attributes = objectUtil.deepClone(options.attributes);
        objectUtil.merge(attributes.style, dimensions);

        const styleFormmated = ScratchComponent.createStringOfAttributes(attributes.style, ': ', '; ');
        const attributesFormmated = ScratchComponent.createStringOfAttributes(attributes, '="', '" ', '"');
        const children = ScratchComponent.createChildContainers(dimensions);

        return (
            `<div ${attributesFormmated} style="${styleFormmated}">`
            + '<svg style="width: 100%; height: 100%">'
            + `<path d="${path}" /></svg>`
            + `${children}<div class="scratch-next-component-container" `
            + `style="width: 100%; height: ${dimensions.strokeWidth}px; `
            + `top: ${dimensions.fittingHeight}px; `
            + 'left: 0px; position: absolute;"></div></div>'
        );
    }

    static createChildContainers({ truthy, falsy }) {
        const truthyHTML = (ScratchComponent
            .createContainerHTML('scratch-truthy-children-container', truthy));

        const falsyHTML = (ScratchComponent
            .createContainerHTML('scratch-falsy-children-container', falsy));

        return truthyHTML + falsyHTML;
    }

    static createContainerHTML(className, dimensions) {
        return (
            dimensions
                ? (
                    `<div class="${className || ''}" style="position: absolute; `
                    + `width: ${dimensions.width}px; `
                    + `height: ${dimensions.height}px; `
                    + `top: ${dimensions.top}px; `
                    + `left: ${dimensions.left}px"></div>`
                )
                : ''
        );
    }

    static createStringOfAttributes(attributes = {}, nameValueSeparator = '=',
        attributeSeparator = ' ', terminator = '') {
        return Object.keys(attributes)
            .map((k) => (
                typeof attributes[k] === 'string'
                    ? `${k + nameValueSeparator + attributes[k]}`
                    : ''))
            .filter((e) => e !== '')
            .join(attributeSeparator) + terminator;
    }

    getDOMNode() {
        return this._DOMNode;
    }

    getDimensions() {
        return {
            width: this._opt.dimensions.width,
            height: this._opt.dimensions.height,
            fittingHeight: (
                this._opt.dimensions.fittingHeight
                + (this._next
                    ? this._next.getDimensions().fittingHeight
                    : 0)
            ),
        };
    }

    getTruthyFalsyAndNext() {
        return {
            truthy: this._truthy,
            falsy: this._falsy,
            next: this._next,
        };
    }

    addTruthyChild(child) {
        if (!(child instanceof ScratchComponent)) return;

        this.removeTruthyChild();
        this._truthy = child;
        this._truthyContainer.appendChild(child._DOMNode);

        this._resize({ truthyHeight: child.getDimensions().fittingHeight });
        child.addResizeListener(this._truthyResizeHandlerBinded);
    }

    removeTruthyChild() {
        if (this._truthy) {
            this._truthyContainer.removeChild(this._truthyContainer.children[0]);
            this._truthy = null;

            delete this._opt.dimensions.truthyHeight;
            this._resize();
        }
    }

    addFalsyChild(child) {
        if (!(child instanceof ScratchComponent)) return;

        this.removeFalsyChild();
        this._falsy = child;
        this._falsyContainer.appendChild(child._DOMNode);

        this._resize({ falsyHeight: child.getDimensions().fittingHeight });
        child.addResizeListener(this._falsyResizeHandlerBinded);
    }

    removeFalsyChild() {
        if (this._falsy) {
            this._falsyContainer.removeChild(this._falsyContainer.children[0]);
            this._falsy = null;

            delete this._opt.dimensions.falsyHeight;
            this._resize();
        }
    }

    addNextComponent(next) {
        if (!(next instanceof ScratchComponent)) return;

        this.removeNextComponent();
        this._next = next;
        this._nextContainer.appendChild(next._DOMNode);

        this._resize();
        next.addResizeListener(this._nextResizeHandlerBinded);
    }

    removeNextComponent() {
        if (this._next) {
            this._nextContainer.removeChild(this._nextContainer.children[0]);
            this._next = null;

            this._resize({ nextHeight: 0 });
        }
    }

    _resize(dimensions = {}) {
        objectUtil.merge(this._opt.dimensions, dimensions);
        this._updateFittingVisibility();
        const { path, dimensions: dim } = ScratchSVGPath[this._shapeName](this._opt);

        this._DOMNode.style.setProperty('width', dim.width);
        this._DOMNode.style.setProperty('height', dim.height);

        this._svg.children[0].setAttribute('d', path);

        this._updateChildAndNextContainerDimensions(dim);
        this._updateDimensions(dim);
        this._callResizeListeners();
    }

    _updateChildAndNextContainerDimensions(dim) {
        const { truthy, falsy, next } = dim;

        if (this._truthyContainer && truthy) {
            ScratchComponent.updateContainerDimensions(this._truthyContainer, next, truthy);
        }

        if (this._falsyContainer && falsy) {
            ScratchComponent.updateContainerDimensions(this._falsyContainer, next, falsy);
        }

        this._nextContainer.style.setProperty('width', dim.width);
        this._nextContainer.style.setProperty('top', `${dim.fittingHeight}px`);
    }

    static updateContainerDimensions(container, next, dim) {
        container.style.setProperty('height', `${dim.height + next.height}px`);
        container.style.setProperty('width', `${dim.width}px`);
        container.style.setProperty('top', `${dim.top}px`);
        container.style.setProperty('left', `${dim.left}px`);
    }

    _updateFittingVisibility() {
        this._opt.fitting.truthy = (
            this._truthy
                ? this._truthy._opt.fitting.next
                : true);

        this._opt.fitting.falsy = (
            this._falsy
                ? this._falsy._opt.fitting.next
                : true);
    }

    _updateDimensions(dimensions) {
        this._opt.dimensions.height = dimensions.height;
        this._opt.dimensions.width = dimensions.width;
        this._opt.dimensions.fittingHeight = dimensions.fittingHeight;
    }

    _truthyResizeHandler(target) {
        this._resize({ truthyHeight: target.getDimensions().fittingHeight });
    }

    _falsyResizeHandler(target) {
        this._resize({ falsyHeight: target.getDimensions().fittingHeight });
    }

    _nextResizeHandler(target) {
        this._resize({ nextHeight: target.getDimensions().fittingHeight });
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
