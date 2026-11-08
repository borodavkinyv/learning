class MySelect extends HTMLElement {
    constructor() {
        super();
        console.log('Hello World');
    }
}

const componentName = document.currentScript.dataset.name;
customElements.define(componentName, MySelect);
