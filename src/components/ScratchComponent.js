/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import ScratchSVGPath from '../util/ScratchSVGPath';
import ManipulateDOM from '../util/ManipulateDOM';
import ManipulateObject from '../util/ManipulateObject';
import defaults from '../util/ScratchComponentDefaults';

export default class ScratchComponent {
    constructor(componentType, options = {}) {
        if (typeof componentType === 'string') {
            this._newComponentConstructor(componentType, options);
        } else if (componentType instanceof ScratchComponent) {
            this._copyConstructor(componentType, options);
        }
    }

    _newComponentConstructor(type, options) {
        this._createInitialProperties(type);
        this._assingOptions(options);
        this._createAppearenceAndDimensionBackup();
        this._createComponent(type);
        this._createNodeShortcuts();
    }

    _copyConstructor(component, options) {
        this._createInitialProperties(component._type);
        this._assignOptionsFromComponent(component, options);
        this._copyAppearenceAndDimensionBackupFromComponent(component);
        this._createComponent(this._type);
        this._createNodeShortcuts();
        this._addChildrenAndNextComponents(component);
    }

    _createInitialProperties(type) {
        this._type = type;
        this._opt = {};
        this._node = null;
        this._truthyChild = null;
        this._falsyChild = null;
        this._nextComponent = null;
        this._resizeListeners = [];
        this._truthyChildResizeHandlerBinded = this._truthyChildResizeHandler.bind(this);
        this._falsyChildResizeHandlerBinded = this._falsyChildResizeHandler.bind(this);
        this._nextComponentResizeHandlerBinded = this._nextComponentResizeHandler.bind(this);
    }

    _createAppearenceAndDimensionBackup() {
        this._truthyChildContainerHeightOriginal = this._opt.dimensions.truthyChildContainerHeight;
        this._falsyChildContainerHeightOriginal = this._opt.dimensions.falsyChildContainerHeight;
        this._fittingBackup = {
            male: this._opt.appearence.maleFitting,
            truthy: this._opt.appearence.truthyFemaleFitting,
            falsy: this._opt.appearence.falsyFemaleFitting,
        };
    }

    _copyAppearenceAndDimensionBackupFromComponent(component) {
        this._truthyChildContainerHeightOriginal = component._truthyChildContainerHeightOriginal;
        this._falsyChildContainerHeightOriginal = component._falsyChildContainerHeightOriginal;
        ManipulateObject.objectMerge(this._fittingBackup = {}, component._fittingBackup);
    }

    _createNodeShortcuts() {
        const childrenLength = this._node.children.length;
        this._svg = this._node.children[0];
        this._truthyChildContainer = childrenLength > 2 ? this._node.children[1] : null;
        this._falsyChildContainer = childrenLength > 3 ? this._node.children[2] : null;
        this._nextComponentContainer = this._node.children[childrenLength - 1];
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
        if (component._truthyChild) {
            this.addTruthyChild(new ScratchComponent(component._truthyChild));
        }
        if (component._falsyChild) {
            this.addFalsyChild(new ScratchComponent(component._falsyChild));
        }
        if (component._nextComponent) {
            this.addNextComponent(new ScratchComponent(component._nextComponent));
        }
    }

    static createSVGElementInnerHTML(path, dimensions, options) {
        const attributes = {};
        ManipulateObject.objectHardCopy(attributes, options.attributes);
        ManipulateObject.objectMerge(attributes.style, dimensions);

        const styleFormmated = ScratchComponent.createStringOfAttributes(attributes.style, ': ', '; ');
        const attributesFormmated = ScratchComponent.createStringOfAttributes(attributes, '="', '" ');
        const childrenContainer = ScratchComponent.createChildContainers(dimensions);

        const innerHTML = (
            `<div ${attributesFormmated} style="${styleFormmated}">`
            + '<svg style="width: 100%; height: 100%">'
            + `<path d="${path}" /></svg>`
            + `${childrenContainer}<div class="scratch-next-component-container" `
            + `style="width: 100%; height: ${dimensions.strokeWidth}px; top: ${dimensions.fittingHeight}px; `
            + 'left: 0px; position: absolute;"></div></div>'
        );

        return innerHTML;
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

    addTruthyChild(child) {
        if (!(child instanceof ScratchComponent)) return;
        this.removeTruthyChild();
        this._truthyChild = child;
        this._truthyChildContainer.appendChild(child._node);
        this.resize({ truthyChildContainerHeight: child.getDimensions().fittingHeight });
        child.addResizeListener(this._truthyChildResizeHandlerBinded);
    }

    removeTruthyChild() {
        if (this._truthyChild) {
            this._truthyChildContainer.removeChild(this._truthyChildContainer.children[0]);
            this._truthyChild = null;
            this.resize({ truthyChildContainerHeight: this._truthyChildContainerHeightOriginal });
        }
    }

    addFalsyChild(child) {
        if (!(child instanceof ScratchComponent)) return;
        this.removeFalsyChild();
        this._falsyChild = child;
        this._falsyChildContainer.appendChild(child._node);
        this.resize({ falsyChildContainerHeight: child.getDimensions().fittingHeight });
        child.addResizeListener(this._falsyChildResizeHandlerBinded);
    }

    removeFalsyChild() {
        if (this._falsyChild) {
            this._falsyChildContainer.removeChild(this._falsyChildContainer.children[0]);
            this._falsyChild = null;
            this.resize({ falsyChildContainerHeight: this._falsyChildContainerHeightOriginal });
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
        this._adjustFitting();
        const { path, dimensions: dim } = ScratchSVGPath[this._type](this._opt);

        this._node.style.setProperty('width', dim.width);
        this._node.style.setProperty('height', dim.height);

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

    _adjustFitting() {
        this._opt.appearence.maleFitting = (
            this._nextComponent
                ? true
                : this._fittingBackup.male);

        this._opt.appearence.truthyFemaleFitting = (
            this._truthyChild
                ? this._truthyChild._opt.appearence.maleFitting
                : this._fittingBackup.truthy);

        this._opt.appearence.falsyFemaleFitting = (
            this._falsyChild
                ? this._falsyChild._opt.appearence.maleFitting
                : this._fittingBackup.falsy);
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
