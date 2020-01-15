import ManipulateObject from './ManipulateObject';
import defaults from './ScratchComponentDefaults';

class ScratchSVGPath {
    static truthyBlock(options = {}) {
        const opt = ScratchSVGPath.getFormmatedOptions(options);
        const startPoint = `M ${opt.strokeWidth / 2},${4 + opt.strokeWidth / 2}`;
        const topLeftCorner = 'a 4 4 0 0 1 4,-4';
        const innerTopLeftCorner = 'a 4 4 0 0 0 -4,4';
        const innerBottomLeftCorner = 'a 4 4 0 0 0 4,4';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const innerShortLineToBottom = `v${opt.truthyChildContainerHeight - 8}`;
        const shortLineToRight = 'h 8';
        const shortLineToLeft = 'h -8';
        const shortLineToBottom = 'v 24';
        const midLineToBottom = `v${opt.lineHeight}`;
        const midLineToLeft = `h${64 - opt.totalWidth + opt.strokeWidth}`;
        const midLineToRight = `h${opt.totalWidth - 64 - opt.strokeWidth}`;
        const longLineToRight = `h${opt.totalWidth - 52 - opt.strokeWidth}`;
        const longLineToLeft = `h${52 - opt.totalWidth + opt.strokeWidth}`;
        const femaleFitting = 'c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2';
        const femaleFittingBypass = 'h 36';
        const maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';
        const maleFittingBypass = 'h -36';
        const closePath = 'z';

        const path = startPoint + topLeftCorner + shortLineToRight
            + femaleFitting + longLineToRight + topRightCorner
            + midLineToBottom + bottomRightCorner + midLineToLeft
            + maleFitting
            + shortLineToLeft + innerTopLeftCorner
            + innerShortLineToBottom + innerBottomLeftCorner
            + shortLineToRight
            + (opt.truthyFemaleFitting ? femaleFitting : femaleFittingBypass)
            + midLineToRight
            + topRightCorner + shortLineToBottom + bottomRightCorner
            + longLineToLeft
            + (opt.maleFitting ? maleFitting : maleFittingBypass)
            + shortLineToLeft
            + bottomLeftCorner + closePath;

        const width = opt.totalWidth;
        const height = opt.truthyChildContainerHeight + opt.lineHeight
            + opt.strokeWidth + (opt.maleFitting ? 48 : 40)
            + opt.nextHeight;

        return {
            path,
            dimensions: {
                width: `${width}px`,
                height: `${height}px`,
                'stroke-width': `${opt.strokeWidth}px`,
                fittingHeight: height - (opt.maleFitting ? 8 : 0)
                    - opt.strokeWidth,
                truthyChildContainer: {
                    width: opt.totalWidth - 12,
                    height: opt.truthyChildContainerHeight + opt.strokeWidth,
                    top: opt.lineHeight + 8,
                    left: 12,
                },
                nextComponentContainer: {
                    width: opt.totalWidth,
                    height: opt.nextHeight,
                    top: height - (opt.maleFitting ? 8 : 0) - opt.strokeWidth,
                    left: 0,
                },
            },
        };
    }

    static truthyFalsyBlock(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, appearence: {} });
        const opt = ScratchSVGPath.getFormmatedOptions(options);

        const startPoint = `M ${opt.strokeWidth / 2},${4 + opt.strokeWidth / 2}`;
        const topLeftCorner = 'a 4 4 0 0 1 4,-4';
        const innerTopLeftCorner = 'a 4 4 0 0 0 -4,4';
        const innerBottomLeftCorner = 'a 4 4 0 0 0 4,4';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const innerShortLineToBottomTrue = `v${opt.truthyChildContainerHeight - 8}`;
        const innerShortLineToBottomFalse = `v${opt.falsyChildContainerHeight - 8}`;
        const shortLineToRight = 'h 8';
        const shortLineToLeft = 'h -8';
        const shortLineToBottom = 'v 24';
        const midLineToBottom = `v${opt.lineHeight}`;
        const midLineToLeft = `h${64 - opt.totalWidth + opt.strokeWidth}`;
        const midLineToRight = `h${opt.totalWidth - 64 - opt.strokeWidth}`;
        const longLineToRight = `h${opt.totalWidth - 52 - opt.strokeWidth}`;
        const longLineToLeft = `h${52 - opt.totalWidth + opt.strokeWidth}`;
        const femaleFitting = 'c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2';
        const femaleFittingBypass = 'h 36';
        const maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';
        const maleFittingBypass = 'h -36';
        const closePath = 'z';

        const path = startPoint + topLeftCorner + shortLineToRight
            + femaleFitting + longLineToRight + topRightCorner
            + midLineToBottom + bottomRightCorner + midLineToLeft
            + maleFitting + shortLineToLeft + innerTopLeftCorner
            + innerShortLineToBottomTrue + innerBottomLeftCorner
            + shortLineToRight
            + (opt.truthyFemaleFitting ? femaleFitting : femaleFittingBypass)
            + midLineToRight
            + topRightCorner
            + shortLineToBottom + bottomRightCorner + midLineToLeft
            + maleFitting + shortLineToLeft + innerTopLeftCorner
            + innerShortLineToBottomFalse + innerBottomLeftCorner
            + shortLineToRight
            + (opt.falsyFemaleFitting ? femaleFitting : femaleFittingBypass)
            + midLineToRight
            + topRightCorner + shortLineToBottom + bottomRightCorner
            + longLineToLeft
            + (opt.maleFitting ? maleFitting : maleFittingBypass)
            + shortLineToLeft
            + bottomLeftCorner + closePath;

        const width = opt.totalWidth;
        const height = opt.truthyChildContainerHeight
            + opt.falsyChildContainerHeight + opt.nextHeight
            + opt.lineHeight + opt.strokeWidth
            + (opt.maleFitting ? 80 : 72);

        return {
            path,
            dimensions: {
                width: `${width}px`,
                height: `${height}px`,
                fittingHeight: height - (opt.maleFitting ? 8 : 0) - opt.strokeWidth,
                'stroke-width': `${opt.strokeWidth}px`,
                truthyChildContainer: {
                    width: opt.totalWidth - 12,
                    height: opt.truthyChildContainerHeight + opt.strokeWidth,
                    top: opt.lineHeight + 8,
                    left: 12,
                },
                falsyChildContainer: {
                    width: opt.totalWidth - 12,
                    height: opt.falsyChildContainerHeight + opt.strokeWidth,
                    top: opt.lineHeight + 8 + opt.truthyChildContainerHeight
                        + 32,
                    left: 12,
                },
                nextComponentContainer: {
                    width: opt.totalWidth,
                    height: opt.nextHeight,
                    top: height - (opt.maleFitting ? 8 : 0) - opt.strokeWidth,
                    left: 0,
                },
            },
        };
    }

    static statement(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, appearence: {} });
        const opt = ScratchSVGPath.getFormmatedOptions(options);

        const startPoint = `M ${opt.strokeWidth / 2},${4 + opt.strokeWidth / 2}`;
        const topLeftCorner = 'a 4 4 0 0 1 4,-4';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const shortLineToRight = 'h 8';
        const shortLineToLeft = 'h -8';
        const midLineToBottom = `v${opt.lineHeight}`;
        const longLineToRight = `h${opt.totalWidth - 52 - opt.strokeWidth}`;
        const longLineToLeft = `h${52 - opt.totalWidth + opt.strokeWidth}`;
        const femaleFitting = 'c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2';
        const maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';
        const maleFittingBypass = 'h -36';
        const closePath = 'z';

        const path = startPoint + topLeftCorner + shortLineToRight
            + femaleFitting + longLineToRight + topRightCorner
            + midLineToBottom + bottomRightCorner + longLineToLeft
            + (opt.maleFitting ? maleFitting : maleFittingBypass)
            + shortLineToLeft + bottomLeftCorner
            + closePath;

        const width = opt.totalWidth;
        const height = opt.lineHeight + opt.strokeWidth
            + (opt.maleFitting ? 16 : 8) + opt.nextHeight;

        return {
            path,
            dimensions: {
                width: `${width}px`,
                height: `${height}px`,
                fittingHeight: height - (opt.maleFitting ? 8 : 0) - opt.strokeWidth,
                'stroke-width': `${opt.strokeWidth}px`,
            },
            nextComponentContainer: {
                width: opt.totalWidth,
                height: opt.nextHeight,
                top: height - (opt.maleFitting ? 8 : 0) - opt.strokeWidth,
                left: 0,
            },
        };
    }

    static event(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, appearence: {} });
        const opt = ScratchSVGPath.getFormmatedOptions(options);

        const startPoint = `M ${opt.strokeWidth / 2},${17 + opt.strokeWidth / 2}`;
        const bigArc = 'c 25,-22 71,-22 96,0';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const shortLineToLeft = 'h -8';
        const midLineToBottom = `v${opt.lineHeight}`;
        const longLineToRight = `h${opt.totalWidth - 100}`;
        const longLineToLeft = `h${52 - opt.totalWidth}`;
        const maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';
        const closePath = 'z';

        const path = startPoint + bigArc
            + longLineToRight + topRightCorner
            + midLineToBottom + bottomRightCorner + longLineToLeft
            + maleFitting + shortLineToLeft + bottomLeftCorner
            + closePath;

        const width = opt.totalWidth + opt.strokeWidth;
        const height = opt.lineHeight + 33 + opt.strokeWidth
            + opt.nextHeight;

        return {
            path,
            dimensions: {
                width: `${width}px`,
                height: `${height}px`,
                fittingHeight: height - 8 - opt.strokeWidth,
                'stroke-width': `${opt.strokeWidth}px`,
            },
            nextComponentContainer: {
                width: opt.totalWidth,
                height: opt.nextHeight,
                top: height - 8 - opt.strokeWidth,
                left: 0,
            },
        };
    }

    static function(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, appearence: {} });
        const opt = ScratchSVGPath.getFormmatedOptions(options);

        const startPoint = `M ${opt.strokeWidth / 2},${20 + opt.strokeWidth / 2}`;
        const topLeftCorner = 'a 20 20 0 0 1 20,-20';
        const topRightCorner = 'a 20 20 0 0 1 20,20';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const shortLineToLeft = 'h -8';
        const midLineToBottom = `v${opt.lineHeight}`;
        const longLineToRight = `h${opt.totalWidth - 40}`;
        const longLineToLeft = `h${52 - opt.totalWidth}`;
        const maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';
        const closePath = 'z';

        const path = startPoint + topLeftCorner
            + longLineToRight + topRightCorner
            + midLineToBottom + bottomRightCorner + longLineToLeft
            + maleFitting + shortLineToLeft + bottomLeftCorner
            + closePath;

        const width = opt.totalWidth + opt.strokeWidth;
        const height = opt.lineHeight + opt.strokeWidth + 32
            + opt.nextHeight;

        return {
            path,
            dimensions: {
                width: `${width}px`,
                height: `${height}px`,
                fittingHeight: height - 8 - opt.strokeWidth,
                'stroke-width': `${opt.strokeWidth}px`,
            },
            nextComponentContainer: {
                width: opt.totalWidth,
                height: opt.nextHeight,
                top: height - 8 - opt.strokeWidth,
                left: 0,
            },
        };
    }

    static getFormmatedOptions(options) {
        ManipulateObject.objectMerge(options, { dimensions: {}, appearence: {} });

        return {
            nextHeight: (
                options.dimensions.nextComponentHeight || defaults.dimensions.nextComponentHeight),
            totalWidth: parseInt(
                options.attributes.style.width || defaults.attributes.style.width, 10,
            ),
            truthyChildContainerHeight: (options.dimensions.truthyChildContainerHeight
                || defaults.dimensions.truthyChildContainerHeight),
            falsyChildContainerHeight: (options.dimensions.falsyChildContainerHeight
                || defaults.dimensions.falsyChildContainerHeight),
            lineHeight: parseInt(options.attributes.style['line-height']
                || defaults.attributes.style['line-height'], 10),
            strokeWidth: parseInt(options.attributes.style['stroke-width']
                || defaults.attributes.style['stroke-width'], 10),
            maleFitting: typeof options.appearence.maleFitting === 'undefined'
                ? true : options.appearence.maleFitting,
            truthyFemaleFitting: typeof options.appearence.truthyFemaleFitting === 'undefined'
                ? true : options.appearence.truthyFemaleFitting,
            falsyFemaleFitting: typeof options.appearence.falsyFemaleFitting === 'undefined'
                ? true : options.appearence.falsyFemaleFitting,
        };
    }
}

export default ScratchSVGPath;
