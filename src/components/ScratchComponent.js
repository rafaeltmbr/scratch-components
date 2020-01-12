/* eslint-disable no-underscore-dangle */
import ScratchSVGPath from '../util/ScratchSVGPath';
import ManiputaleDOM from '../util/ManipulateDOM';
import defaults from './ScratchComponentDefaults';

export default class ScratchComponent {
    constructor(componentType, options = {}) {
        this._assingOptions(options);
        this._createComponent(componentType);
    }

    _assingOptions(options) {
        this._opt = JSON.parse(JSON.stringify(defaults));
        Object.assign(this._opt, JSON.parse(JSON.stringify(options)));
    }

    _createComponent(type) {
        const { path, dimensions } = ScratchSVGPath[type](this._opt);
        const html = ScratchComponent.createSVGElementInnerHTML(path, dimensions, this._opt);
        this._node = ManiputaleDOM.createNodeElement(html);
    }

    static createSVGElementInnerHTML(path, dimensions, options) {
        const attributes = ScratchComponent.convertAttributesToHTML(options.HTMLAttributes);
        const innerHTML = (
            `<svg ${attributes} width="${dimensions.width}" height="${dimensions.height}"`
            + `stroke-width="${dimensions.strokeWidth}" style="width: ${dimensions.width}px;`
            + `height: ${dimensions.height}px"><path d="${path}" /></svg>`
        );

        return innerHTML;
    }

    static convertAttributesToHTML(attributes) {
        const html = Object.keys(attributes).map((k) => `${k}="${attributes[k]}"`).join(' ');

        return html;
    }

    getNodeElement() {
        return this._node;
    }
}
