import ScratchComponent from '../src/ScratchComponent';

const statement = new ScratchComponent('statement', {
    attributes: {
        class: 'statement',
        style: {
            left: '10px',
            top: '10px',
        },
    },
});

const event = new ScratchComponent('event', {
    attributes: {
        class: 'event',
        style: {
            left: '175px',
            top: '10px',
        },
    },
});

const functionBlock = new ScratchComponent('function', {
    attributes: {
        class: 'function',
        style: {
            left: '350px',
            top: '10px',
        },
    },
});

const truthyBlock = new ScratchComponent('truthyBlock', {
    attributes: {
        class: 'truthyBlock',
        style: {
            left: '10px',
            top: '150px',
        },
    },
});

const truthyFalsyBlock = new ScratchComponent('truthyFalsyBlock', {
    attributes: {
        class: 'truthyFalsyBlock',
        style: {
            left: '175px',
            top: '150px',
        },
    },
});

document.body.appendChild(statement.getDOMNode());

document.body.appendChild(event.getDOMNode());

document.body.appendChild(functionBlock.getDOMNode());

document.body.appendChild(truthyBlock.getDOMNode());

document.body.appendChild(truthyFalsyBlock.getDOMNode());
