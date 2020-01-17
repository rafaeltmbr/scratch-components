# ScratchComponent
THis is the base (super) class to all Scratch Components. It defined in the ScratchComponent.js file. Also, can be instantiated like so:
```javascript
const component = new ScratchComponent([componentShape | componentToBeDuplicated], options);
```

## Component Shape
There are five types of shapes, they are:
* **statement** - Renders a simple statement block
* **truthyBlock** - Renders a conditional component like *for*, *while* or *if* blocks
* **truthyFalsyBlock** - Renders a conditional block that has truthy and falsy fields like *ifElse* blocks
* **event** - Renders an event component
* **function** - Renders a function definition component

All shapes name are **case-sensitive**. It will throw an error if the shape name is not found.

## Options
The options object defaults to:
```javascript
const options = {
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

```

## Methods
The following methods are public:
* **getNodeElement( )** - Returns the DOM node in wich the component is based on
* **addTruthyChild(** *childComponent* **)** - Add the *childComponent* to be called when the expression function returns true
* **addFalsyChild(** *childComponent* **)** - Add the *childComponent* to be called when the expression function returns false
* **addNextComponent(** *nextComponent* **)** - Add the *nextComponent* to be called once the block execution is finished
* **addResizeListener(** *callbackListener* **)** - Register the *callbackListner* to be called every time a resize event happen
* **removeTruthyChild( )** - Remove the child added through the method **addTruthyChild**
* **removeFalsyChild( )** - Remove the child added through the method **addFalsyChild**
* **removeNextComponent( )** - Remove the component added through the method **addNextComponent**
* **removeResizeListener(** *callbackListener* **)** - Remove the *callbackListener* registered for resize events

Any other method starting with an undersore is private and should not be called outside its class.

## Events
The only suppored event is the resize, which is issued when the components DOM element resizes by any reason. Then, the **this** reference is given back the registered function.
