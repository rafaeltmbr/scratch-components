import ScratchComponent from '../src/components/ScratchComponent';

const statement = new ScratchComponent('statement', {
    totalWidth: 400,
    strokeWidth: 2,
    descriptionHeight: 50,
    sibling: false,
    HTMLAttributes: {
        class: 'statement',
        id: 'statement1',
    },
});

document.body.appendChild(statement.getNodeElement());
