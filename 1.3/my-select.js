class MySelect extends HTMLElement {
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;
    #options = [];
    #shadow;

    constructor() {
        super();
        console.log('Hello World');
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: "open" });
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
            <style>
                :host{
                    position: relative;
                    display: inline-block;
                    font-family: var(--select-font-family, 'Segoe UI', Arial, sans-serif);
                    font-size: 14px;
                    --select-primary: var(--select-primary-color, #6366f1);
                    --select-border: var(--select-border-color, #d1d5db);
                    --select-bg: var(--select-background, #ffffff);
                    --select-text: var(--select-text-color, #374151);
                    --select-hover: var(--select-hover-bg, #f3f4f6);
                    --select-radius: var(--select-border-radius, 6px);
                }

                .select-button{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 200px;
                    padding: 10px 14px;
                    border: 1px solid var(--select-border);
                    border-radius: var(--select-radius);
                    background: var(--select-bg);
                    color: var(--select-text);
                    cursor: pointer;
                    font-size: 14px;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    gap: 8px;
                }
                .select-button:hover{
                    border-color: var(--select-primary);
                }
                .select-button:focus{
                    outline: none;
                    border-color: var(--select-primary);
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
                }
                .select-button::after{
                    content: '';
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 6px solid var(--select-text);
                    transition: transform 0.2s;
                }
                .select-button.open::after{
                    transform: rotate(180deg);
                }

                .select-popup{
                    display: none;
                    position: absolute;
                    top: calc(100% + 4px);
                    left: 0;
                    right: 0;
                    min-width: 200px;
                    background: var(--select-bg);
                    border: 1px solid var(--select-border);
                    border-radius: var(--select-radius);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                    overflow: hidden;
                    z-index: 1000;
                }
                .select-popup.open{
                    display: block;
                }

                .select-popup-search{
                    width: 100%;
                    box-sizing: border-box;
                    padding: 10px 14px;
                    border: none;
                    border-bottom: 1px solid var(--select-border);
                    font-size: 14px;
                    outline: none;
                    background: var(--select-bg);
                    color: var(--select-text);
                }
                .select-popup-search::placeholder{
                    color: #9ca3af;
                }

                .select-popup-options{
                    max-height: 200px;
                    overflow-y: auto;
                    padding: 4px 0;
                }
                .select-popup-options::-webkit-scrollbar{
                    width: 6px;
                }
                .select-popup-options::-webkit-scrollbar-thumb{
                    background: #d1d5db;
                    border-radius: 3px;
                }

                .option{
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 14px;
                    cursor: pointer;
                    color: var(--select-text);
                    transition: background 0.15s;
                    user-select: none;
                }
                .option:hover{
                    background: var(--select-hover);
                }
                .option input[type="checkbox"]{
                    width: 16px;
                    height: 16px;
                    accent-color: var(--select-primary);
                    cursor: pointer;
                    margin: 0;
                }
            </style>
            <button class="select-button">раскрыть список</button>
            <div class="select-popup">
                <input class="select-popup-search" placeholder="Search..." />
                <div class="select-popup-options"></div>
            </div>
        `;

        this.#shadow.append(template.content.cloneNode(true));

        this.#selectButton = this.#shadow.querySelector(".select-button");
        this.#selectPopup = this.#shadow.querySelector(".select-popup");
        this.#selectPopupSearch = this.#shadow.querySelector(".select-popup input");
        this.#optionsBox = this.#shadow.querySelector(".select-popup-options");

        this.#selectButton.addEventListener('click', () => this.#openPopup());
    }

    #openPopup() {
        this.#selectPopup.classList.toggle("open");
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
