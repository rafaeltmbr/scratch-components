import objectUtil from './objectUtil';
import ScratchSVGPath from './ScratchSVGPath';

class componentUtil {
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

        return (componentUtil.isHorizontalCoincident(container1, container2)
            && componentUtil.isVerticalCoincident(container1, container2));
    }

    static isHorizontalCoincident(container1, container2) {
        const bounds = {
            start1: container1.left,
            end1: container1.right,
            start2: container2.left,
            end2: container2.right,
        };

        return componentUtil.isLineCoincident(bounds);
    }

    static isVerticalCoincident(container1, container2) {
        const bounds = {
            start1: container1.top,
            end1: container1.bottom,
            start2: container2.top,
            end2: container2.bottom,
        };

        return componentUtil.isLineCoincident(bounds);
    }

    static isLineCoincident(bounds) {
        // eslint-disable-next-line object-curly-newline
        const { start1, start2, end1, end2 } = bounds;

        return (start1 <= start2 && end1 >= start2)
            || (start1 <= end2 && end1 >= end2)
            || (start2 <= start1 && end1 <= end2);
    }

    static isValidShapeName(shapeName) {
        return typeof shapeName === 'string' && typeof ScratchSVGPath[shapeName] === 'function';
    }

    static createComponentHTML(path, dimensions, options) {
        const attributes = objectUtil.deepClone(options.attributes);
        objectUtil.merge(attributes.style, dimensions);

        const styleFormmated = componentUtil.createStringOfAttributes(attributes.style, ': ', '; ');
        const attributesFormmated = componentUtil.createStringOfAttributes(attributes, '="', '" ', '"');
        const containers = componentUtil.createContainers(dimensions);

        return (
            `<div ${attributesFormmated} style="${styleFormmated}">`
            + '<svg style="width: 100%; height: 100%">'
            + `<path d="${path}" /></svg>`
            + `${containers}</div></div>`
        );
    }

    // eslint-disable-next-line object-curly-newline
    static createContainers(dim) {
        const previousHTML = (componentUtil
            .createContainerHTML('scratch-previous-container', {
                height: 1,
                width: dim.next.width,
            }));

        const descriptionHTML = (componentUtil
            .createContainerHTML('scratch-description-container', dim.description));

        const truthyHTML = (componentUtil
            .createContainerHTML('scratch-truthy-container', dim.truthy));

        const falsyHTML = (componentUtil
            .createContainerHTML('scratch-falsy-container', dim.falsy));

        const nextHTML = '<div class="scratch-next-container" '
            + `style="width: 100%; height: ${dim.next.height}px; `
            + `top: ${dim.fittingHeight}px; `
            + 'left: 0px; position: absolute;">';

        return previousHTML + descriptionHTML + truthyHTML + falsyHTML + nextHTML;
    }

    static createContainerHTML(className, dimensions) {
        return (
            dimensions
                ? (
                    `<div class="${className || ''}" style="position: absolute; `
                    + `width: ${dimensions.width || 0}px; `
                    + `height: ${dimensions.height || 0}px; `
                    + `top: ${dimensions.top || 0}px; `
                    + `left: ${dimensions.left || 0}px"></div>`
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

    static updateContainerDimensions(container, next, dim) {
        // container.style.setProperty('height', `${dim.height + next.height}px`);
        // container.style.setProperty('width', `${dim.width}px`);
        container.style.setProperty('top', `${dim.top}px`);
        // container.style.setProperty('left', `${dim.left}px`);
    }
}

export default componentUtil;
