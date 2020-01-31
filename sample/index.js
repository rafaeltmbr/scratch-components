import ScratchComponent from '../src/ScratchComponent';

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
    fitting: { next: true },
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

document.body.appendChild(statement.getDOMNode());

document.body.appendChild(event.getDOMNode());

document.body.appendChild(functionBlock.getDOMNode());

document.body.appendChild(truthyBlock.getDOMNode());

document.body.appendChild(truthyFalsyBlock.getDOMNode());
