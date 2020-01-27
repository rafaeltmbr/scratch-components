/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import ScratchShape from './util/scratchShape';
import DOM from './util/DOM';
import object from './util/object';
import Component from './util/Component';
import defaults from './ScratchComponentDefaults';

const instanceList = [];

export default class ScratchComponent {
    constructor(shapeNameOrComponentInstance, options = {}) {
        if (Component.isValidShapeName(shapeNameOrComponentInstance)) {
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
        this._assignReverseCoincidenceHandlers();
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
        this._assignReverseCoincidenceHandlers();
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
        this._lastReverseCoincidence = {};
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
        const html = Component.createComponentHTML(path, dimensions, this._opt);
        this._DOMNode = DOM.createNodeElement(html);
        object.merge(this._opt.dimensions, dimensions);
    }

    _createNodeShortcuts() {
        const childrenLength = this._DOMNode.children.length;
        this._svg = this._DOMNode.children[0];
        this._path = this._svg.children[0];
        this._containers.description = this._DOMNode.children[2];
        this._containers.truthy = childrenLength > 4 ? this._DOMNode.children[3] : null;
        this._containers.falsy = childrenLength > 5 ? this._DOMNode.children[4] : null;
        this._containers.next = this._DOMNode.children[childrenLength - 1];
    }

    _assignCoincidenceHandlers() {
        this._handleContainerCoincidence = {
            truthy: (instance) => {
                if (instance._truthy) return;
                this._removeAnyPreviewContainer();
                instance.addTruthyChild(this._preview.component);
                this._preview.removeMethod = instance.removeTruthyChild.bind(instance);
            },
            falsy: (instance) => {
                if (instance._falsy) return;
                this._removeAnyPreviewContainer();
                instance.addFalsyChild(this._preview.component);
                this._preview.removeMethod = instance.removeFalsyChild.bind(instance);
            },
            next: (instance) => {
                if (instance._next) return;
                this._removeAnyPreviewContainer();
                instance.addNextComponent(this._preview.component);
                this._preview.removeMethod = instance.removeNextComponent.bind(instance);
            },
        };
    }

    _assignReverseCoincidenceHandlers() {
        this._handleReverseContainerCoincidence = {
            truthy: (instance) => {
                if (this._preview.component._truthy === instance) return;
                this._removeAnyPreviewContainer();
                this._positionPreviewComponent(instance, 'truthy');
                if (this._preview.component.addTruthyChild(instance)) {
                    this._preview.reverseRemoveMethod = (
                        this._preview.component.removeTruthyChild.bind(this._preview.component));
                    document.body.appendChild(this._preview.component._DOMNode);
                }
            },
            falsy: (instance) => {
                if (this._preview.component._falsy === instance) return;
                this._removeAnyPreviewContainer();
                this._positionPreviewComponent(instance, 'falsy');
                if (this._preview.component.addFalsyChild(instance)) {
                    this._preview.reverseRemoveMethod = (
                        this._preview.component.removeFalsyChild.bind(this._preview.component));
                    document.body.appendChild(this._preview.component._DOMNode);
                }
            },
            next: (instance) => {
                if (this._preview.component._next === instance) return;
                this._removeAnyPreviewContainer();
                this._positionPreviewComponent(instance, 'next');
                if (this._preview.component.addNextComponent(instance)) {
                    this._preview.reverseRemoveMethod = (
                        this._preview.component.removeNextComponent.bind(this._preview.component));
                    document.body.appendChild(this._preview.component._DOMNode);
                }
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
        this._path.addEventListener('mousedown', this._movementHandler.bind(this));
        this._containers.description
            .addEventListener('mousedown', this._movementHandler.bind(this));
    }

    _movementHandler({ clientX: startX, clientY: startY }) {
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

    _removeAnyPreviewContainer() {
        this._removePreviewContainer();
        this._removeReversePreviewContainer();
    }

    _removePreviewContainer() {
        if (this._preview.removeMethod) {
            this._preview.removeMethod(this._preview.component);
            this._preview.removeMethod = null;
        }
    }

    _removeReversePreviewContainer() {
        if (this._preview.reverseRemoveMethod) {
            const { _truthy, _falsy, _next } = this._preview.component;
            const child = _truthy || _falsy || _next;
            const { top, left } = Component.getContainerPosition(child._DOMNode);
            child._DOMNode.style.setProperty('top', `${top}px`);
            child._DOMNode.style.setProperty('left', `${left}px`);

            this._preview.reverseRemoveMethod(this._preview.component);
            this._preview.reverseRemoveMethod = null;
            document.body.appendChild(child._DOMNode);
            document.body.removeChild(this._preview.component._DOMNode);
        }
    }

    _positionPreviewComponent(instance, containerName) {
        const { component } = this._preview;

        const offset = Component.getContainerTopLeftOffset(component._containers[containerName]);

        const { top, left } = Component.getContainerPosition(instance._DOMNode);

        component._DOMNode.style.setProperty('top', `${top - offset.top}px`);
        component._DOMNode.style.setProperty('left', `${left - offset.left}px`);
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
    }

    _checkForCoincidence() {
        this._lastCoincidence.found = this._getAndHandleCoincidentComponent();

        if (!this._lastCoincidence.found) {
            this._checkForReverseCoincidence();
            if (this._preview.component) {
                this._removePreviewContainer();
            }
        }
    }

    _finishPreviewComponent() {
        if (this._lastCoincidence.found) {
            this._handleCoincidentComponent();
        } else if (this._lastReverseCoincidence.found) {
            this._handleReverseCoincidentComponent();
        }
    }

    _getAndHandleCoincidentComponent() {
        const container = this.getHitContainer();

        for (let i = 0; i < instanceList.length; i += 1) {
            if (this._handleComponentCoincidence(instanceList[i], container)) {
                return instanceList[i];
            }
        }
        return null;
    }

    _handleComponentCoincidence(instance, container) {
        if (this._isDescendantOrTheSameComponent(instance)) return false;

        const coincidences = instance.getContainerCoincidences(container);
        const containerName = Object.keys(coincidences).find((k) => coincidences[k]);
        if (containerName) {
            this._handleContainerCoincidence[containerName](instance);
            this._lastCoincidence.containerName = containerName;
            return true;
        }
        return false;
    }

    _isDescendantOrTheSameComponent(instance) {
        if (instance === this) return true;

        if (this._truthy === instance || this._falsy === instance
            || this._next === instance) return true;

        if (this._truthy && this._truthy._isDescendantOrTheSameComponent(instance)) return true;

        if (this._falsy && this._falsy._isDescendantOrTheSameComponent(instance)) return true;

        if (this._next && this._next._isDescendantOrTheSameComponent(instance)) return true;

        return false;
    }

    _checkForReverseCoincidence() {
        this._lastReverseCoincidence.found = this._getAndHandleReverseCoincidentComponent();

        if (!this._lastReverseCoincidence.found && this._preview.component) {
            this._removeReversePreviewContainer();
        }
    }

    _getAndHandleReverseCoincidentComponent() {
        for (let i = 0; i < instanceList.length; i += 1) {
            if (this._handleReverseComponentCoincidence(instanceList[i])) {
                return instanceList[i];
            }
        }

        return null;
    }

    _handleReverseComponentCoincidence(instance) {
        if (this._isDescendantOrTheSameComponent(instance)) return false;

        const coincidences = this.getContainerCoincidences(instance.getHitContainer());
        const containerName = Object.keys(coincidences).find((k) => coincidences[k]);
        if (containerName) {
            this._handleReverseContainerCoincidence[containerName](instance);
            this._lastReverseCoincidence.containerName = containerName;
            return true;
        }
        return false;
    }

    _handleCoincidentComponent() {
        const { containerName } = this._lastCoincidence;

        if (containerName === 'truthy') {
            this._removePreviewContainer();
            this._lastCoincidence.found.addTruthyChild(this);
        } else if (containerName === 'falsy') {
            this._removePreviewContainer();
            this._lastCoincidence.found.addFalsyChild(this);
        } else if (containerName === 'next') {
            this._removePreviewContainer();
            this._lastCoincidence.found.addNextComponent(this);
        }
    }

    _handleReverseCoincidentComponent() {
        const { top, left } = Component.getContainerPosition(this._preview.component._DOMNode);
        this._DOMNode.style.setProperty('top', `${top}px`);
        this._DOMNode.style.setProperty('left', `${left}px`);

        const { containerName } = this._lastReverseCoincidence;
        if (containerName === 'truthy') {
            this._removeReversePreviewContainer();
            this.addTruthyChild(this._lastReverseCoincidence.found);
        } else if (containerName === 'falsy') {
            this._removeReversePreviewContainer();
            this.addFalsyChild(this._lastReverseCoincidence.found);
        } else if (containerName === 'next') {
            this._removeReversePreviewContainer();
            this.addNextComponent(this._lastReverseCoincidence.found);
        }
    }

    _clearComponentAbsoluteCoordinates() {
        this._DOMNode.style.setProperty('top', '0px');
        this._DOMNode.style.setProperty('left', '0px');
    }

    _truthyResizeHandler(target) {
        if (target instanceof ScratchComponent) {
            this._resize({ truthyHeight: target.getDimensions().fittingHeight });
        }
    }

    _falsyResizeHandler(target) {
        if (target instanceof ScratchComponent) {
            this._resize({ falsyHeight: target.getDimensions().fittingHeight });
        }
    }

    _nextResizeHandler(target) {
        if (target instanceof ScratchComponent) {
            this._resize({ nextHeight: target.getDimensions().fittingHeight });
        }
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
            Component.updateContainerDimensions(this._containers.truthy, next, truthy);
        }

        if (this._containers.falsy && falsy) {
            Component.updateContainerDimensions(this._containers.falsy, next, falsy);
        }

        this._containers.next.style.setProperty('top', `${dim.fittingHeight}px`);
    }

    _callResizeListeners() {
        this._resizeListeners.forEach((listener) => listener(this));
    }

    addTruthyChild(child) {
        if (!(child instanceof ScratchComponent) || !this._addElements.truthy
            || child._isDescendantOrTheSameComponent(this)) return false;

        this.removeTruthyChild();
        this._truthy = child;
        this._containers.truthy.appendChild(child._DOMNode);
        child._clearComponentAbsoluteCoordinates();

        this._resize({ truthyHeight: child.getDimensions().fittingHeight });
        child.addResizeListener(this._truthyResizeHandlerBinded);
        return true;
    }

    removeTruthyChild() {
        if (this._truthy) {
            if (this._containers.truthy.children.length) {
                this._containers.truthy.removeChild(this._containers.truthy.children[0]);
            }
            this._truthy.removeResizeListener(this._truthyResizeHandlerBinded);
            this._truthy = null;

            delete this._opt.dimensions.truthyHeight;
            this._resize();
        }
    }

    addFalsyChild(child) {
        if (!(child instanceof ScratchComponent) || !this._addElements.falsy
            || child._isDescendantOrTheSameComponent(this)) return false;

        this.removeFalsyChild();
        this._falsy = child;
        this._containers.falsy.appendChild(child._DOMNode);
        child._clearComponentAbsoluteCoordinates();

        this._resize({ falsyHeight: child.getDimensions().fittingHeight });
        child.addResizeListener(this._falsyResizeHandlerBinded);
        return true;
    }

    removeFalsyChild() {
        if (this._falsy) {
            if (this._containers.falsy.children.length) {
                this._containers.falsy.removeChild(this._containers.falsy.children[0]);
            }

            this._falsy.removeResizeListener(this._falsyResizeHandlerBinded);
            this._falsy = null;
            delete this._opt.dimensions.falsyHeight;
            this._resize();
        }
    }

    addNextComponent(next) {
        if (!(next instanceof ScratchComponent) || !this._addElements.next
            || next._isDescendantOrTheSameComponent(this)) return false;

        this.removeNextComponent();
        this._next = next;
        this._containers.next.appendChild(next._DOMNode);
        next._clearComponentAbsoluteCoordinates();

        this._resize({ nextHeight: next.getDimensions().fittingHeight });
        next.addResizeListener(this._nextResizeHandlerBinded);
        return true;
    }

    removeNextComponent() {
        if (this._next) {
            if (this._containers.next.children.length) {
                this._containers.next.removeChild(this._containers.next.children[0]);
            }

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
        const container = Component.getContainerPosition(this._DOMNode);
        container.bottom = container.top + 10;
        return container;
    }

    getContainerCoincidences(containerPosition) {
        const { truthy, falsy, next } = this._getContainerPositions();

        const coincidences = {};

        coincidences.truthy = Component.isContainerCoincident(containerPosition, truthy);
        coincidences.falsy = Component.isContainerCoincident(containerPosition, falsy);
        coincidences.next = Component.isContainerCoincident(containerPosition, next);

        return coincidences;
    }

    _getContainerPositions() {
        const truthy = this._containers.truthy
            ? Component.getContainerPosition(this._containers.truthy)
            : null;

        const falsy = this._containers.falsy
            ? Component.getContainerPosition(this._containers.falsy)
            : null;

        return {
            truthy,
            falsy,
            next: Component.getContainerPosition(this._containers.next),
        };
    }

    setAddPermissions(permissions = {}) {
        object.merge(this._addElements, permissions);
        if (!this._addElements.truthy) this.removeTruthyChild();
        if (!this._addElements.falsy) this.removeFalsyChild();
        if (!this._addElements.next) this.removeNextComponent();
    }
}
