import ScratchComponent from '../src/components/ScratchComponent';
import DOMUtil from '../src/util/DOMUtil';

function createComponentContainer(component) {
    const container = DOMUtil.createNodeElement('<div class="component-container"></div>');
    container.appendChild(component.getDOMNode());
    container.appendChild(DOMUtil.createNodeElement(`<header>${component.getShapeName()}</header>`));
    return container;
}

const statement = new ScratchComponent('statement', {
    attributes: {
        class: 'statement',
        style: {
            width: '120px',
        },
    },
});

const event = new ScratchComponent('event', {
    attributes: {
        class: 'event',
        style: {
            width: '120px',
        },
    },
});

const functionBlock = new ScratchComponent('function', {
    attributes: {
        class: 'function',
        style: {
            width: '120px',
        },
    },
});

const truthyBlock = new ScratchComponent('truthyBlock', {
    attributes: {
        class: 'truthyBlock',
        style: {
            width: '120px',
        },
    },
});

const truthyFalsyBlock = new ScratchComponent('truthyFalsyBlock', {
    attributes: {
        class: 'truthyFalsyBlock',
        style: {
            width: '120px',
        },
    },
});

document.body.setAttribute('data-presentation', true);

const statementContainer = createComponentContainer(statement);
document.body.appendChild(statementContainer);

const eventContainer = createComponentContainer(event);
document.body.appendChild(eventContainer);

const functionContainer = createComponentContainer(functionBlock);
document.body.appendChild(functionContainer);

const truthyContainer = createComponentContainer(truthyBlock);
document.body.appendChild(truthyContainer);

const truthyFalsyContainer = createComponentContainer(truthyFalsyBlock);
document.body.appendChild(truthyFalsyContainer);
