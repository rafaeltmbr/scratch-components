/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import ScratchShape from './util/scratchShape';
import DOM from './util/DOM';
import object from './util/object';
import component from './util/component';
import defaults from './ScratchComponentDefaults';

const instanceList = [];

export default class ScratchComponent {
    constructor(shapeNameOrComponentInstance, options = {}) {
        if (component.isValidShapeName(shapeNameOrComponentInstance)) {
            this._shapeNameConstructor(shapeNameOrComponentInstance, options);
        } else if (shapeNameOrComponentInstance instanceof ScratchComponent) {
            this._componentInstanceConstructor(shapeNameOrComponentInstance, options);
        } else {
            throw new Error('Invalid shapeNameOrComponentInstance');
        }

        instanceList.push(this);
        this._id = instanceList.length;
    }

    _shapeNameConstructor(shapeName, options) {
        this._initializeProperties(shapeName);
        this._assingOptions(options);
        this._createDOMNode(shapeName);
        this._createNodeShortcuts();
        this._assignCoincidenceHandlers();
        this._allowElementToBeCoincidentWithOthers();
        this._assignMovementHandler();
    }

    _componentInstanceConstructor(componentInstance, options) {
        this._initializeProperties(componentInstance._shapeName);
        this._copyAndAssignOptionsFromComponent(componentInstance, options);
        this._createDOMNode(this._shapeName);
        this._createNodeShortcuts();
        this._assignCoincidentComponents(componentInstance);
        this._assignCoincidenceHandlers();
        this._allowElementToBeCoincidentWithOthers();
        this._assignMovementHandler();
    }

    _initializeProperties(shapeName) {
        this._shapeName = shapeName;
        this._DOMNode = null;
        this._svg = null;
        this._truthy = null;
        this._falsy = null;
        this._next = null;
        this._id = 0;
        this._opt = {};
        this._containers = {};
        this._preview = {};
        this._addElements = {};
        this._lastCoincidence = {};
        this._resizeListeners = [];
        this._handleContainerCoincidence = {};
        this._truthyResizeHandlerBinded = this._truthyResizeHandler.bind(this);
        this._falsyResizeHandlerBinded = this._falsyResizeHandler.bind(this);
        this._nextResizeHandlerBinded = this._nextResizeHandler.bind(this);
    }

    _assingOptions(options) {
        object.merge(this._opt, defaults);
        object.merge(this._opt, options);
    }

    _copyAndAssignOptionsFromComponent(componentInstance, options) {
        object.deepCopy(this._opt, componentInstance._opt);
        object.merge(this._opt, options);
    }

    _createDOMNode(shapeName) {
        const { path, dimensions } = ScratchShape[shapeName](this._opt);
        const html = component.createComponentHTML(path, dimensions, this._opt);
        this._DOMNode = DOM.createNodeElement(html);
        object.merge(this._opt.dimensions, dimensions);
    }

    _createNodeShortcuts() {
        const childrenLength = this._DOMNode.children.length;
        this._svg = this._DOMNode.children[0];
        this._containers.description = this._DOMNode.children[2];
        this._containers.truthy = childrenLength > 4 ? this._DOMNode.children[3] : null;
        this._containers.falsy = childrenLength > 5 ? this._DOMNode.children[4] : null;
        this._containers.next = this._DOMNode.children[childrenLength - 1];
    }

    _assignCoincidenceHandlers() {
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
        };
    }

    _allowElementToBeCoincidentWithOthers() {
        this._addElements = {
            truthy: this._containers.truthy,
            falsy: this._containers.falsy,
            next: this._containers.next,
            previous: this._shapeName !== 'function' && this._shapeName !== 'event',
        };
    }

    _assignMovementHandler() {
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

                this._checkForCoincidence();
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

    _assignCoincidentComponents(componentInstance) {
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

    _removePreviewContainer() {
        if (this._preview.removeMethod) {
            this._preview.removeMethod(this._preview.component);
            this._preview.removeMethod = null;
        }
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

    _checkForCoincidence() {
        const container = this.getHitContainer();

        this._lastCoincidence.found = null;

        for (let i = 0; i < instanceList.length; i += 1) {
            if (this._isComponentCoincident(instanceList[i], container)) {
                this._lastCoincidence.found = instanceList[i];
                break;
            }
        }

        if (!this._lastCoincidence.found && this._preview.component) {
            this._removePreviewContainer();
        }
    }

    _finishPreviewComponent() {
        if (this._lastCoincidence.found) {
            this._handleCoincidentComponent();
        }
    }

    _isComponentCoincident(instance, container) {
        const coincidences = instance.getContainerCoincidences(container);
        const containerName = Object.keys(coincidences).find((k) => coincidences[k]);
        if (containerName) {
            this._handleContainerCoincidence[containerName](instance);
            this._lastCoincidence.containerName = containerName;
            return true;
        }
        return false;
    }

    _handleCoincidentComponent() {
        const { containerName } = this._lastCoincidence;

        if (containerName === 'truthy') {
            this._clearComponentAbsoluteCoordinates();
            this._removePreviewContainer();
            this._lastCoincidence.found.addTruthyChild(this);
        } else if (containerName === 'falsy') {
            this._clearComponentAbsoluteCoordinates();
            this._removePreviewContainer();
            this._lastCoincidence.found.addFalsyChild(this);
        } else if (containerName === 'next') {
            this._clearComponentAbsoluteCoordinates();
            this._removePreviewContainer();
            this._lastCoincidence.found.addNextComponent(this);
        }
    }

    _clearComponentAbsoluteCoordinates() {
        this._DOMNode.style.setProperty('top', '0px');
        this._DOMNode.style.setProperty('left', '0px');
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

    _resize(dimensions = {}) {
        object.merge(this._opt.dimensions, dimensions);
        this._updateFittingVisibility();
        const { path, dimensions: dim } = ScratchShape[this._shapeName](this._opt);

        this._DOMNode.style.setProperty('width', dim.width);
        this._DOMNode.style.setProperty('height', dim.height);

        this._svg.children[0].setAttribute('d', path);

        this._updateContainerDimensions(dim);
        object.merge(this._opt.dimensions, dim);
        this._callResizeListeners();
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

    _updateContainerDimensions(dim) {
        const { truthy, falsy, next } = dim;

        if (this._containers.truthy && truthy) {
            component.updateContainerDimensions(this._containers.truthy, next, truthy);
        }

        if (this._containers.falsy && falsy) {
            component.updateContainerDimensions(this._containers.falsy, next, falsy);
        }

        this._containers.next.style.setProperty('top', `${dim.fittingHeight}px`);
    }

    _callResizeListeners() {
        this._resizeListeners.forEach((listener) => listener(this));
    }

    addTruthyChild(child) {
        if (!(child instanceof ScratchComponent) || !this._addElements.truthy) return;

        this.removeTruthyChild();
        this._truthy = child;
        this._containers.truthy.appendChild(child._DOMNode);

        this._resize({ truthyHeight: child.getDimensions().fittingHeight });
        child.addResizeListener(this._truthyResizeHandlerBinded);
    }

    removeTruthyChild() {
        if (this._truthy) {
            this._containers.truthy.removeChild(this._containers.truthy.children[0]);
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
        this._containers.falsy.appendChild(child._DOMNode);

        this._resize({ falsyHeight: child.getDimensions().fittingHeight });
        child.addResizeListener(this._falsyResizeHandlerBinded);
    }

    removeFalsyChild() {
        if (this._falsy) {
            this._containers.falsy.removeChild(this._containers.falsy.children[0]);
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
        this._containers.next.appendChild(next._DOMNode);

        this._resize({ nextHeight: next.getDimensions().fittingHeight });
        next.addResizeListener(this._nextResizeHandlerBinded);
    }

    removeNextComponent() {
        if (this._next) {
            this._containers.next.removeChild(this._containers.next.children[0]);
            this._next.removeResizeListener(this._nextResizeHandlerBinded);
            this._next = null;

            this._resize({ nextHeight: 0 });
        }
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

    getShapeName() {
        return this._shapeName;
    }

    getConcidenteComponents() {
        return {
            truthy: this._truthy,
            falsy: this._falsy,
            next: this._next,
        };
    }

    getHitContainer() {
        const container = component.getContainerPosition(this._DOMNode);
        container.bottom = container.top + 10;
        return container;
    }

    getContainerCoincidences(containerPosition) {
        const { truthy, falsy, next } = this._getContainerPositions();

        const coincidences = {};

        coincidences.truthy = component.isContainerCoincident(containerPosition, truthy);
        coincidences.falsy = component.isContainerCoincident(containerPosition, falsy);
        coincidences.next = component.isContainerCoincident(containerPosition, next);

        return coincidences;
    }

    _getContainerPositions() {
        const truthy = this._containers.truthy
            ? component.getContainerPosition(this._containers.truthy)
            : null;

        const falsy = this._containers.falsy
            ? component.getContainerPosition(this._containers.falsy)
            : null;

        return {
            truthy,
            falsy,
            next: component.getContainerPosition(this._containers.next),
        };
    }

    setAddPermissions(permissions = {}) {
        object.merge(this._addElements, permissions);
        if (!this._addElements.truthy) this.removeTruthyChild();
        if (!this._addElements.falsy) this.removeFalsyChild();
        if (!this._addElements.next) this.removeNextComponent();
    }
}
