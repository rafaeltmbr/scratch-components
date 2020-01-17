import ManipulateObject from './ManipulateObject';

const defaults = {
    truthy: true,
    falsy: true,
    next: true,
    truthyHeight: 20,
    falsyHeight: 20,
    nextHeight: 0,
    width: 100,
    lineHeight: 20,
    strokeWidth: 1,
};

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
        const innerShortLineToBottom = `v${opt.truthyHeight - 8}`;
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
            + (opt.truthy ? femaleFitting : femaleFittingBypass)
            + midLineToRight
            + topRightCorner + shortLineToBottom + bottomRightCorner
            + longLineToLeft
            + (opt.next ? maleFitting : maleFittingBypass)
            + shortLineToLeft
            + bottomLeftCorner + closePath;

        const width = opt.totalWidth;
        const height = opt.truthyHeight + opt.lineHeight
            + opt.strokeWidth + (opt.next ? 48 : 40)
            + opt.nextHeight;

        return {
            path,
            dimensions: {
                width: `${width}px`,
                height: `${height}px`,
                'stroke-width': `${opt.strokeWidth}px`,
                fittingHeight: height - (opt.next ? 8 : 0)
                    - opt.strokeWidth,
                truthy: {
                    width: opt.totalWidth - 12,
                    height: opt.truthyHeight + opt.strokeWidth,
                    top: opt.lineHeight + 8,
                    left: 12,
                },
                next: {
                    width: opt.totalWidth,
                    height: opt.nextHeight,
                    top: height - (opt.next ? 8 : 0) - opt.strokeWidth,
                    left: 0,
                },
            },
        };
    }

    static truthyFalsyBlock(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, fitting: {} });
        const opt = ScratchSVGPath.getFormmatedOptions(options);

        const startPoint = `M ${opt.strokeWidth / 2},${4 + opt.strokeWidth / 2}`;
        const topLeftCorner = 'a 4 4 0 0 1 4,-4';
        const innerTopLeftCorner = 'a 4 4 0 0 0 -4,4';
        const innerBottomLeftCorner = 'a 4 4 0 0 0 4,4';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const innerShortLineToBottomTrue = `v${opt.truthyHeight - 8}`;
        const innerShortLineToBottomFalse = `v${opt.falsyHeight - 8}`;
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
            + (opt.truthy ? femaleFitting : femaleFittingBypass)
            + midLineToRight
            + topRightCorner
            + shortLineToBottom + bottomRightCorner + midLineToLeft
            + maleFitting + shortLineToLeft + innerTopLeftCorner
            + innerShortLineToBottomFalse + innerBottomLeftCorner
            + shortLineToRight
            + (opt.falsy ? femaleFitting : femaleFittingBypass)
            + midLineToRight
            + topRightCorner + shortLineToBottom + bottomRightCorner
            + longLineToLeft
            + (opt.next ? maleFitting : maleFittingBypass)
            + shortLineToLeft
            + bottomLeftCorner + closePath;

        const width = opt.totalWidth;
        const height = opt.truthyHeight
            + opt.falsyHeight + opt.nextHeight
            + opt.lineHeight + opt.strokeWidth
            + (opt.next ? 80 : 72);

        return {
            path,
            dimensions: {
                width: `${width}px`,
                height: `${height}px`,
                fittingHeight: height - (opt.next ? 8 : 0) - opt.strokeWidth,
                'stroke-width': `${opt.strokeWidth}px`,
                truthy: {
                    width: opt.totalWidth - 12,
                    height: opt.truthyHeight + opt.strokeWidth,
                    top: opt.lineHeight + 8,
                    left: 12,
                },
                falsy: {
                    width: opt.totalWidth - 12,
                    height: opt.falsyHeight + opt.strokeWidth,
                    top: opt.lineHeight + 8 + opt.truthyHeight
                        + 32,
                    left: 12,
                },
                next: {
                    width: opt.totalWidth,
                    height: opt.nextHeight,
                    top: height - (opt.next ? 8 : 0) - opt.strokeWidth,
                    left: 0,
                },
            },
        };
    }

    static statement(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, fitting: {} });
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
            + (opt.next ? maleFitting : maleFittingBypass)
            + shortLineToLeft + bottomLeftCorner
            + closePath;

        const width = opt.totalWidth;
        const height = opt.lineHeight + opt.strokeWidth
            + (opt.next ? 16 : 8) + opt.nextHeight;

        return {
            path,
            dimensions: {
                width: `${width}px`,
                height: `${height}px`,
                fittingHeight: height - (opt.next ? 8 : 0) - opt.strokeWidth,
                'stroke-width': `${opt.strokeWidth}px`,
            },
            next: {
                width: opt.totalWidth,
                height: opt.nextHeight,
                top: height - (opt.next ? 8 : 0) - opt.strokeWidth,
                left: 0,
            },
        };
    }

    static event(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, fitting: {} });
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
            next: {
                width: opt.totalWidth,
                height: opt.nextHeight,
                top: height - 8 - opt.strokeWidth,
                left: 0,
            },
        };
    }

    static function(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, fitting: {} });
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
            next: {
                width: opt.totalWidth,
                height: opt.nextHeight,
                top: height - 8 - opt.strokeWidth,
                left: 0,
            },
        };
    }

    static getFormmatedOptions(options) {
        ManipulateObject.objectMerge(options, { dimensions: {}, fitting: {} });

        const { dimensions: dim, fitting: app, attributes: attr } = options;
        return {
            nextHeight: (dim.nextHeight || defaults.nextHeight),
            totalWidth: (parseInt(attr.style.width, 10) || defaults.width),
            lineHeight: parseInt(attr.style['line-height'], 10) || defaults.lineHeight,
            strokeWidth: parseInt(attr.style['stroke-width'], 10) || defaults.strokeWidth,
            truthyHeight: dim.truthyHeight || defaults.truthyHeight,
            falsyHeight: dim.falsyHeight || defaults.falsyHeight,

            next: typeof app.next === 'undefined' ? defaults.next : app.next,
            truthy: typeof app.truthy === 'undefined' ? defaults.truthy : app.truthy,
            falsy: typeof app.falsy === 'undefined' ? defaults.falsy : app.falsy,
        };
    }
}

export default ScratchSVGPath;
