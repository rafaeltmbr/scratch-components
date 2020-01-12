/* eslint-disable no-console */
import SctrachSVGPath from '../../../util/ScratchSVGPath';
import ManipulateDOM from '../../../util/ManipulateDOM';

const width = 350;
const strokeWidth = 2;

const { path: eventPath, dimensions: eventDimensions } = SctrachSVGPath.event({
    width,
    strokeWidth,
    textFieldHeight: 30,
});

const eventTag = `<svg class="event" width="${eventDimensions.width}" height="${eventDimensions.height}"`
    + `stroke-width="${strokeWidth}" style="width: ${eventDimensions.width}px;`
    + `height: ${eventDimensions.height}px"><path d="${eventPath}" /></svg>`;

window.event = ManipulateDOM.createNodeElement(eventTag);
document.body.appendChild(window.event);

const { path: statementPath, dimensions: statementDimensions } = SctrachSVGPath.statement({
    width,
    strokeWidth,
    textFieldHeight: 30,
});

const statementTag = `<svg class="statement-block" width="${statementDimensions.width}" height="${statementDimensions.height}"`
    + `stroke-width="${strokeWidth}" style="width: ${statementDimensions.width}px;`
    + `height: ${statementDimensions.height}px"><path d="${statementPath}" /></svg>`;

window.statement = ManipulateDOM.createNodeElement(statementTag);
document.body.appendChild(window.statement);


const { path: statementPath2, dimensions: statementDimensions2 } = SctrachSVGPath.statement({
    width,
    strokeWidth,
    textFieldHeight: 30,
    maleFitting: false,
});

const statementTag2 = `<svg class="statement-block" width="${statementDimensions2.width}" height="${statementDimensions2.height}"`
    + `stroke-width="${strokeWidth}" style="width: ${statementDimensions2.width}px;`
    + `height: ${statementDimensions2.height}px"><path d="${statementPath2}" /></svg>`;

window.statement2 = ManipulateDOM.createNodeElement(statementTag2);
document.body.appendChild(window.statement2);


const { path: conditionalLoopPath, dimensions: conditionalLoopDimensions } = (
    SctrachSVGPath.conditionalLoop({
        width,
        strokeWidth,
        innerHeight: statementDimensions.fittingHeight,
        textFieldHeight: 30,
        femaleFitting: false,
        maleFitting: false,
    }));

const conditionalLoopTag = `<svg class="conditional-loop" width="${conditionalLoopDimensions.width}" height="${conditionalLoopDimensions.height}"`
    + `stroke-width="${strokeWidth}" style="width: ${conditionalLoopDimensions.width}px;`
    + `height: ${conditionalLoopDimensions.height}px"><path d="${conditionalLoopPath}" /></svg>`;

window.conditionalLoop = ManipulateDOM.createNodeElement(conditionalLoopTag);
document.body.appendChild(window.conditionalLoop);


const { path: conditionalBlockPath, dimensions: conditionalBlockDimensions } = (
    SctrachSVGPath.conditionalBlock({
        width,
        strokeWidth,
        innerHeightTrue: statementDimensions.fittingHeight,
        innerHeightFalse: conditionalLoopDimensions.fittingHeight,
        textFieldHeight: 30,
        falsyFemaleFitting: false,
    }));

const conditionalBlockTag = `<svg class="conditional-block" width="${conditionalBlockDimensions.width}" height="${conditionalBlockDimensions.height}"`
    + `stroke-width="${strokeWidth}" style="width: ${conditionalBlockDimensions.width}px;`
    + `height: ${conditionalBlockDimensions.height}px"><path d="${conditionalBlockPath}" /></svg>`;

window.conditionalBlock = ManipulateDOM.createNodeElement(conditionalBlockTag);
document.body.appendChild(window.conditionalBlock);


const svgList = document.querySelectorAll('svg');
const svgs = Object.keys(svgList).map((k) => svgList[k]);

svgs.forEach((svg) => {
    svg.children[0].addEventListener('mousedown', ({ clientX: startX, clientY: startY }) => {
        const initialStyle = window.getComputedStyle(svg);
        const initialX = parseInt(initialStyle.left, 10);
        const initialY = parseInt(initialStyle.top, 10);
        svg.setAttribute('data-grabbing', true);

        function handleMovement({ clientX, clientY }) {
            const offsetX = clientX - startX;
            const offsetY = clientY - startY;

            svg.style.setProperty('left', `${offsetX + initialX}px`);
            svg.style.setProperty('top', `${offsetY + initialY}px`);
        }

        window.addEventListener('mousemove', handleMovement);
        window.addEventListener('mouseup', function removeEventHandlers() {
            window.removeEventListener('mousemove', handleMovement);
            window.removeEventListener('mouseup', removeEventHandlers);
            svg.setAttribute('data-grabbing', false);
        });
    });
});
