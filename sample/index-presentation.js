import ScratchComponent from '../src/components/ScratchComponent';
import DOMUtil from '../src/util/DOMUtil';
import objectUtil from '../src/util/objectUtil';

function createComponentContainer(component) {
    const container = DOMUtil.createNodeElement('<div class="component-container"></div>');
    container.appendChild(component.getDOMNode());
    container.appendChild(DOMUtil.createNodeElement('<div style="height: 40px"></div>')); // `<header>${component.getShapeName()}</header>`));
    return container;
}

const statement = new ScratchComponent('statement', {
    attributes: {
        class: 'statement',
    },
});

const event = new ScratchComponent('event', {
    attributes: {
        class: 'event',
    },
});

const functionBlock = new ScratchComponent('function', {
    attributes: {
        class: 'function',
    },
});

const truthyBlock = new ScratchComponent('truthyBlock', {
    attributes: {
        class: 'truthyBlock',
    },
});

const truthyFalsyBlock = new ScratchComponent('truthyFalsyBlock', {
    attributes: {
        class: 'truthyFalsyBlock',
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

function showAllContainers() {
    document.body.setAttribute('data-show-containers', true);

    function nameIt(node) {
        // eslint-disable-next-line
        node.innerText = node.getAttribute('class').split('-')[1];
    }

    const classes = ['.scratch-description-container', '.scratch-truthy-container',
        '.scratch-falsy-container', '.scratch-next-container'];

    classes.forEach((c) => objectUtil.toArray(document.querySelectorAll(c)).forEach(nameIt));
}

// showAllContainers();
