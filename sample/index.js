import ScratchComponent from '../src/components/ScratchComponent';

const statement = new ScratchComponent('statement', {
    dimensions: {
        width: 250,
        strokeWidth: 2,
        descriptionHeight: 60,
    },
    appearence: {
        maleFitting: true,
    },
    attributes: {
        class: 'statement',
        id: 'statement1',
    },
});

const statement2 = new ScratchComponent('statement', {
    dimensions: {
        width: 150,
        strokeWidth: 2,
        descriptionHeight: 30,
    },
    appearence: {
        maleFitting: false,
    },
    attributes: {
        class: 'statement',
        id: 'statement2',
    },
});

const statement3 = new ScratchComponent('statement', {
    dimensions: {
        width: 220,
        strokeWidth: 2,
        descriptionHeight: 40,
    },
    attributes: {
        class: 'statement',
        id: 'statement3',
    },
});

const statement4 = new ScratchComponent('statement', {
    dimensions: {
        width: 180,
        strokeWidth: 2,
        descriptionHeight: 30,
    },
    attributes: {
        class: 'statement',
        id: 'statement4',
    },
});


const ifElseBlock = new ScratchComponent('ifElseBlock', {
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
        id: 'main-block',
    },
});

document.body.appendChild(ifElseBlock.getNodeElement());

const ifElseBlock2 = new ScratchComponent('ifElseBlock', {
    dimensions: {
        width: 150,
        strokeWidth: 2,
        descriptionHeight: 40,
        truthyChildrenContainerHeight: 40,
        falsyChildrenContainerHeight: 80,
    },
    appearence: {
        truthyFemaleFitting: false,
    },
    attributes: {
        'data-selected': true,
        class: 'conditional',
    },
});

ifElseBlock.addFalsyChild(ifElseBlock2);


const conditionalBlock = new ScratchComponent('conditionalBlock', {
    dimensions: {
        strokeWidth: 2,
        truthyChildrenContainerHeight: 50,
    },
    appearence: {
        truthyFemaleFitting: false,
    },
    attributes: {
        'data-selected': true,
        class: 'conditional',
        id: 'if',
    },
});

statement2.addNextComponent(statement4);
ifElseBlock.addTruthyChild(conditionalBlock);
ifElseBlock2.addTruthyChild(statement2);

window.setTimeout(() => {
    conditionalBlock.addTruthyChild(statement);
    window.setTimeout(() => {
        conditionalBlock.removeTruthyChild();
    }, 2000);

    window.setTimeout(() => {
        statement2.resize({ width: 220 });
    }, 500);

    window.setTimeout(() => {
        ifElseBlock2.addFalsyChild(statement3);
        window.setTimeout(() => {
            ifElseBlock2.removeFalsyChild();

            window.setTimeout(() => {
                statement2.removeNextComponent();
            }, 1000);
        }, 2000);
    }, 1000);
}, 500);


const ifElseBlock3 = new ScratchComponent(ifElseBlock2, {
    position: 'absolute',
    dimensions: {
        width: 200,
    },
    attributes: {
        id: 'copy-block',
    },
});

document.body.appendChild(ifElseBlock3.getNodeElement());

window.setTimeout(() => {
    ifElseBlock3.addFalsyChild(new ScratchComponent(statement3, {
        attributes: {
            id: 'statement5',
        },
    }));

    window.setTimeout(() => {
        ifElseBlock3.removeTruthyChild();

        window.setTimeout(() => {
            ifElseBlock3.removeFalsyChild();
        }, 1000);
    }, 1000);
}, 750);
