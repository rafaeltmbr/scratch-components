import ScratchComponent from '../src/components/ScratchComponent';

const statement = new ScratchComponent('statement', {
    width: 200,
    stroke: 2,
    innerTextHeigt: 30,
    class: 'statement',
    id: 'statement1',
    sibling: false,
});

document.body.appendChild(statement.getNodeElement());
