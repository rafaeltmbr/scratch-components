/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import ScratchSVGPath from '../util/ScratchSVGPath';
import ManipulateDOM from '../util/ManipulateDOM';
import ManipulateObject from '../util/ManipulateObject';
import defaults from './ScratchComponentDefaults';

export default class ScratchComponent {
    constructor(componentShape, options = {}) {
        if (typeof componentShape === 'string' && typeof ScratchSVGPath[componentShape] === 'function') {
            this._newComponentConstructor(componentShape, options);
        } else if (componentShape instanceof ScratchComponent) {
            this._copyConstructor(componentShape, options);
        } else {
            throw new Error('Bad component/type. Try a valid Scratch Component name '
                + 'or use another Scratch Component to duplicate.');
        }
    }

    _newComponentConstructor(type, options) {
        this._createInitialProperties(type);
        this._assingOptions(options);
        this._createComponent(type);
        this._createNodeShortcuts();
    }

    _copyConstructor(component, options) {
        this._createInitialProperties(component._type);
        this._assignOptionsFromComponent(component, options);
        this._createComponent(this._type);
        this._createNodeShortcuts();
        this._addChildrenAndNextComponents(component);
    }

    _createInitialProperties(type) {
        this._type = type;
        this._opt = {};
        this._node = null;
        this._truthy = null;
        this._falsy = null;
        this._next = null;
        this._resizeListeners = [];
        this._truthyResizeHandlerBinded = this._truthyResizeHandler.bind(this);
        this._falsyResizeHandlerBinded = this._falsyResizeHandler.bind(this);
        this._nextResizeHandlerBinded = this._nextResizeHandler.bind(this);
    }

    _createNodeShortcuts() {
        const childrenLength = this._node.children.length;
        this._svg = this._node.children[0];
        this._truthyContainer = childrenLength > 2 ? this._node.children[1] : null;
        this._falsyContainer = childrenLength > 3 ? this._node.children[2] : null;
        this._nextContainer = this._node.children[childrenLength - 1];
    }

    _assingOptions(options) {
        ManipulateObject.objectMerge(this._opt, defaults);
        ManipulateObject.objectMerge(this._opt, options);
    }

    _assignOptionsFromComponent(component, options) {
        ManipulateObject.objectHardCopy(this._opt, component._opt);
        ManipulateObject.objectMerge(this._opt, options);
    }

    _createComponent(type) {
        const { path, dimensions } = ScratchSVGPath[type](this._opt);
        const html = ScratchComponent.createSVGElementInnerHTML(path, dimensions, this._opt);
        this._node = ManipulateDOM.createNodeElement(html);
        this._updateDimensions(dimensions);
    }

    _addChildrenAndNextComponents(component) {
        if (component._truthy) {
            this.addTruthyChild(new ScratchComponent(component._truthy));
        }
        if (component._falsy) {
            this.addFalsyChild(new ScratchComponent(component._falsy));
        }
        if (component._next) {
            this.addNextComponent(new ScratchComponent(component._next));
        }
    }

    static createSVGElementInnerHTML(path, dimensions, options) {
        const attributes = {};
        ManipulateObject.objectHardCopy(attributes, options.attributes);
        ManipulateObject.objectMerge(attributes.style, dimensions);

        const styleFormmated = ScratchComponent.createStringOfAttributes(attributes.style, ': ', '; ');
        const attributesFormmated = ScratchComponent.createStringOfAttributes(attributes, '="', '" ');
        const children = ScratchComponent.createChildContainers(dimensions);

        const innerHTML = (
            `<div ${attributesFormmated} style="${styleFormmated}">`
            + '<svg style="width: 100%; height: 100%">'
            + `<path d="${path}" /></svg>`
            + `${children}<div class="scratch-next-component-container" `
            + `style="width: 100%; height: ${dimensions.strokeWidth}px; top: ${dimensions.fittingHeight}px; `
            + 'left: 0px; position: absolute;"></div></div>'
        );

        return innerHTML;
    }

    static createChildContainers({ truthy, falsy }) {
        const truthyHTML = (
            ScratchComponent.createContainerHTML('scratch-truthy-children-container', truthy));

        const falsyHTML = (
            ScratchComponent.createContainerHTML('scratch-falsy-children-container', falsy));

        const containersHTML = truthyHTML + falsyHTML;

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

    static createStringOfAttributes(attributes = [], nameValueSeparator = '=', attributeSeparator = ' ') {
        const attr = Object.keys(attributes)
            .map((k) => (
                typeof attributes[k] === 'string'
                    ? `${k + nameValueSeparator + attributes[k]}`
                    : ''))
            .join(attributeSeparator);
        return attr;
    }

    getNodeElement() {
        return this._node;
    }

    _getDimensions() {
        return {
            width: this._opt.dimensions.width,
            height: this._opt.dimensions.height,
            fittingHeight: (
                this._opt.dimensions.fittingHeight
                + (this._next
                    ? this._next._getDimensions().fittingHeight
                    : 0)
            ),
        };
    }

    addTruthyChild(child) {
        if (!(child instanceof ScratchComponent)) return;
        this.removeTruthyChild();
        this._truthy = child;
        this._truthyContainer.appendChild(child._node);
        this._resize({ truthyHeight: child._getDimensions().fittingHeight });
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
        this._falsyContainer.appendChild(child._node);
        this._resize({ falsyHeight: child._getDimensions().fittingHeight });
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
        this._nextContainer.appendChild(next._node);

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
        ManipulateObject.objectMerge(this._opt.dimensions, dimensions);
        this._adjustFitting();
        const { path, dimensions: dim } = ScratchSVGPath[this._type](this._opt);

        this._node.style.setProperty('width', dim.width);
        this._node.style.setProperty('height', dim.height);

        this._svg.children[0].setAttribute('d', path);

        this._resizeAndRepositionChildContainers(dim);
        this._updateDimensions(dim);
        this._callResizeListeners();
    }

    _resizeAndRepositionChildContainers(dim) {
        const { truthy, falsy, next } = dim;

        if (this._truthyContainer && truthy) {
            this._truthyContainer.style.setProperty('height', `${truthy.height + next.height}px`);
            this._truthyContainer.style.setProperty('width', `${truthy.width}px`);
            this._truthyContainer.style.setProperty('top', `${truthy.top}px`);
            this._truthyContainer.style.setProperty('left', `${truthy.left}px`);
        }

        if (this._falsyContainer && falsy) {
            this._falsyContainer.style.setProperty('height', `${falsy.height + next.height}px`);
            this._falsyContainer.style.setProperty('width', `${falsy.width}px`);
            this._falsyContainer.style.setProperty('top', `${falsy.top}px`);
            this._falsyContainer.style.setProperty('left', `${falsy.left}px`);
        }

        this._nextContainer.style.setProperty('width', dim.width);
        this._nextContainer.style.setProperty('top', `${dim.fittingHeight}px`);
    }

    _adjustFitting() {
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
        this._resize({ truthyHeight: target._getDimensions().fittingHeight });
    }

    _falsyResizeHandler(target) {
        this._resize({ falsyHeight: target._getDimensions().fittingHeight });
    }

    _nextResizeHandler(target) {
        this._resize({ nextHeight: target._getDimensions().fittingHeight });
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
