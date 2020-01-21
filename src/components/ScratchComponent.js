/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import ScratchSVGPath from '../util/ScratchSVGPath';
import DOMUtil from '../util/DOMUtil';
import objectUtil from '../util/objectUtil';
import defaults from './ScratchComponentDefaults';

const instanceList = [];

export default class ScratchComponent {
    constructor(shapeNameOrComponentInstance, options = {}) {
        window.instanceList = instanceList;

        if (ScratchComponent.isValidShapeName(shapeNameOrComponentInstance)) {
            this._shapeNameConstructor(shapeNameOrComponentInstance, options);
        } else if (shapeNameOrComponentInstance instanceof ScratchComponent) {
            this._componentInstanceConstructor(shapeNameOrComponentInstance, options);
        } else {
            throw new Error('Invalid shapeNameOrComponentInstance');
        }

        instanceList.push(this);
        this._id = instanceList.length;
    }

    static isValidShapeName(shapeName) {
        return typeof shapeName === 'string' && typeof ScratchSVGPath[shapeName] === 'function';
    }

    _shapeNameConstructor(shapeName, options) {
        this._createInitialProperties(shapeName);
        this._assingOptions(options);
        this._createDOMNode(shapeName);
        this._createNodeShortcuts();
        this._createContainerCoincidenceHandler();
        this._allowElementsToBeAdded();
        this._addMoveHandler();
    }

    _componentInstanceConstructor(componentInstance, options) {
        this._createInitialProperties(componentInstance._shapeName);
        this._assignOptionsFromComponent(componentInstance, options);
        this._createDOMNode(this._shapeName);
        this._createNodeShortcuts();
        this._addChildrenAndNextComponents(componentInstance);
        this._createContainerCoincidenceHandler();
        this._allowElementsToBeAdded();
        this._addMoveHandler();
    }

    _createInitialProperties(shapeName) {
        this._shapeName = shapeName;
        this._opt = {};
        this._DOMNode = null;
        this._truthy = null;
        this._falsy = null;
        this._next = null;
        this._positions = null;
        this._resizeListeners = [];
        this._id = 0;
        this._preview = {};
        this._addElements = {};
        this._lastCoincidence = {};
        this._handleContainerCoincidence = {};
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
        this._descriptionContainer = this._DOMNode.children[1];
        this._truthyContainer = childrenLength > 3 ? this._DOMNode.children[2] : null;
        this._falsyContainer = childrenLength > 4 ? this._DOMNode.children[3] : null;
        this._nextContainer = this._DOMNode.children[childrenLength - 1];
    }

    _createContainerCoincidenceHandler() {
        this._handleContainerCoincidence = {
            truthy: (instance) => {
                if (instance._truthy) return;
                this._removePreviewContainer();
                instance.addTruthyChild(this._preview.component);
                this._preview.removeMethod = instance.removeTruthyChild.bind(instance);
            },
            falsy: (instance) => {
                if (instance._falsy) return;
                this._removePreviewContainer();
                instance.addFalsyChild(this._preview.component);
                this._preview.removeMethod = instance.removeFalsyChild.bind(instance);
            },
            next: (instance) => {
                if (instance._next) return;
                this._removePreviewContainer();
                instance.addNextComponent(this._preview.component);
                this._preview.removeMethod = instance.removeNextComponent.bind(instance);
            },
            self: () => {
            },
        };
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

    _allowElementsToBeAdded() {
        this._addElements = {
            truthy: this._truthyContainer,
            falsy: this._falsyContainer,
            next: this._nextContainer,
            self: this._shapeName !== 'function' && this._shapeName !== 'event',
        };
    }

    static createComponentHTML(path, dimensions, options) {
        const attributes = objectUtil.deepClone(options.attributes);
        objectUtil.merge(attributes.style, dimensions);

        const styleFormmated = ScratchComponent.createStringOfAttributes(attributes.style, ': ', '; ');
        const attributesFormmated = ScratchComponent.createStringOfAttributes(attributes, '="', '" ', '"');
        const containers = ScratchComponent.createContainers(dimensions);

        return (
            `<div ${attributesFormmated} style="${styleFormmated}">`
            + '<svg style="width: 100%; height: 100%">'
            + `<path d="${path}" /></svg>`
            + `${containers}</div></div>`
        );
    }

    // eslint-disable-next-line object-curly-newline
    static createContainers(dim) {
        const descriptionHTML = (ScratchComponent
            .createContainerHTML('scratch-description-container', dim.description));

        const truthyHTML = (ScratchComponent
            .createContainerHTML('scratch-truthy-container', dim.truthy));

        const falsyHTML = (ScratchComponent
            .createContainerHTML('scratch-falsy-container', dim.falsy));

        const nextHTML = '<div class="scratch-next-container" '
            + `style="width: 100%; height: ${dim.next.height}px; `
            + `top: ${dim.fittingHeight}px; `
            + 'left: 0px; position: absolute;">';

        return descriptionHTML + truthyHTML + falsyHTML + nextHTML;
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

    getShapeName() {
        return this._shapeName;
    }

    addTruthyChild(child) {
        if (!(child instanceof ScratchComponent) || !this._addElements.truthy) return;

        this.removeTruthyChild();
        this._truthy = child;
        this._truthyContainer.appendChild(child._DOMNode);

        this._resize({ truthyHeight: child.getDimensions().fittingHeight });
        child.addResizeListener(this._truthyResizeHandlerBinded);
    }

    removeTruthyChild() {
        if (this._truthy) {
            this._truthyContainer.removeChild(this._truthyContainer.children[0]);
            this._truthy.removeResizeListener(this._truthyResizeHandlerBinded);
            this._truthy = null;

            delete this._opt.dimensions.truthyHeight;
            this._resize();
        }
    }

    addFalsyChild(child) {
        if (!(child instanceof ScratchComponent) || !this._addElements.falsy) return;

        this.removeFalsyChild();
        this._falsy = child;
        this._falsyContainer.appendChild(child._DOMNode);

        this._resize({ falsyHeight: child.getDimensions().fittingHeight });
        child.addResizeListener(this._falsyResizeHandlerBinded);
    }

    removeFalsyChild() {
        if (this._falsy) {
            this._falsyContainer.removeChild(this._falsyContainer.children[0]);
            this._falsy.removeResizeListener(this._falsyResizeHandlerBinded);
            this._falsy = null;

            delete this._opt.dimensions.falsyHeight;
            this._resize();
        }
    }

    addNextComponent(next) {
        if (!(next instanceof ScratchComponent) || !this._addElements.next) return;

        this.removeNextComponent();
        this._next = next;
        this._nextContainer.appendChild(next._DOMNode);

        this._resize({ nextHeight: next.getDimensions().fittingHeight });
        next.addResizeListener(this._nextResizeHandlerBinded);
    }

    removeNextComponent() {
        if (this._next) {
            this._nextContainer.removeChild(this._nextContainer.children[0]);
            this._next.removeResizeListener(this._nextResizeHandlerBinded);
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
        this._nextContainer.style.setProperty('height', `${next.height}px`);
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

    setAddPermissions(permissions = {}) {
        objectUtil.merge(this._addElements, permissions);
        if (!this._addElements.truthy) this.removeTruthyChild();
        if (!this._addElements.falsy) this.removeFalsyChild();
        if (!this._addElements.next) this.removeNextComponent();
    }

    getHitContainer() {
        const container = ScratchComponent.getContainerPosition(this._DOMNode);
        container.bottom = container.top + 20;
        return container;
    }

    _getContainerPositions() {
        const truthy = this._truthyContainer
            ? ScratchComponent.getContainerPosition(this._truthyContainer)
            : null;

        const falsy = this._falsyContainer
            ? ScratchComponent.getContainerPosition(this._falsyContainer)
            : null;

        return {
            truthy,
            falsy,
            next: ScratchComponent.getContainerPosition(this._nextContainer),
        };
    }

    _coincidenceMoveHandler() {
        const container = this.getHitContainer();
        const options = {
            attributes: {
                class: 'shadow',
                style: {
                    top: '0px',
                    left: '0px',
                },
            },
        };

        this._lastCoincidence.found = null;

        for (let i = 0; i < instanceList.length; i += 1) {
            if (this._handleCoincidences(instanceList[i], container, options)) {
                this._lastCoincidence.found = instanceList[i];
                break;
            }
        }

        if (!this._lastCoincidence.found && this._preview.component) {
            this._removePreviewContainer();
        }
    }

    _handleCoincidences(instance, container, options) {
        const coincidences = instance.getContainerCoincidences(container);
        const containerName = Object.keys(coincidences).find((k) => coincidences[k]);
        if (containerName) {
            this._handleContainerCoincidence[containerName](instance, options);
            this._lastCoincidence.containerName = containerName;
            return true;
        }
        return false;
    }

    getContainerCoincidences(containerPosition) {
        const { truthy, falsy, next } = this._getContainerPositions();

        const coincidences = {};

        coincidences.truthy = ScratchComponent.isContainerCoincident(containerPosition, truthy);
        coincidences.falsy = ScratchComponent.isContainerCoincident(containerPosition, falsy);
        coincidences.next = ScratchComponent.isContainerCoincident(containerPosition, next);

        return coincidences;
    }

    static getContainerPosition(container) {
        const { width, height } = window.getComputedStyle(container);
        const { top, left } = container.getBoundingClientRect();

        return {
            top: Math.round(top),
            right: Math.round(parseInt(width, 10) + left),
            bottom: Math.round(parseInt(height, 10) + top),
            left: Math.round(left),
        };
    }

    static isContainerCoincident(container1, container2) {
        if (!container1 || !container2) return false;

        return (ScratchComponent.isHorizontalCoincident(container1, container2)
            && ScratchComponent.isVerticalCoincident(container1, container2));
    }

    static isHorizontalCoincident(container1, container2) {
        const bounds = {
            start1: container1.left,
            end1: container1.right,
            start2: container2.left,
            end2: container2.right,
        };

        return ScratchComponent.isLineCoincident(bounds);
    }

    static isVerticalCoincident(container1, container2) {
        const bounds = {
            start1: container1.top,
            end1: container1.bottom,
            start2: container2.top,
            end2: container2.bottom,
        };

        return ScratchComponent.isLineCoincident(bounds);
    }

    static isLineCoincident(bounds) {
        // eslint-disable-next-line object-curly-newline
        const { start1, start2, end1, end2 } = bounds;

        return (start1 <= start2 && end1 >= start2)
            || (start1 <= end2 && end1 >= end2)
            || (start2 <= start1 && end1 <= end2);
    }

    _addMoveHandler() {
        this._DOMNode.addEventListener('mousedown', ({ clientX: startX, clientY: startY }) => {
            const initialStyle = window.getComputedStyle(this._DOMNode);
            const initialX = parseInt(initialStyle.left, 10);
            const initialY = parseInt(initialStyle.top, 10);
            this._DOMNode.setAttribute('data-grabbing', true);
            this._createPreviewComponent();

            const handleMovement = ({ clientX, clientY }) => {
                const offsetX = clientX - startX;
                const offsetY = clientY - startY;

                this._DOMNode.style.setProperty('left', `${offsetX + initialX}px`);
                this._DOMNode.style.setProperty('top', `${offsetY + initialY}px`);

                this._coincidenceMoveHandler();
            };

            const removeEventHandlers = () => {
                window.removeEventListener('mousemove', handleMovement);
                window.removeEventListener('mouseup', removeEventHandlers);
                this._DOMNode.setAttribute('data-grabbing', false);
                this._finishPreviewComponent();
            };

            window.addEventListener('mousemove', handleMovement);
            window.addEventListener('mouseup', removeEventHandlers);
        });
    }

    _createPreviewComponent() {
        this._preview.component = new ScratchComponent(this, {
            attributes: {
                class: 'shadow',
                style: {
                    top: '0px',
                    left: '0px',
                },
            },
        });

        this._preview.component.setAddPermissions({
            truthy: false,
            falsy: false,
            next: false,
        });
    }

    _finishPreviewComponent() {
        if (this._lastCoincidence.found) {
            this._handleCoincidenteInstance();
        }
    }

    _handleCoincidenteInstance() {
        const { containerName } = this._lastCoincidence;

        if (containerName === 'truthy') {
            this._clearTopLeftPositions();
            this._lastCoincidence.found.addTruthyChild(this);
        } else if (containerName === 'falsy') {
            this._clearTopLeftPositions();
            this._lastCoincidence.found.addFalsyChild(this);
        } else if (containerName === 'next') {
            this._clearTopLeftPositions();
            this._lastCoincidence.found.addNextComponent(this);
        }
    }

    _removePreviewContainer() {
        if (this._preview.removeMethod) {
            this._preview.removeMethod(this._preview.component);
            this._preview.removeMethod = null;
        }
    }

    _clearTopLeftPositions() {
        this._DOMNode.style.setProperty('top', '0px');
        this._DOMNode.style.setProperty('left', '0px');
    }
}
