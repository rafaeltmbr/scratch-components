import ScratchComponent from '../src/ScratchComponent';
import { date } from './build/buildDate.json';
import DOMUtil from '../src/util/DOM';

function preventDefault(e) {
    e.preventDefault();
}

document.body.addEventListener('touchstart', preventDefault, { passive: false });
document.body.addEventListener('touchend', preventDefault, { passive: false });
document.body.addEventListener('touchmove', preventDefault, { passive: false });

const event = new ScratchComponent('event', {
    attributes: {
        class: 'event',
        style: {
            left: '20px',
            top: '20px',
        },
    },
});

const functionBlock = new ScratchComponent('function', {
    attributes: {
        class: 'function',
        style: {
            left: '180px',
            top: '20px',
        },
    },
});

const truthyFalsyBlock = new ScratchComponent('truthyFalsyBlock', {
    attributes: {
        class: 'truthyFalsyBlock',
        style: {
            left: '20px',
            top: '90px',
        },
    },
});

const truthyBlock = new ScratchComponent('truthyBlock', {
    attributes: {
        class: 'truthyBlock',
        style: {
            left: '180px',
            top: '90px',
        },
    },
    fitting: { next: false },
});

const statement = new ScratchComponent('statement', {
    attributes: {
        class: 'statement',
        style: {
            left: '180px',
            top: '200px',
        },
    },
});

const statement2 = new ScratchComponent(statement, {
    attributes: { style: { top: '260px' } },
    fitting: { next: false },
});

if (DOMUtil.isTouch()) {
    document.body.innerHTML = (
        '<div class="build-container">'
        + '<span class="build">Build date</span>'
        + `<span class="date">${date}</span></div>`
    );
} else {
    // eslint-disable-next-line no-console
    console.log('Build date', date);
}

document.body.appendChild(statement.getDOMNode());

document.body.appendChild(statement2.getDOMNode());

document.body.appendChild(event.getDOMNode());

document.body.appendChild(functionBlock.getDOMNode());

document.body.appendChild(truthyBlock.getDOMNode());

document.body.appendChild(truthyFalsyBlock.getDOMNode());
