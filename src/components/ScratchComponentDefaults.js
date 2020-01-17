export default {
    attributesHTML: {
        class: '',
        id: '',
        style: {
            position: 'relative', // relative or absolute
            width: '100px',
            'stroke-width': '1px', // components border width
            'line-height': '24px', // height of the components text header
        },
    },
    fitting: {
        truthy: true, // female fitting used to connect to the truthy child next fitting
        falsy: true, // female fitting used to connect to the falsy child next fitting
        next: true, // male fitting used to connect to the next component
    },
};
