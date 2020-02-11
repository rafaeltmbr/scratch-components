/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import ScratchShape from './util/scratchShape';
import DOM from './util/DOM';
import object from './util/object';
import Component from './util/component';
import defaults from './ScratchComponentDefaults';

const instanceList = [];
const isTouch = DOM.isTouch();
const preview = {};

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
        this._assignMovementHandler();
    }

    _initializeProperties(shapeName) {
        this._shapeName = shapeName;
        this._DOMNode = null;
        this._path = null;
        this._truthy = null;
        this._falsy = null;
        this._next = null;
        this._parent = null;
        this._id = 0;
        this._opt = {};
        this._containers = {};
        this._dimensions = {};
        this._addElements = {};
        this._lastCoincidence = {};
        this._lastReverseCoincidence = {};
        this._resizeListeners = [];
        this._handleContainerCoincidence = {};
        this._movementCoordinates = {};
        this._truthyResizeHandlerBinded = this._truthyResizeHandler.bind(this);
        this._falsyResizeHandlerBinded = this._falsyResizeHandler.bind(this);
        this._nextResizeHandlerBinded = this._nextResizeHandler.bind(this);
        this._movementHandlerBinded = this._movementHandler.bind(this);
        this._handleMovementBinded = this._handleMovement.bind(this);
        this._removeMovementHandlerBinded = this._removeMovementHandler.bind(this);
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
        this._path = children[0].children[0];
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
            truthy: this._truthyCoincidenceHandler.bind(this),
            falsy: this._falsyCoincidenceHandler.bind(this),
            next: this._nextCoincidenceHandler.bind(this),
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
        this._path.addEventListener(eventType, this._movementHandlerBinded);
        this._containers.description.addEventListener(eventType, this._movementHandlerBinded);
        this._updateMovementEventListeners();
    }

    _handleReverseNextContainerCoincidence(instance) {
        if (preview.component._isDescendantOrTheSameComponent(instance)) return;
        ScratchComponent.removeAnyPreviewContainer();

        const instancePreviousPosition = instance._DOMNode.getBoundingClientRect();

        if (instance._parent) return;

        if (preview.component.addNext(instance, 'last')) {
            document.body.appendChild(preview.component._DOMNode);
            preview.nextChild = instance;

            const instanceCurrentPosition = instance._DOMNode.getBoundingClientRect();
            ScratchComponent.adjustPreviewPosition(instancePreviousPosition,
                instanceCurrentPosition);
            this._adjustAllIndexesAndMadeThisOnTheTop();
        }
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

    _truthyCoincidenceHandler(instance) {
        if (instance._truthy === preview.component) return;
        ScratchComponent.removeAnyPreviewContainer();
        if (instance._truthy && !preview.component.addNext(instance._truthy, 'last')) return;
        instance.addTruthy(preview.component);
        preview.removeMethod = instance.removeTruthy.bind(instance);
        preview.addMethodName = 'addTruthy';
        this._adjustAllIndexesAndMadeThisOnTheTop();
    }

    _falsyCoincidenceHandler(instance) {
        if (instance._falsy === preview.component) return;
        ScratchComponent.removeAnyPreviewContainer();
        if (instance._falsy && !preview.component.addNext(instance._falsy, 'last')) return;
        instance.addFalsy(preview.component);
        preview.removeMethod = instance.removeFalsy.bind(instance);
        preview.addMethodName = 'addFalsy';
        this._adjustAllIndexesAndMadeThisOnTheTop();
    }

    _nextCoincidenceHandler(instance) {
        if (instance._next === preview.component) return;
        ScratchComponent.removeAnyPreviewContainer();
        if (instance._next && !preview.component.addNext(instance._next, 'last')) return;
        instance.addNext(preview.component);
        preview.removeMethod = instance.removeNext.bind(instance);
        preview.addMethodName = 'addNext';
        this._adjustAllIndexesAndMadeThisOnTheTop();
    }

    static removeAnyPreviewContainer() {
        ScratchComponent.removePreviewContainer();
        ScratchComponent.removeReversePreviewContainer();
    }

    static removePreviewContainer() {
        if (preview.removeMethod) {
            const { _parent } = preview.component;
            const { _next } = preview.component._getDeepestNextPreviewChild();
            preview.removeMethod(preview.component);
            preview.removeMethod = null;
            if (_next) _parent[preview.addMethodName](_next, true);
        }
    }

    static removeReversePreviewContainer() {
        const { nextChild: child } = preview;
        if (!preview.nextChild) return;

        const { top, left } = child._DOMNode.getBoundingClientRect();
        child._DOMNode.style.setProperty('top', `${top}px`);
        child._DOMNode.style.setProperty('left', `${left}px`);

        child._parent.removeNext(child);
        document.body.appendChild(child._DOMNode);
        child._parent = null;
        document.body.removeChild(preview.component._DOMNode);
        preview.nextChild = null;
    }

    _adjustAllIndexesAndMadeThisOnTheTop() {
        const indexList = this._getAllComponentIndexesAndMakeThisOnTheTop();
        indexList.sort((a, b) => a.index - b.index);
        const base = 2;
        indexList.forEach((e, index) => (
            e.instance._DOMNode.style.setProperty('z-index', index + base)));
        const zIndex = parseInt(this._DOMNode.style.getPropertyValue('z-index'), 10) + 1;
        this._DOMNode.style.setProperty('z-index', zIndex);
        this._propagateZIndexToAncestorsIfGreater(zIndex);
    }

    _getAllComponentIndexesAndMakeThisOnTheTop() {
        this._DOMNode.style.setProperty('z-index', 1000);
        return instanceList.map((inst) => ({
            index: inst._DOMNode.style.zIndex || 0,
            instance: inst,
        }));
    }

    _propagateZIndexToAncestorsIfGreater(zIndex) {
        const thisZIndex = parseInt(this._DOMNode.style.getPropertyValue('z-index'), 10);
        if (thisZIndex && thisZIndex > zIndex) return;

        this._DOMNode.style.setProperty('z-index', zIndex);
        if (this._parent) this._parent._propagateZIndexToAncestorsIfGreater(zIndex);
    }

    _updateMovementEventListeners() {
        if (!isTouch) return;
        const { truthy, falsy } = this._containers;

        if (truthy) {
            if (this._truthy) truthy.removeEventListener('touchstart', this._movementHandlerBinded);
            else truthy.addEventListener('touchstart', this._movementHandlerBinded);
        }

        if (falsy) {
            if (this._falsy) falsy.removeEventListener('touchstart', this._movementHandlerBinded);
            else falsy.addEventListener('touchstart', this._movementHandlerBinded);
        }
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

    static adjustPreviewPosition(instancePreviousPosition, instanceCurrentPosition) {
        const instanceOffset = {
            top: instanceCurrentPosition.top - instancePreviousPosition.top,
            left: instanceCurrentPosition.left - instancePreviousPosition.left,
        };

        const previewCurrrentPosition = (
            Component.getContainerTopLeftOffset(preview.component._DOMNode));

        const previewOffset = {
            top: previewCurrrentPosition.top - instanceOffset.top,
            left: previewCurrrentPosition.left - instanceOffset.left,
        };

        preview.component._DOMNode.style.setProperty('top', `${previewOffset.top}px`);
        preview.component._DOMNode.style.setProperty('left', `${previewOffset.left}px`);
    }

    _getDeepestNextPreviewChild() {
        if (this._next && this._next._opt.isPreview) {
            return this._next._getDeepestNextPreviewChild();
        }
        return this;
    }

    _movementHandler(event) {
        this._updateMovementCoordinates(event);
        this._DOMNode.setAttribute('data-grabbing', true);
        this._adjustAllIndexesAndMadeThisOnTheTop();
        this._createPreviewComponent();

        window.addEventListener(isTouch ? 'touchmove' : 'mousemove', this._handleMovementBinded);
        window.addEventListener(isTouch ? 'touchend' : 'mouseup', this._removeMovementHandlerBinded);
    }

    _updateMovementCoordinates(event) {
        const { clientX: startX, clientY: startY } = event.touches ? event.touches[0] : event;
        this._movementCoordinates.startX = startX;
        this._movementCoordinates.startY = startY;

        const { top: initialY, left: initialX } = this._DOMNode.getBoundingClientRect();
        this._movementCoordinates.initialX = initialX;
        this._movementCoordinates.initialY = initialY;
    }

    _createPreviewComponent() {
        const zIndex = parseInt(this._DOMNode.style.zIndex, 10) - 1;

        preview.component = new ScratchComponent(this, {
            attributes: {
                class: 'shadow',
                style: {
                    top: '0px',
                    left: '0px',
                    'z-index': `${zIndex}`,
                },
            },
            propagateClassNameToNestedElements: true,
            isPreview: true,
        });
    }


    _handleMovement(e) {
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        if (this._DOMNode.parentElement !== document.body) {
            document.body.appendChild(this._DOMNode);
            this._parent.removeChild(this);
        }

        const offsetX = clientX - this._movementCoordinates.startX;
        const offsetY = clientY - this._movementCoordinates.startY;

        this._DOMNode.style.setProperty('left', `${offsetX + this._movementCoordinates.initialX}px`);
        this._DOMNode.style.setProperty('top', `${offsetY + this._movementCoordinates.initialY}px`);

        this._checkForCoincidence();
    }

    _removeMovementHandler() {
        window.removeEventListener(isTouch ? 'touchmove' : 'mousemove',
            this._handleMovementBinded);
        window.removeEventListener(isTouch ? 'touchend' : 'mouseup',
            this._removeMovementHandlerBinded);

        this._DOMNode.setAttribute('data-grabbing', false);
        this._finishPreviewComponent();
    }

    _checkForCoincidence() {
        this._lastCoincidence.found = this._getAndHandleCoincidentComponent();

        if (!this._lastCoincidence.found) {
            this._checkForReverseCoincidence();
            if (preview.component) {
                ScratchComponent.removePreviewContainer();
            }
        }
    }

    _finishPreviewComponent() {
        if (this._lastCoincidence.found) {
            this._handleCoincidentComponent();
        } else if (this._lastReverseCoincidence.found) {
            this._handleReverseCoincidentComponent();
        }

        preview.component = null;
        preview.removeMethod = null;
        preview.addMethodName = '';
        preview.nextChild = null;
    }

    _getAndHandleCoincidentComponent() {
        const container = this._getHitContainer();

        for (let i = 0; i < instanceList.length; i += 1) {
            if (this._addElements.previous
                && this._handleComponentCoincidence(instanceList[i], container)) {
                return instanceList[i];
            }
        }
        return null;
    }

    _checkForReverseCoincidence() {
        this._lastReverseCoincidence.found = this._getAndHandleReverseCoincidentComponent();

        if (this._lastReverseCoincidence.found) return this._lastReverseCoincidence.found;

        ScratchComponent.removeReversePreviewContainer();

        if (this._next) {
            this._lastReverseCoincidence.found = this._next._checkForReverseCoincidence();
        }
        return this._lastReverseCoincidence.found;
    }

    _handleCoincidentComponent() {
        const { containerName } = this._lastCoincidence;

        if (containerName === 'truthy') {
            ScratchComponent.removePreviewContainer();
            this._lastCoincidence.found.addTruthy(this, 'first');
        } else if (containerName === 'falsy') {
            ScratchComponent.removePreviewContainer();
            this._lastCoincidence.found.addFalsy(this, 'first');
        } else if (containerName === 'next') {
            ScratchComponent.removePreviewContainer();
            this._lastCoincidence.found.addNext(this, 'first');
        }
    }

    _handleReverseCoincidentComponent() {
        const { top, left } = preview.component._DOMNode.getBoundingClientRect();
        this._DOMNode.style.setProperty('top', `${top}px`);
        this._DOMNode.style.setProperty('left', `${left}px`);

        ScratchComponent.removeReversePreviewContainer();
        this.addNext(this._lastReverseCoincidence.found, 'last');
    }

    _getHitContainer() {
        const { top, right, left } = this._DOMNode.getBoundingClientRect();
        // eslint-disable-next-line object-curly-newline
        return { top, bottom: top + 10, right, left };
    }

    _handleComponentCoincidence(instance, container) {
        if (this._isDescendantOrTheSameComponent(instance) || instance._opt.isPreview) return false;

        const coincidences = instance._getContainerCoincidences(container);
        const containerName = Object.keys(coincidences).find((k) => coincidences[k]);

        if (containerName) {
            this._handleContainerCoincidence[containerName](instance);
            this._lastCoincidence.containerName = containerName;
            return true;
        }
        return false;
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

    _getContainerCoincidences(containerPosition) {
        const { truthy, falsy, next } = this._getContainerPositions();

        const coincidences = {};

        coincidences.truthy = Component.isContainerCoincident(containerPosition, truthy);
        coincidences.falsy = Component.isContainerCoincident(containerPosition, falsy);
        coincidences.next = Component.isContainerCoincident(containerPosition, next);

        return coincidences;
    }

    _handleReverseComponentCoincidence(instance) {
        if (this._isDescendantOrTheSameComponent(instance) || instance._opt.isPreview
            || (instance._parent && !instance._parent._opt.isPreview)
            || instance === this._parent) return false;

        const coincidences = this._getContainerCoincidences(instance._getHitContainer());
        if (coincidences.next && !this._next) {
            this._handleReverseNextContainerCoincidence(instance);
            this._lastReverseCoincidence.containerName = 'next';
            return true;
        }
        return false;
    }

    _getContainerPositions() {
        const truthy = this._containers.truthy
            ? this._containers.truthy.getBoundingClientRect()
            : null;

        const falsy = this._containers.falsy
            ? this._containers.falsy.getBoundingClientRect()
            : null;

        const next = this._containers.next
            ? this._containers.next.getBoundingClientRect()
            : null;

        return { truthy, falsy, next };
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

    _getFittingHeight() {
        return (this._dimensions.fittingHeight + (
            this._next ? this._next._getFittingHeight() : 0));
    }

    _resize(dimensions = {}) {
        object.merge(this._dimensions, dimensions);
        this._updateFittingVisibility();
        const { path, dimensions: dim } = (
            ScratchShape[this._shapeName](this._dimensions, this._opt));

        this._DOMNode.style.setProperty('width', dim.width);
        this._DOMNode.style.setProperty('height', dim.height);

        this._path.setAttribute('d', path);

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

    _getNextFitting() {
        return this._next ? this._next._getNextFitting() : this._opt.fitting.next;
    }

    _addComponent(child, containerName, opt) {
        const component = this[`_${containerName}`];
        if (component && opt === 'no-replace') return false;
        if (component && opt === 'last') return component.addNext(child, 'last');
        if (component && opt === 'first' && !child.addNext(component, 'last')) return false;

        this._addChild(child, containerName);
        return true;
    }

    _addChild(child, containerName) {
        if (child._parent) child._parent.removeChild(child);
        this[`remove${containerName.charAt(0).toUpperCase()}${containerName.slice(1)}`]();
        this[`_${containerName}`] = child;
        this[`_${containerName}`]._parent = this;
        this._containers[containerName].appendChild(child._DOMNode);
        child._clearComponentAbsoluteCoordinates();
        this._setupAfterAddChild(child, containerName);
    }

    _setupAfterAddChild(child, containerName) {
        const resizeOptions = {};
        resizeOptions[`${containerName}Height`] = child._getFittingHeight();
        this._resize(resizeOptions);
        child.addResizeListener(this[`_${containerName}ResizeHandlerBinded`]);

        this._updateMovementEventListeners();
        const zIndex = parseInt(child._DOMNode.style.getPropertyValue('z-index'), 10);
        this._propagateZIndexToAncestorsIfGreater(zIndex);
    }

    _removeComponent(containerName) {
        const container = this[`_${containerName}`];
        if (container) {
            const containerDOM = this._containers[`${containerName}`];
            if (containerDOM.children.length) containerDOM.removeChild(containerDOM.children[0]);

            container.removeResizeListener(this[`_${containerName}ResizeHandlerBinded`]);
            container._parent = null;
            this[`_${containerName}`] = null;

            delete this._dimensions[`${containerName}Height`];
            this._resize();
            this._updateMovementEventListeners();
            return true;
        }
        return false;
    }

    addTruthy(child, opt = 'no-replace') {
        if (!(child instanceof ScratchComponent) || !this._addElements.truthy
            || child._isDescendantOrTheSameComponent(this)) return false;

        return this._addComponent(child, 'truthy', opt);
    }

    removeTruthy() {
        return this._removeComponent('truthy');
    }

    addFalsy(child, opt = 'no-replace') {
        if (!(child instanceof ScratchComponent) || !this._addElements.falsy
            || child._isDescendantOrTheSameComponent(this)) return false;

        return this._addComponent(child, 'falsy', opt);
    }

    removeFalsy() {
        return this._removeComponent('falsy');
    }

    addNext(child, opt = 'no-replace') {
        if (!(child instanceof ScratchComponent) || !this._addElements.next
            || child._isDescendantOrTheSameComponent(this)
            || !child._addElements.previous) return false;

        return this._addComponent(child, 'next', opt);
    }

    removeNext() {
        return this._removeComponent('next');
    }

    removeChild(child) {
        if (child === this._truthy) return this.removeTruthy(child);
        if (child === this._falsy) return this.removeFalsy(child);
        if (child === this._next) return this.removeNext(child);
        return false;
    }

    addResizeListener(listener) {
        for (let i = 0, len = this._resizeListeners.length; i < len; i += 1) {
            if (this._resizeListeners[i] === listener) return;
        }
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

    getPermissions() {
        return {
            truthy: this._addElements.truthy,
            falsy: this._addElements.falsy,
            next: this._addElements.next,
        };
    }

    setPermissions(permissions = {}) {
        object.merge(this._addElements, permissions);
        if (!this._addElements.truthy) this.removeTruthy();
        if (!this._addElements.falsy) this.removeFalsy();
        if (!this._addElements.next) this.removeNext();
    }
}
