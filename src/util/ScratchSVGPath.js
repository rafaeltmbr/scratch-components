class ScratchSVGPath {
    static conditionalLoop(options = {}) {
        const componentWidth = options.width || 200;
        const componentInnerHeight = options.innerHeight || 28;
        const componentTextFieldHeight = options.textFieldHeight || 36;
        const componentStrokeWidth = options.strokeWidth || 1;

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
        const maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';
        const closePath = 'z';

        const path = startPoint + topLeftCorner + shortLineToRight
            + femaleFitting + longLineToRight + topRightCorner
            + midLineToBottom + bottomRightCorner + midLineToLeft
            + maleFitting + shortLineToLeft + innerTopLeftCorner
            + innerShortLineToBottom + innerBottomLeftCorner
            + shortLineToRight + femaleFitting + midLineToRight
            + topRightCorner + shortLineToBottom + bottomRightCorner
            + longLineToLeft + maleFitting + shortLineToLeft
            + bottomLeftCorner + closePath;

        const width = componentWidth + (2 * componentStrokeWidth)
            - Math.round(componentStrokeWidth / 2);
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

    static statementBlock(options = {}) {
        const componentWidth = options.width || 200;
        const componentTextFieldHeight = options.textFieldHeight || 36;
        const componentStrokeWidth = options.strokeWidth || 1;

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
        const closePath = 'z';

        const path = startPoint + topLeftCorner + shortLineToRight
            + femaleFitting + longLineToRight + topRightCorner
            + midLineToBottom + bottomRightCorner + longLineToLeft
            + maleFitting + shortLineToLeft + bottomLeftCorner
            + closePath;

        const width = componentWidth + (2 * componentStrokeWidth)
            - Math.round(componentStrokeWidth / 2);
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
