export default {
    attributes: {
        class: '',
        id: '',
        style: {
            position: 'absolute', // relative or absolute
            width: '120px',
            'stroke-width': '1px', // border thickness
            'line-height': '24px', // height of description container
        },
    },
    fitting: {
        truthy: true, // female fitting used to connect to the truthy child next fitting
        falsy: true, // female fitting used to connect to the falsy child next fitting
        next: true, // male fitting used to connect to the next component
    },
};
