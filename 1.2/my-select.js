class MySelect extends HTMLElement {
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;
    #options = [];

    constructor() {
        super();
        console.log('Hello World');
    }

    connectedCallback() {
        this.#createTemplate();

        console.log('connectedCallback');
        this.#options = Array.from(this.querySelectorAll('option')).map(option => ({
            value: option.value,
            text: option.textContent
        }));

        this.querySelectorAll('option').forEach(option => option.remove());

        this.#optionsBox.append(this.#renderOptions(this.#options));
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }

    attributeChangedCallback() {
    }

    #createTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <button class="select-button"></button>
            <div class="select-popup">
                <input class="select-popup-search" placeholder="Search..." />
                <div class="select-popup-options"></div>
            </div>
        `;

        this.append(template.content.cloneNode(true));

        this.#selectButton = this.querySelector(".select-button");
        this.#selectPopup = this.querySelector(".select-popup");
        this.#selectPopupSearch = this.querySelector(".select-popup-search");
        this.#optionsBox = this.querySelector(".select-popup-options");
    }

    #renderOptions(options) {
        console.log('renderOptions');
        const template = document.createElement('template');
        template.innerHTML = options.map(option => `
            <label class="option" data-value="${option.value}"><input type="checkbox" />${option.text}</label>
        `).join('');

        const container = document.createElement('div');
        container.className = 'select-popup-options';
        container.append(template.content.cloneNode(true));

        return container;
    }
}

const componentName = document.currentScript.dataset.name;
customElements.define(componentName, MySelect);
