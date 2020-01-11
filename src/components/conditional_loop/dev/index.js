/* eslint-disable no-console */
import SctrachSVGPath from '../../../util/ScratchSVGPath';
import ManipulateDOM from '../../../util/ManipulateDOM';

const width = 350;
const strokeWidth = 2;

const { path: path2, dimensions: dimensions2 } = SctrachSVGPath.statementBlock({
    width,
    strokeWidth,
    textFieldHeight: 30,
});

const conditionalLoopSVG2 = `<svg class="statement-block" width="${dimensions2.width}" height="${dimensions2.height}"`
    + `stroke-width="${strokeWidth}" style="width: ${dimensions2.width}px;`
    + `height: ${dimensions2.height}px"><path d="${path2}" /></svg>`;

window.block2 = ManipulateDOM.createNodeElement(conditionalLoopSVG2);
document.body.appendChild(window.block2);
console.log('dimensions2:', dimensions2);

const { path, dimensions } = SctrachSVGPath.conditionalLoop({
    width,
    strokeWidth,
    innerHeight: dimensions2.fittingHeight,
    textFieldHeight: 30,
});

const conditionalLoopSVG = `<svg class="conditional-loop" width="${dimensions.width}" height="${dimensions.height}"`
+ `stroke-width="${strokeWidth}" style="width: ${dimensions.width}px;`
+ `height: ${dimensions.height}px"><path d="${path}" /></svg>`;

window.block1 = ManipulateDOM.createNodeElement(conditionalLoopSVG);
document.body.appendChild(window.block1);
console.log('dimensions:', dimensions);


const svgList = document.querySelectorAll('svg');
const svgs = Object.keys(svgList).map((k) => svgList[k]);

svgs.forEach((svg) => {
    svg.addEventListener('mousedown', ({ clientX: startX, clientY: startY }) => {
        const initialStyle = window.getComputedStyle(svg);
        const initialX = parseInt(initialStyle.left, 10);
        const initialY = parseInt(initialStyle.top, 10);

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
        });
    });
});
