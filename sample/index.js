import ScratchComponent from '../src/components/ScratchComponent';

const statement = new ScratchComponent('statement', {
    dimensions: {
        width: 400,
        strokeWidth: 2,
        descriptionHeight: 60,
    },
    attributes: {
        class: 'statement',
        id: 'statement1',
    },
});

document.body.appendChild(statement.getNodeElement());


const conditionalBlock = new ScratchComponent('conditionalBlock', {
    dimensions: {
        width: 200,
        strokeWidth: 2,
        descriptionHeight: 40,
        truthyChildrenContainerHeight: 50,
        falsyChildrenContainerHeight: 15,
    },
    appearence: {
        maleFitting: false,
        truthyFemaleFitting: false,
    },
    attributes: {
        'data-selected': true,
        class: 'conditional',
    },
});

document.body.appendChild(conditionalBlock.getNodeElement());

const conditionalLoop = new ScratchComponent('conditionalLoop', {
    dimensions: {
        strokeWidth: 2,
        childrenContainerHeight: 50,
    },
    appearence: {
        femaleFitting: false,
    },
    attributes: {
        'data-selected': true,
        class: 'conditional',
        id: 'conditional-loop',
    },
});

document.body.appendChild(conditionalLoop.getNodeElement());
