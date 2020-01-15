import ManipulateObject from './ManipulateObject';

class ScratchSVGPath {
    static conditionalBlock(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, appearence: {} });

        const componentNextHeight = options.dimensions.nextComponentHeight || 0;
        const componentTotalWidth = options.dimensions.width || 200;
        const componentTruthyChildContainerHeight = (
            options.dimensions.truthyChildContainerHeight || 28);
        const componentDescriptionHeight = options.dimensions.descriptionHeight || 36;
        const componentStrokeWidth = options.dimensions.strokeWidth || 1;
        const componentMaleFitting = typeof options.appearence.maleFitting === 'undefined'
            ? true : options.appearence.maleFitting;
        const componentFemaleFitting = typeof options.appearence.truthyFemaleFitting === 'undefined'
            ? true : options.appearence.truthyFemaleFitting;

        const startPoint = `M ${componentStrokeWidth / 2},${4 + componentStrokeWidth / 2}`;
        const topLeftCorner = 'a 4 4 0 0 1 4,-4';
        const innerTopLeftCorner = 'a 4 4 0 0 0 -4,4';
        const innerBottomLeftCorner = 'a 4 4 0 0 0 4,4';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const innerShortLineToBottom = `v${componentTruthyChildContainerHeight - 8}`;
        const shortLineToRight = 'h 8';
        const shortLineToLeft = 'h -8';
        const shortLineToBottom = 'v 24';
        const midLineToBottom = `v${componentDescriptionHeight}`;
        const midLineToLeft = `h${64 - componentTotalWidth + componentStrokeWidth}`;
        const midLineToRight = `h${componentTotalWidth - 64 - componentStrokeWidth}`;
        const longLineToRight = `h${componentTotalWidth - 52 - componentStrokeWidth}`;
        const longLineToLeft = `h${52 - componentTotalWidth + componentStrokeWidth}`;
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

        const width = componentTotalWidth;
        const height = componentTruthyChildContainerHeight + componentDescriptionHeight
            + componentStrokeWidth + (componentMaleFitting ? 48 : 40) + componentNextHeight;

        return {
            path,
            dimensions: {
                width,
                height,
                fittingHeight: height - (componentMaleFitting ? 8 : 0) - componentStrokeWidth,
                strokeWidth: componentStrokeWidth,
                truthyChildContainer: {
                    width: componentTotalWidth - 12,
                    height: componentTruthyChildContainerHeight + componentStrokeWidth,
                    top: componentDescriptionHeight + 8,
                    left: 12,
                },
                nextComponentContainer: {
                    width: componentTotalWidth,
                    height: componentNextHeight,
                    top: height - (componentMaleFitting ? 8 : 0) - componentStrokeWidth,
                    left: 0,
                },
            },
        };
    }

    static ifElseBlock(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, appearence: {} });

        const componentNextHeight = options.dimensions.nextComponentHeight || 0;
        const componentTotalWidth = options.dimensions.width || 200;
        const componentTruthyChildContainerHeight = (
            options.dimensions.truthyChildContainerHeight || 28);
        const componentFalsyChildrenContainerHeight = (
            options.dimensions.falsyChildContainerHeight || 28);

        const componentDescriptionHeight = options.dimensions.descriptionHeight || 36;
        const componentStrokeWidth = options.dimensions.strokeWidth || 1;

        const componentMaleFitting = typeof options.appearence.maleFitting === 'undefined'
            ? true : options.appearence.maleFitting;
        const componentTruthyFemaleFitting = typeof options.appearence.truthyFemaleFitting === 'undefined'
            ? true : options.appearence.truthyFemaleFitting;
        const componentFalsyFemaleFitting = typeof options.appearence.falsyFemaleFitting === 'undefined'
            ? true : options.appearence.falsyFemaleFitting;

        const startPoint = `M ${componentStrokeWidth / 2},${4 + componentStrokeWidth / 2}`;
        const topLeftCorner = 'a 4 4 0 0 1 4,-4';
        const innerTopLeftCorner = 'a 4 4 0 0 0 -4,4';
        const innerBottomLeftCorner = 'a 4 4 0 0 0 4,4';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const innerShortLineToBottomTrue = `v${componentTruthyChildContainerHeight - 8}`;
        const innerShortLineToBottomFalse = `v${componentFalsyChildrenContainerHeight - 8}`;
        const shortLineToRight = 'h 8';
        const shortLineToLeft = 'h -8';
        const shortLineToBottom = 'v 24';
        const midLineToBottom = `v${componentDescriptionHeight}`;
        const midLineToLeft = `h${64 - componentTotalWidth + componentStrokeWidth}`;
        const midLineToRight = `h${componentTotalWidth - 64 - componentStrokeWidth}`;
        const longLineToRight = `h${componentTotalWidth - 52 - componentStrokeWidth}`;
        const longLineToLeft = `h${52 - componentTotalWidth + componentStrokeWidth}`;
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

        const width = componentTotalWidth;
        const height = componentTruthyChildContainerHeight
            + componentFalsyChildrenContainerHeight + componentNextHeight
            + componentDescriptionHeight + componentStrokeWidth
            + (componentMaleFitting ? 80 : 72);

        return {
            path,
            dimensions: {
                width,
                height,
                fittingHeight: height - (componentMaleFitting ? 8 : 0) - componentStrokeWidth,
                strokeWidth: componentStrokeWidth,
                truthyChildContainer: {
                    width: componentTotalWidth - 12,
                    height: componentTruthyChildContainerHeight + componentStrokeWidth,
                    top: componentDescriptionHeight + 8,
                    left: 12,
                },
                falsyChildContainer: {
                    width: componentTotalWidth - 12,
                    height: componentFalsyChildrenContainerHeight + componentStrokeWidth,
                    top: componentDescriptionHeight + 8 + componentTruthyChildContainerHeight
                        + 32,
                    left: 12,
                },
                nextComponentContainer: {
                    width: componentTotalWidth,
                    height: componentNextHeight,
                    top: height - (componentMaleFitting ? 8 : 0) - componentStrokeWidth,
                    left: 0,
                },
            },
        };
    }

    static statement(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, appearence: {} });

        const componentNextHeight = options.dimensions.nextComponentHeight || 0;
        const componentTotalWidth = options.dimensions.width || 200;
        const componentDescriptionHeight = options.dimensions.descriptionHeight || 36;
        const componentStrokeWidth = options.dimensions.strokeWidth || 1;
        const componentMaleFitting = typeof options.appearence.maleFitting === 'undefined'
            ? true : options.appearence.maleFitting;

        const startPoint = `M ${componentStrokeWidth / 2},${4 + componentStrokeWidth / 2}`;
        const topLeftCorner = 'a 4 4 0 0 1 4,-4';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const shortLineToRight = 'h 8';
        const shortLineToLeft = 'h -8';
        const midLineToBottom = `v${componentDescriptionHeight}`;
        const longLineToRight = `h${componentTotalWidth - 52 - componentStrokeWidth}`;
        const longLineToLeft = `h${52 - componentTotalWidth + componentStrokeWidth}`;
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

        const width = componentTotalWidth;
        const height = componentDescriptionHeight + componentStrokeWidth
            + (componentMaleFitting ? 16 : 8) + componentNextHeight;

        return {
            path,
            dimensions: {
                width,
                height,
                fittingHeight: height - (componentMaleFitting ? 8 : 0) - componentStrokeWidth,
                strokeWidth: componentStrokeWidth,
            },
            nextComponentContainer: {
                width: componentTotalWidth,
                height: componentNextHeight,
                top: height - (componentMaleFitting ? 8 : 0) - componentStrokeWidth,
                left: 0,
            },
        };
    }

    static event(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, appearence: {} });

        const componentNextHeight = options.dimensions.nextComponentHeight || 0;
        const componentTotalWidth = options.dimensions.width || 200;
        const componentDescriptionHeight = options.dimensions.descriptionHeight || 36;
        const componentStrokeWidth = options.dimensions.strokeWidth || 1;

        const startPoint = `M ${componentStrokeWidth / 2},${17 + componentStrokeWidth / 2}`;
        const bigArc = 'c 25,-22 71,-22 96,0';
        const topRightCorner = 'a 4 4 0 0 1 4,4';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const shortLineToLeft = 'h -8';
        const midLineToBottom = `v${componentDescriptionHeight}`;
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
        const height = componentDescriptionHeight + 33 + componentStrokeWidth
            + componentNextHeight;

        return {
            path,
            dimensions: {
                width,
                height,
                fittingHeight: height - 8 - componentStrokeWidth,
                strokeWidth: componentStrokeWidth,
            },
            nextComponentContainer: {
                width: componentTotalWidth,
                height: componentNextHeight,
                top: height - 8 - componentStrokeWidth,
                left: 0,
            },
        };
    }

    static function(options = {}) {
        ManipulateObject.objectMerge(options, { dimensions: {}, appearence: {} });

        const componentNextHeight = options.dimensions.nextComponentHeight || 0;
        const componentTotalWidth = options.dimensions.width || 200;
        const componentDescriptionHeight = options.dimensions.descriptionHeight || 36;
        const componentStrokeWidth = options.dimensions.strokeWidth || 1;

        const startPoint = `M ${componentStrokeWidth / 2},${20 + componentStrokeWidth / 2}`;
        const topLeftCorner = 'a 20 20 0 0 1 20,-20';
        const topRightCorner = 'a 20 20 0 0 1 20,20';
        const bottomRightCorner = 'a 4 4 0 0 1 -4,4';
        const bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';
        const shortLineToLeft = 'h -8';
        const midLineToBottom = `v${componentDescriptionHeight}`;
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
        const height = componentDescriptionHeight + componentStrokeWidth + 32
            + componentNextHeight;

        return {
            path,
            dimensions: {
                width,
                height,
                fittingHeight: height - 8 - componentStrokeWidth,
                strokeWidth: componentStrokeWidth,
            },
            nextComponentContainer: {
                width: componentTotalWidth,
                height: componentNextHeight,
                top: height - 8 - componentStrokeWidth,
                left: 0,
            },
        };
    }
}

export default ScratchSVGPath;
