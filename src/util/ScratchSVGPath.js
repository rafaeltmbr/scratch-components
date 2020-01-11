class ScratchSVGPath {
    static conditionalLoop(options = {}) {
        const componentWidth = options.width || 200;
        const componentInnerHeight = options.innerHeight || 28;
        const componentTextFieldHeight = options.textFieldHeight || 36;
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
        const midLineToBottom = `v${componentTextFieldHeight}`;
        const midLineToLeft = `h${64 - componentWidth}`;
        const midLineToRight = `h${componentWidth - 64}`;
        const longLineToRight = `h${componentWidth - 52}`;
        const longLineToLeft = `h${52 - componentWidth}`;
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

        const width = componentWidth + componentStrokeWidth;
        const height = componentInnerHeight + componentTextFieldHeight + 48
            + componentStrokeWidth;

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

    static conditionalBlock(options = {}) {
        const componentWidth = options.width || 200;
        const componentInnerHeightTrue = options.innerHeightTrue || 28;
        const componentInnerHeightFalse = options.innerHeightFalse || 28;
        const componentTextFieldHeight = options.textFieldHeight || 36;
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
        const midLineToBottom = `v${componentTextFieldHeight}`;
        const midLineToLeft = `h${64 - componentWidth}`;
        const midLineToRight = `h${componentWidth - 64}`;
        const longLineToRight = `h${componentWidth - 52}`;
        const longLineToLeft = `h${52 - componentWidth}`;
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

        const width = componentWidth + componentStrokeWidth;
        const height = componentInnerHeightTrue + componentInnerHeightFalse
            + componentTextFieldHeight + 80 + componentStrokeWidth;

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

    static statement(options = {}) {
        const componentWidth = options.width || 200;
        const componentTextFieldHeight = options.textFieldHeight || 36;
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
        const midLineToBottom = `v${componentTextFieldHeight}`;
        const longLineToRight = `h${componentWidth - 52}`;
        const longLineToLeft = `h${52 - componentWidth}`;
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

        const width = componentWidth + componentStrokeWidth;
        const height = componentTextFieldHeight + 16 + componentStrokeWidth;

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
