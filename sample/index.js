/* eslint-disable no-underscore-dangle */
import ScratchComponent from '../src/components/ScratchComponent';

const statement = new ScratchComponent('statement', {
    appearence: {
        maleFitting: true,
    },
    attributes: {
        class: 'statement',
        id: 'statement',
        style: {
            width: '200px',
            'stroke-width': '2px',
            'line-height': '40px',
        },
    },
});

const statement2 = new ScratchComponent('statement', {
    appearence: {
        maleFitting: true,
    },
    attributes: {
        class: 'statement',
        id: 'statement2',
        style: {
            'stroke-width': '2px',
        },
    },
});

const statement3 = new ScratchComponent('statement', {
    appearence: {
        maleFitting: true,
    },
    attributes: {
        class: 'statement',
        id: 'statement3',
        style: {
            'stroke-width': '2px',
        },
    },
});

const truthyBlock = new ScratchComponent('truthyBlock', {
    attributes: {
        class: 'truthyBlock',
        style: {
            width: '180px',
            'stroke-width': '2px',
        },
    },
});

const truthyFalsyBlock = new ScratchComponent('truthyFalsyBlock', {
    attributes: {
        class: 'truthyFalsyBlock',
        style: {
            'stroke-width': '2px',
        },
    },
});

document.body.appendChild(truthyFalsyBlock.getNodeElement());
truthyFalsyBlock.addTruthyChild(truthyBlock);
truthyBlock.addTruthyChild(statement);
truthyFalsyBlock.addFalsyChild(statement2);

function truthyFalsyBlockAddItself() {
    truthyFalsyBlock.addFalsyChild(new ScratchComponent(truthyFalsyBlock, {
        attributes: {
            id: 'truthyFalsyCopy',
        },
    }));
}

window.setTimeout(() => {
    truthyFalsyBlockAddItself();

    window.setTimeout(() => {
        truthyFalsyBlock._falsy.removeTruthyChild();
        window.setTimeout(() => {
            truthyFalsyBlock.removeFalsyChild();

            window.setTimeout(() => {
                truthyFalsyBlock._truthy.addNextComponent(statement3);

                window.setTimeout(() => {
                    truthyFalsyBlock._truthy.removeNextComponent(statement3);

                    window.setTimeout(() => {
                        truthyFalsyBlock.addFalsyChild(new ScratchComponent(truthyBlock, {
                            appearence: {
                                maleFitting: false,
                            },
                        }));

                        window.setTimeout(() => {
                            truthyFalsyBlock.removeFalsyChild();
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}, 1000);
