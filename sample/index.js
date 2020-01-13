import ScratchComponent from '../src/components/ScratchComponent';

const statement = new ScratchComponent('statement', {
    position: {
        top: 10,
        left: 10,
    },
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


const ifElseBlock = new ScratchComponent('ifElseBlock', {
    position: {
        top: 30,
        left: 100,
    },
    dimensions: {
        width: 200,
        strokeWidth: 2,
        descriptionHeight: 40,
        truthyChildrenContainerHeight: 40,
        falsyChildrenContainerHeight: 80,
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

document.body.appendChild(ifElseBlock.getNodeElement());


const conditionalBlock = new ScratchComponent('conditionalBlock', {
    position: {
        top: 350,
        left: 20,
    },
    dimensions: {
        strokeWidth: 2,
        truthyChildrenContainerHeight: 50,
    },
    appearence: {
        femaleFitting: false,
    },
    attributes: {
        'data-selected': true,
        class: 'conditional',
        id: 'if',
    },
});

ifElseBlock.addTruthyChild(conditionalBlock);

window.setTimeout(() => {
    conditionalBlock.addTruthyChild(statement);
    window.setTimeout(() => {
        conditionalBlock.removeTruthyChild();
    }, 1500);
}, 500);
