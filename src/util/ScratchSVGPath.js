class ScratchSVGPath {
    static conditionalLoop(options = {}) {
        const componentTotalWidth = options.totalWidth || 200;
        const componentInnerHeight = options.innerHeight || 28;
        const componentDecriptionHeight = options.descriptionHeight || 36;
        const componentStrokeWidth = options.strokeWidth || 1;
        const componentMaleFitting = typeof options.maleFitting === 'undefined'
            ? true : options.maleFitting;
        const componentFemaleFitting = typeof options.femaleFitting === 'undefined'
            ? true : options.femaleFitting;

        const startPoint = `M ${componentStrokeWidth / 2},${4 + componentStrokeWidth / 2}`;
        const topLeftCorner = 'a 4 4 0 0 1 4,-4';
        const innerTopLeftCorner = 'a 4 4 0 0 0 -4,4';
        const innerBottomLeftCorner = 'a 4 4 0 0 0 4,4';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const innerShortLineToBottom = `v${componentInnerHeight - 8}`;
        const shortLineToRight = 'h 8';
        const shortLineToLeft = 'h -8';
        const shortLineToBottom = 'v 24';
        const midLineToBottom = `v${componentDecriptionHeight}`;
        const midLineToLeft = `h${64 - componentTotalWidth}`;
        const midLineToRight = `h${componentTotalWidth - 64}`;
        const longLineToRight = `h${componentTotalWidth - 52}`;
        const longLineToLeft = `h${52 - componentTotalWidth}`;
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
            + (componentFemaleFitting ? femaleFitting : femaleFittingBypass)
            + midLineToRight
            + topRightCorner + shortLineToBottom + bottomRightCorner
            + longLineToLeft
            + (componentMaleFitting ? maleFitting : maleFittingBypass)
            + shortLineToLeft
            + bottomLeftCorner + closePath;

        const width = componentTotalWidth + componentStrokeWidth;
        const height = componentInnerHeight + componentDecriptionHeight + componentStrokeWidth
            + (componentMaleFitting ? 48 : 40);

        return {
            path,
            dimensions: {
                width,
                height,
                fittingHeight: height - (componentMaleFitting ? 8 : 0) - componentStrokeWidth,
                strokeWidth: componentStrokeWidth,
            },
        };
    }

    static conditionalBlock(options = {}) {
        const componentTotalWidth = options.totalWidth || 200;
        const componentInnerHeightTrue = options.innerHeightTrue || 28;
        const componentInnerHeightFalse = options.innerHeightFalse || 28;
        const componentDecriptionHeight = options.descriptionHeight || 36;
        const componentStrokeWidth = options.strokeWidth || 1;
        const componentMaleFitting = typeof options.maleFitting === 'undefined'
            ? true : options.maleFitting;
        const componentTruthyFemaleFitting = typeof options.truthyFemaleFitting === 'undefined'
            ? true : options.truthyFemaleFitting;
        const componentFalsyFemaleFitting = typeof options.falsyFemaleFitting === 'undefined'
            ? true : options.falsyFemaleFitting;

        const startPoint = `M ${componentStrokeWidth / 2},${4 + componentStrokeWidth / 2}`;
        const topLeftCorner = 'a 4 4 0 0 1 4,-4';
        const innerTopLeftCorner = 'a 4 4 0 0 0 -4,4';
        const innerBottomLeftCorner = 'a 4 4 0 0 0 4,4';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const innerShortLineToBottomTrue = `v${componentInnerHeightTrue - 8}`;
        const innerShortLineToBottomFalse = `v${componentInnerHeightFalse - 8}`;
        const shortLineToRight = 'h 8';
        const shortLineToLeft = 'h -8';
        const shortLineToBottom = 'v 24';
        const midLineToBottom = `v${componentDecriptionHeight}`;
        const midLineToLeft = `h${64 - componentTotalWidth}`;
        const midLineToRight = `h${componentTotalWidth - 64}`;
        const longLineToRight = `h${componentTotalWidth - 52}`;
        const longLineToLeft = `h${52 - componentTotalWidth}`;
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
            + (componentTruthyFemaleFitting ? femaleFitting : femaleFittingBypass)
            + midLineToRight
            + topRightCorner
            + shortLineToBottom + bottomRightCorner + midLineToLeft
            + maleFitting + shortLineToLeft + innerTopLeftCorner
            + innerShortLineToBottomFalse + innerBottomLeftCorner
            + shortLineToRight
            + (componentFalsyFemaleFitting ? femaleFitting : femaleFittingBypass)
            + midLineToRight
            + topRightCorner + shortLineToBottom + bottomRightCorner
            + longLineToLeft
            + (componentMaleFitting ? maleFitting : maleFittingBypass)
            + shortLineToLeft
            + bottomLeftCorner + closePath;

        const width = componentTotalWidth + componentStrokeWidth;
        const height = componentInnerHeightTrue + componentInnerHeightFalse
            + componentDecriptionHeight + componentStrokeWidth
            + (componentMaleFitting ? 80 : 72);

        return {
            path,
            dimensions: {
                width,
                height,
                fittingHeight: height - (componentMaleFitting ? 8 : 0) - componentStrokeWidth,
                strokeWidth: componentStrokeWidth,
            },
        };
    }

    static statement(options = {}) {
        const componentTotalWidth = options.totalWidth || 200;
        const componentDecriptionHeight = options.descriptionHeight || 36;
        const componentStrokeWidth = options.strokeWidth || 1;
        const componentMaleFitting = typeof options.maleFitting === 'undefined'
            ? true : options.maleFitting;

        const startPoint = `M ${componentStrokeWidth / 2},${4 + componentStrokeWidth / 2}`;
        const topLeftCorner = 'a 4 4 0 0 1 4,-4';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const shortLineToRight = 'h 8';
        const shortLineToLeft = 'h -8';
        const midLineToBottom = `v${componentDecriptionHeight}`;
        const longLineToRight = `h${componentTotalWidth - 52}`;
        const longLineToLeft = `h${52 - componentTotalWidth}`;
        const femaleFitting = 'c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2';
        const maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';
        const maleFittingBypass = 'h -36';
        const closePath = 'z';

        const path = startPoint + topLeftCorner + shortLineToRight
            + femaleFitting + longLineToRight + topRightCorner
            + midLineToBottom + bottomRightCorner + longLineToLeft
            + (componentMaleFitting ? maleFitting : maleFittingBypass)
            + shortLineToLeft + bottomLeftCorner
            + closePath;

        const width = componentTotalWidth + componentStrokeWidth;
        const height = componentDecriptionHeight + componentStrokeWidth
            + (componentMaleFitting ? 16 : 8);

        return {
            path,
            dimensions: {
                width,
                height,
                fittingHeight: height - (componentMaleFitting ? 8 : 0) - componentStrokeWidth,
                strokeWidth: componentStrokeWidth,
            },
        };
    }

    static event(options = {}) {
        const componentTotalWidth = options.totalWidth || 200;
        const componentDecriptionHeight = options.descriptionHeight || 36;
        const componentStrokeWidth = options.strokeWidth || 1;

        const startPoint = `M ${componentStrokeWidth / 2},${17 + componentStrokeWidth / 2}`;
        const bigArc = 'c 25,-22 71,-22 96,0';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const shortLineToLeft = 'h -8';
        const midLineToBottom = `v${componentDecriptionHeight}`;
        const longLineToRight = `h${componentTotalWidth - 100}`;
        const longLineToLeft = `h${52 - componentTotalWidth}`;
        const maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';
        const closePath = 'z';

        const path = startPoint + bigArc
            + longLineToRight + topRightCorner
            + midLineToBottom + bottomRightCorner + longLineToLeft
            + maleFitting + shortLineToLeft + bottomLeftCorner
            + closePath;

        const width = componentTotalWidth + componentStrokeWidth;
        const height = componentDecriptionHeight + 33 + componentStrokeWidth;

        return {
            path,
            dimensions: {
                width,
                height,
                fittingHeight: height - 8 - componentStrokeWidth,
                strokeWidth: componentStrokeWidth,
            },
        };
    }

    static function(options = {}) {
        const componentTotalWidth = options.totalWidth || 200;
        const componentDecriptionHeight = options.descriptionHeight || 36;
        const componentStrokeWidth = options.strokeWidth || 1;

        const startPoint = `M ${componentStrokeWidth / 2},${20 + componentStrokeWidth / 2}`;
        const topLeftCorner = 'a 20 20 0 0 1 20,-20';
        const topRightCorner = 'a 20 20 0 0 1 20,20';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const shortLineToLeft = 'h -8';
        const midLineToBottom = `v${componentDecriptionHeight}`;
        const longLineToRight = `h${componentTotalWidth - 40}`;
        const longLineToLeft = `h${52 - componentTotalWidth}`;
        const maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';
        const closePath = 'z';

        const path = startPoint + topLeftCorner
            + longLineToRight + topRightCorner
            + midLineToBottom + bottomRightCorner + longLineToLeft
            + maleFitting + shortLineToLeft + bottomLeftCorner
            + closePath;

        const width = componentTotalWidth + componentStrokeWidth;
        const height = componentDecriptionHeight + componentStrokeWidth + 32;

        return {
            path,
            dimensions: {
                width,
                height,
                fittingHeight: height - 8 - componentStrokeWidth,
                strokeWidth: componentStrokeWidth,
            },
        };
    }
}

export default ScratchSVGPath;
