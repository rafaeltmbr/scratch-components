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
        this._svg = null;
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
        this._truthyResizeHandlerBinded = this._truthyResizeHandler.bind(this);
        this._falsyResizeHandlerBinded = this._falsyResizeHandler.bind(this);
        this._nextResizeHandlerBinded = this._nextResizeHandler.bind(this);
        this._movementHandlerBinded = this._movementHandler.bind(this);
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
                if (instance._truthy === preview.component) return;
                this._removeAnyPreviewContainer();
                if (instance._truthy && !preview.component.addNext(instance._truthy, 'last')) return;
                instance.addTruthy(preview.component);
                preview.removeMethod = instance.removeTruthy.bind(instance);
                preview.addMethodName = 'addTruthy';
                this._adjustAllIndexesAndMadeThisOnTheTop();
            },
            falsy: (instance) => {
                if (instance._falsy === preview.component) return;
                this._removeAnyPreviewContainer();
                if (instance._falsy && !preview.component.addNext(instance._falsy, 'last')) return;
                instance.addFalsy(preview.component);
                preview.removeMethod = instance.removeFalsy.bind(instance);
                preview.addMethodName = 'addFalsy';
                this._adjustAllIndexesAndMadeThisOnTheTop();
            },
            next: (instance) => {
                if (instance._next === preview.component) return;
                this._removeAnyPreviewContainer();
                if (instance._next && !preview.component.addNext(instance._next, 'last')) return;
                instance.addNext(preview.component);
                preview.removeMethod = instance.removeNext.bind(instance);
                preview.addMethodName = 'addNext';
                this._adjustAllIndexesAndMadeThisOnTheTop();
            },
        };
    }

    _handleReverseNextContainerCoincidence(instance) {
        if (preview.component._isDescendantOrTheSameComponent(instance)) return;
        this._removeAnyPreviewContainer();

        const instancePreviousPosition = instance._DOMNode.getBoundingClientRect();

        if (instance._parent) return;

        if (preview.component.addNext(instance, 'last')) {
            document.body.appendChild(preview.component._DOMNode);
            preview.nextChild = instance;

            const instanceCurrentPosition = instance._DOMNode.getBoundingClientRect();
            this._adjustPreviewPosition(instancePreviousPosition, instanceCurrentPosition);
            this._adjustAllIndexesAndMadeThisOnTheTop();
        }
    }

    // eslint-disable-next-line class-methods-use-this
    _adjustPreviewPosition(instancePreviousPosition, instanceCurrentPosition) {
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

    _movementHandler(event) {
        const { clientX: startX, clientY: startY } = event.touches ? event.touches[0] : event;
        const { top: initialY, left: initialX } = this._DOMNode.getBoundingClientRect();
        this._DOMNode.setAttribute('data-grabbing', true);
        this._adjustAllIndexesAndMadeThisOnTheTop();
        this._createPreviewComponent();

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

    // eslint-disable-next-line class-methods-use-this
    _removePreviewContainer() {
        if (preview.removeMethod) {
            const { _parent } = preview.component;
            const { _next } = preview.component._getDeepestNextPreviewChild();
            preview.removeMethod(preview.component);
            preview.removeMethod = null;
            if (_next) _parent[preview.addMethodName](_next, true);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    _removeReversePreviewContainer() {
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

    _checkForCoincidence() {
        this._lastCoincidence.found = this._getAndHandleCoincidentComponent();

        if (!this._lastCoincidence.found) {
            this._checkForReverseCoincidence();
            if (preview.component) {
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

        preview.component = null;
        preview.removeMethod = null;
        preview.addMethodName = '';
        preview.nextChild = null;
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
        this._lastReverseCoincidence.found = this._getAndHandleReverseCoincidentComponent();

        if (this._lastReverseCoincidence.found) return this._lastReverseCoincidence.found;

        this._removeReversePreviewContainer();

        if (this._next) {
            this._lastReverseCoincidence.found = this._next._checkForReverseCoincidence();
        }
        return this._lastReverseCoincidence.found;
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
            this._handleReverseNextContainerCoincidence(instance);
            this._lastReverseCoincidence.containerName = 'next';
            return true;
        }
        return false;
    }

    _handleCoincidentComponent() {
        const { containerName } = this._lastCoincidence;

        if (containerName === 'truthy') {
            this._removePreviewContainer();
            this._lastCoincidence.found.addTruthy(this, 'first');
        } else if (containerName === 'falsy') {
            this._removePreviewContainer();
            this._lastCoincidence.found.addFalsy(this, 'first');
        } else if (containerName === 'next') {
            this._removePreviewContainer();
            this._lastCoincidence.found.addNext(this, 'first');
        }
    }

    _handleReverseCoincidentComponent() {
        const { top, left } = preview.component._DOMNode.getBoundingClientRect();
        this._DOMNode.style.setProperty('top', `${top}px`);
        this._DOMNode.style.setProperty('left', `${left}px`);

        this._removeReversePreviewContainer();
        this.addNext(this._lastReverseCoincidence.found, 'last');
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

    addTruthy(child, opt = 'no-replace') {
        if (!(child instanceof ScratchComponent) || !this._addElements.truthy
            || child._isDescendantOrTheSameComponent(this)) return false;

        if (this._truthy && opt === 'no-replace') return false;
        if (this._truthy && opt === 'last') return this._truthy.addNext(child, 'last');
        if (this._truthy && opt === 'first' && !child.addNext(this._truthy, 'last')) return false;

        if (child._parent) child._parent.removeChild(child);
        this.removeTruthy();
        this._truthy = child;
        this._truthy._parent = this;
        this._containers.truthy.appendChild(child._DOMNode);
        child._clearComponentAbsoluteCoordinates();

        this._resize({ truthyHeight: child._getFittingHeight() });
        child.addResizeListener(this._truthyResizeHandlerBinded);
        this._updateMovementEventListeners();
        const zIndex = parseInt(child._DOMNode.style.getPropertyValue('z-index'), 10);
        this._propagateZIndexToAncestorsIfGreater(zIndex);
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
            this._updateMovementEventListeners();
            return true;
        }
        return false;
    }

    addFalsy(child, opt = 'no-replace') {
        if (!(child instanceof ScratchComponent) || !this._addElements.falsy
            || child._isDescendantOrTheSameComponent(this)) return false;


        if (this._falsy && opt === 'no-replace') return false;
        if (this._falsy && opt === 'last') return this._falsy.addNext(child, 'last');
        if (this._falsy && opt === 'first' && !child.addNext(this._falsy, 'last')) return false;

        if (child._parent) child._parent.removeChild(child);
        this.removeFalsy();
        this._falsy = child;
        this._falsy._parent = this;
        this._containers.falsy.appendChild(child._DOMNode);
        child._clearComponentAbsoluteCoordinates();

        this._resize({ falsyHeight: child._getFittingHeight() });
        child.addResizeListener(this._falsyResizeHandlerBinded);
        this._updateMovementEventListeners();
        const zIndex = parseInt(child._DOMNode.style.getPropertyValue('z-index'), 10);
        this._propagateZIndexToAncestorsIfGreater(zIndex);
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
            this._updateMovementEventListeners();
            return true;
        }
        return false;
    }

    addNext(child, opt = 'no-replace') {
        if (!(child instanceof ScratchComponent) || !this._addElements.next
            || child._isDescendantOrTheSameComponent(this)
            || !child._addElements.previous) return false;

        if (this._next && opt === 'no-replace') return false;
        if (this._next && opt === 'last') return this._next.addNext(child, 'last');
        if (this._next && opt === 'first' && !child.addNext(this._next, 'last')) return false;

        if (child._parent) child._parent.removeChild(child);
        this.removeNext();
        this._next = child;
        this._next._parent = this;
        this._containers.next.appendChild(child._DOMNode);
        child._clearComponentAbsoluteCoordinates();

        this._resize({ nextHeight: child._getFittingHeight() });
        child.addResizeListener(this._nextResizeHandlerBinded);
        this._updateMovementEventListeners();
        const zIndex = parseInt(child._DOMNode.style.getPropertyValue('z-index'), 10);
        this._propagateZIndexToAncestorsIfGreater(zIndex);
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
            this._updateMovementEventListeners();
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

    getHitContainer() {
        const { top, right, left } = this._DOMNode.getBoundingClientRect();
        // eslint-disable-next-line object-curly-newline
        return { top, bottom: top + 10, right, left };
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

    _propagateZIndexToAncestorsIfGreater(zIndex) {
        const thisZIndex = parseInt(this._DOMNode.style.getPropertyValue('z-index'), 10);
        if (thisZIndex && thisZIndex > zIndex) return;

        this._DOMNode.style.setProperty('z-index', zIndex);
        if (this._parent) this._parent._propagateZIndexToAncestorsIfGreater(zIndex);
    }

    _getAllComponentIndexesAndMakeThisOnTheTop() {
        this._DOMNode.style.setProperty('z-index', 1000);
        return instanceList.map((inst) => ({
            index: inst._DOMNode.style.zIndex || 0,
            instance: inst,
        }));
    }

    _getDeepestNextPreviewChild() {
        if (this._next && this._next._opt.isPreview) {
            return this._next._getDeepestNextPreviewChild();
        }
        return this;
    }

    setPermissions(permissions = {}) {
        object.merge(this._addElements, permissions);
        if (!this._addElements.truthy) this.removeTruthy();
        if (!this._addElements.falsy) this.removeFalsy();
        if (!this._addElements.next) this.removeNext();
    }
}
