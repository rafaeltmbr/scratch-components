/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import ScratchShape from './util/scratchShape';
import DOM from './util/DOM';
import object from './util/object';
import Component from './util/component';
import defaults from './ScratchComponentDefaults';

const instanceList = [];
const isTouch = DOM.isTouch();

export default class ScratchComponent {
    constructor(shapeNameOrComponentInstance, options = {}) {
        if (Component.isValidShapeName(shapeNameOrComponentInstance)) {
            this._shapeNameConstructor(shapeNameOrComponentInstance, options);
        } else if (shapeNameOrComponentInstance instanceof ScratchComponent) {
            this._componentInstanceConstructor(shapeNameOrComponentInstance, options);
        } else {
            throw new Error('Invalid shapeNameOrComponentInstance');
        }

        if (!this._opt.isPreview) {
            instanceList.push(this);
            this._id = instanceList.length;
        }
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
        this._allowElementToBeCoincidentWithOthers();
        this._createNestedComponents(componentInstance);
        this._assignCoincidenceHandlers();
        this._assignReverseCoincidenceHandlers();
        this._assignMovementHandler();
    }

    _initializeProperties(shapeName) {
        this._shapeName = shapeName;
        this._DOMNode = null;
        this._svg = null;
        this._truthy = null;
        this._falsy = null;
        this._next = null;
        this._parent = null;
        this._id = 0;
        this._opt = {};
        this._containers = {};
        this._dimensions = {};
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
        const { path, dimensions } = ScratchShape[shapeName](this._dimensions, this._opt);
        const html = Component.createComponentHTML(path, dimensions, this._opt);
        this._DOMNode = DOM.createNodeElement(html);
        object.merge(this._dimensions, dimensions);
    }

    _createNodeShortcuts() {
        const { children } = this._DOMNode;
        const { length: len } = children;
        this._svg = children[0];
        this._path = this._svg.children[0];
        this._containers.description = children[2];
        if (len > 3) {
            this._containers.truthy = (children[3].className.includes('truthy')
                ? children[3] : null);
        }
        if (len > 4) {
            this._containers.falsy = (children[4].className.includes('falsy')
                ? children[4] : null);
        }
        this._containers.next = (children[len - 1].className.includes('next')
            ? children[len - 1] : null);
    }

    _assignCoincidenceHandlers() {
        this._handleContainerCoincidence = {
            truthy: (instance) => {
                if (instance._truthy) return;
                this._removeAnyPreviewContainer();
                instance.addTruthy(this._preview.component);
                this._preview.removeMethod = instance.removeTruthy.bind(instance);
            },
            falsy: (instance) => {
                if (instance._falsy) return;
                this._removeAnyPreviewContainer();
                instance.addFalsy(this._preview.component);
                this._preview.removeMethod = instance.removeFalsy.bind(instance);
            },
            next: (instance) => {
                if (instance._next) return;
                this._removeAnyPreviewContainer();
                instance.addNext(this._preview.component);
                this._preview.removeMethod = instance.removeNext.bind(instance);
            },
        };
    }

    _assignReverseCoincidenceHandlers() {
        this._handleReverseContainerCoincidence = {
            truthy: (instance) => {
                if (this._preview.component._truthy === instance) return;
                this._removeAnyPreviewContainer();
                this._positionPreviewComponent(instance, 'truthy');
                if (this._preview.component.addTruthy(instance)) {
                    this._preview.reverseRemoveMethod = (
                        this._preview.component.removeTruthy.bind(this._preview.component));
                    document.body.appendChild(this._preview.component._DOMNode);
                }
            },
            falsy: (instance) => {
                if (this._preview.component._falsy === instance) return;
                this._removeAnyPreviewContainer();
                this._positionPreviewComponent(instance, 'falsy');
                if (this._preview.component.addFalsy(instance)) {
                    this._preview.reverseRemoveMethod = (
                        this._preview.component.removeFalsy.bind(this._preview.component));
                    document.body.appendChild(this._preview.component._DOMNode);
                }
            },
            next: (instance) => {
                if (this._preview.component._next === instance) return;
                this._removeAnyPreviewContainer();
                this._positionPreviewComponent(instance, 'next');
                if (this._preview.component.addNext(instance)) {
                    this._preview.reverseRemoveMethod = (
                        this._preview.component.removeNext.bind(this._preview.component));
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
        const eventType = isTouch ? 'touchstart' : 'mousedown';
        this._path.addEventListener(eventType, this._movementHandler.bind(this));
        this._containers.description.addEventListener(eventType, this._movementHandler.bind(this));
    }

    _movementHandler(event) {
        const { clientX: startX, clientY: startY } = event.touches ? event.touches[0] : event;
        const { top: initialY, left: initialX } = Component.getContainerPosition(this._DOMNode);
        this._DOMNode.setAttribute('data-grabbing', true);

        const handleMovement = (e) => {
            const { clientX, clientY } = e.touches ? e.touches[0] : e;
            if (this._DOMNode.parentElement !== document.body) {
                document.body.appendChild(this._DOMNode);
                this._parent.removeChild(this);
            }

            const offsetX = clientX - startX;
            const offsetY = clientY - startY;

            this._DOMNode.style.setProperty('left', `${offsetX + initialX}px`);
            this._DOMNode.style.setProperty('top', `${offsetY + initialY}px`);

            this._checkForCoincidence();
        };

        const removeEventHandlers = () => {
            window.removeEventListener(isTouch ? 'touchmove' : 'mousemove', handleMovement);
            window.removeEventListener(isTouch ? 'touchend' : 'mouseup', removeEventHandlers);
            this._DOMNode.setAttribute('data-grabbing', false);
            this._finishPreviewComponent();
        };

        window.addEventListener(isTouch ? 'touchmove' : 'mousemove', handleMovement);
        window.addEventListener(isTouch ? 'touchend' : 'mouseup', removeEventHandlers);
    }

    _createNestedComponents(componentInstance) {
        const opt = {
            attributes: {
                class: this._opt.propagateClassNameToNestedElements
                    ? this._opt.attributes.class : '',
            },
            isPreview: this._opt.isPreview,
        };

        if (componentInstance._truthy) {
            this.addTruthy(new ScratchComponent(componentInstance._truthy, opt));
        }
        if (componentInstance._falsy) {
            this.addFalsy(new ScratchComponent(componentInstance._falsy, opt));
        }
        if (componentInstance._next) {
            this.addNext(new ScratchComponent(componentInstance._next, opt));
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
            const child = this._getNestedComponentToBeRemovedFromPreview();
            const { top, left } = Component.getContainerPosition(child._DOMNode);
            child._DOMNode.style.setProperty('top', `${top}px`);
            child._DOMNode.style.setProperty('left', `${left}px`);

            this._preview.reverseRemoveMethod(this._preview.component);
            this._preview.reverseRemoveMethod = null;
            document.body.appendChild(child._DOMNode);
            child._parent = null;
            document.body.removeChild(this._preview.component._DOMNode);
        }
    }

    _getNestedComponentToBeRemovedFromPreview() {
        const { _truthy, _falsy, _next } = this._preview.component;
        if (_truthy && !_truthy._opt.isPreview) return _truthy;
        if (_falsy && !_falsy._opt.isPreview) return _falsy;
        if (_next && !_next._opt.isPreview) return _next;
        return null;
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
            propagateClassNameToNestedElements: true,
            isPreview: true,
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
        const next = this._next;
        if (next && next._lastReverseCoincidence.found) {
            next._handleReverseCoincidentComponent();
            this.addNext(next);
        } else if (this._lastCoincidence.found) {
            this._handleCoincidentComponent();
        } else if (this._lastReverseCoincidence.found) {
            this._handleReverseCoincidentComponent();
        }
        // eslint-disable-next-line no-return-assign
        instanceList.forEach((e) => e._preview.component = null);
    }

    _getAndHandleCoincidentComponent() {
        const container = this.getHitContainer();

        for (let i = 0; i < instanceList.length; i += 1) {
            if (this._addElements.previous
                && this._handleComponentCoincidence(instanceList[i], container)) {
                return instanceList[i];
            }
        }
        return null;
    }

    _handleComponentCoincidence(instance, container) {
        if (this._isDescendantOrTheSameComponent(instance) || instance._opt.isPreview) return false;

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
        if (!this._preview.component) this._createPreviewComponent();

        this._lastReverseCoincidence.found = this._getAndHandleReverseCoincidentComponent();

        if (!this._lastReverseCoincidence.found) {
            this._removeReversePreviewContainer();
        }

        if (this._next) {
            this._lastReverseCoincidence.found = this._next._checkForReverseCoincidence();
        }
    }

    _getAndHandleReverseCoincidentComponent() {
        for (let i = 0; i < instanceList.length; i += 1) {
            if (instanceList[i]._addElements.previous
                && this._handleReverseComponentCoincidence(instanceList[i])) {
                return instanceList[i];
            }
        }

        return null;
    }

    _handleReverseComponentCoincidence(instance) {
        if (this._isDescendantOrTheSameComponent(instance) || instance._opt.isPreview
            || (instance._parent && !instance._parent._opt.isPreview)
            || instance === this._parent) return false;

        const coincidences = this.getContainerCoincidences(instance.getHitContainer());
        if (coincidences.next && !this._next) {
            this._handleReverseContainerCoincidence.next(instance);
            this._lastReverseCoincidence.containerName = 'next';
            return true;
        }
        return false;
    }

    _handleCoincidentComponent() {
        const { containerName } = this._lastCoincidence;

        if (containerName === 'truthy') {
            this._removePreviewContainer();
            this._lastCoincidence.found.addTruthy(this);
        } else if (containerName === 'falsy') {
            this._removePreviewContainer();
            this._lastCoincidence.found.addFalsy(this);
        } else if (containerName === 'next') {
            this._removePreviewContainer();
            this._lastCoincidence.found.addNext(this);
        }
    }

    _handleReverseCoincidentComponent() {
        const { top, left } = Component.getContainerPosition(this._preview.component._DOMNode);
        this._DOMNode.style.setProperty('top', `${top}px`);
        this._DOMNode.style.setProperty('left', `${left}px`);

        const { containerName } = this._lastReverseCoincidence;
        if (containerName === 'truthy') {
            this._removeReversePreviewContainer();
            this.addTruthy(this._lastReverseCoincidence.found);
        } else if (containerName === 'falsy') {
            this._removeReversePreviewContainer();
            this.addFalsy(this._lastReverseCoincidence.found);
        } else if (containerName === 'next') {
            this._removeReversePreviewContainer();
            this.addNext(this._lastReverseCoincidence.found);
        }
    }

    _clearComponentAbsoluteCoordinates() {
        this._DOMNode.style.setProperty('top', '0px');
        this._DOMNode.style.setProperty('left', '0px');
    }

    _truthyResizeHandler(target) {
        if (target instanceof ScratchComponent) {
            this._resize({ truthyHeight: target._getFittingHeight() });
        }
    }

    _falsyResizeHandler(target) {
        if (target instanceof ScratchComponent) {
            this._resize({ falsyHeight: target._getFittingHeight() });
        }
    }

    _nextResizeHandler(target) {
        if (target instanceof ScratchComponent) {
            this._resize({ nextHeight: target._getFittingHeight() });
        }
    }

    _resize(dimensions = {}) {
        object.merge(this._dimensions, dimensions);
        this._updateFittingVisibility();
        const { path, dimensions: dim } = (
            ScratchShape[this._shapeName](this._dimensions, this._opt));

        this._DOMNode.style.setProperty('width', dim.width);
        this._DOMNode.style.setProperty('height', dim.height);

        this._svg.children[0].setAttribute('d', path);

        this._updateContainerDimensions(dim);
        object.merge(this._dimensions, dim);
        this._callResizeListeners();
    }

    _updateFittingVisibility() {
        this._opt.fitting.truthy = (
            this._truthy
                ? this._truthy._getNextFitting()
                : true);

        this._opt.fitting.falsy = (
            this._falsy
                ? this._falsy._getNextFitting()
                : true);
    }

    _getNextFitting() {
        return this._next ? this._next._getNextFitting() : this._opt.fitting.next;
    }

    _getFittingHeight() {
        return (this._dimensions.fittingHeight + (
            this._next ? this._next._getFittingHeight() : 0));
    }

    _updateContainerDimensions(dim) {
        const { truthy, falsy, next } = dim;

        if (this._containers.truthy && truthy) {
            Component.updateContainerDimensions(this._containers.truthy, next, truthy);
        }

        if (this._containers.falsy && falsy) {
            Component.updateContainerDimensions(this._containers.falsy, next, falsy);
        }

        if (this._containers.next) {
            this._containers.next.style.setProperty('top', `${dim.fittingHeight}px`);
        }
    }

    _callResizeListeners() {
        this._resizeListeners.forEach((listener) => listener(this));
    }

    addTruthy(child) {
        if (!(child instanceof ScratchComponent) || !this._addElements.truthy
            || child._isDescendantOrTheSameComponent(this) || this._truthy) return false;

        if (child._parent) child._parent.removeChild(child);
        this.removeTruthy();
        this._truthy = child;
        this._truthy._parent = this;
        this._containers.truthy.appendChild(child._DOMNode);
        child._clearComponentAbsoluteCoordinates();

        this._resize({ truthyHeight: child._getFittingHeight() });
        child.addResizeListener(this._truthyResizeHandlerBinded);
        return true;
    }

    removeTruthy() {
        if (this._truthy) {
            if (this._containers.truthy.children.length) {
                this._containers.truthy.removeChild(this._containers.truthy.children[0]);
            }
            this._truthy.removeResizeListener(this._truthyResizeHandlerBinded);
            this._truthy._parent = null;
            this._truthy = null;

            delete this._dimensions.truthyHeight;
            this._resize();
            return true;
        }
        return false;
    }

    addFalsy(child) {
        if (!(child instanceof ScratchComponent) || !this._addElements.falsy
            || child._isDescendantOrTheSameComponent(this) || this._falsy) return false;

        if (child._parent) child._parent.removeChild(child);
        this.removeFalsy();
        this._falsy = child;
        this._falsy._parent = this;
        this._containers.falsy.appendChild(child._DOMNode);
        child._clearComponentAbsoluteCoordinates();

        this._resize({ falsyHeight: child._getFittingHeight() });
        child.addResizeListener(this._falsyResizeHandlerBinded);
        return true;
    }

    removeFalsy() {
        if (this._falsy) {
            if (this._containers.falsy.children.length) {
                this._containers.falsy.removeChild(this._containers.falsy.children[0]);
            }

            this._falsy.removeResizeListener(this._falsyResizeHandlerBinded);
            this._falsy._parent = null;
            this._falsy = null;
            delete this._dimensions.falsyHeight;
            this._resize();
            return true;
        }
        return false;
    }

    addNext(child) {
        if (!(child instanceof ScratchComponent) || !this._addElements.next
            || child._isDescendantOrTheSameComponent(this)
            || !child._addElements.previous) return false;

        if (child._parent) child._parent.removeChild(child);
        this.removeNext();
        this._next = child;
        this._next._parent = this;
        this._containers.next.appendChild(child._DOMNode);
        child._clearComponentAbsoluteCoordinates();

        this._resize({ nextHeight: child._getFittingHeight() });
        child.addResizeListener(this._nextResizeHandlerBinded);
        return true;
    }

    removeNext() {
        if (this._next) {
            if (this._containers.next.children.length) {
                this._containers.next.removeChild(this._containers.next.children[0]);
            }

            this._next.removeResizeListener(this._nextResizeHandlerBinded);
            this._next._parent = null;
            this._next = null;
            this._resize({ nextHeight: 0 });
            return true;
        }
        return false;
    }

    removeChild(child) {
        if (child === this._truthy) return this.removeTruthy(child);
        if (child === this._falsy) return this.removeFalsy(child);
        if (child === this._next) return this.removeNext(child);
        return false;
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
            width: this._dimensions.width,
            height: this._dimensions.height,
        };
    }

    getShapeName() {
        return this._shapeName;
    }

    getChildren() {
        return {
            truthy: this._truthy,
            falsy: this._falsy,
            next: this._next,
        };
    }

    getParent() {
        return this._parent;
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

        const next = this._containers.next
            ? Component.getContainerPosition(this._containers.next)
            : null;

        return { truthy, falsy, next };
    }

    setAddPermissions(permissions = {}) {
        object.merge(this._addElements, permissions);
        if (!this._addElements.truthy) this.removeTruthy();
        if (!this._addElements.falsy) this.removeFalsy();
        if (!this._addElements.next) this.removeNext();
    }
}
