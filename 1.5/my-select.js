class MySelect extends HTMLElement {
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;
    #options = [];
    #shadow;
    #selectedValues = [];
    #outsideClickHandler;

    constructor() {
        super();
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
        this.#selectPopupSearch.addEventListener('input', (e) => this.#filterOptions(e.target.value));
        this.#optionsBox.addEventListener('change', (e) => this.#onOptionChange(e));

        this.#outsideClickHandler = (e) => {
            if (!this.contains(e.target)) {
                this.#closePopup();
            }
        };
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.#outsideClickHandler);
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
                <slot name="search">
                    <input class="select-popup-search" placeholder="Search..." />
                </slot>
                <div class="select-popup-options"></div>
            </div>
        `;

        this.#shadow.append(template.content.cloneNode(true));

        this.#selectButton = this.#shadow.querySelector(".select-button");
        this.#selectPopup = this.#shadow.querySelector(".select-popup");
        this.#selectPopupSearch = this.querySelector('[slot="search"] input');
        this.#optionsBox = this.#shadow.querySelector(".select-popup-options");

        this.#selectButton.addEventListener('click', () => this.#openPopup());
    }

    #openPopup() {
        const isOpen = this.#selectPopup.classList.toggle("open");
        if (isOpen) {
            document.addEventListener('click', this.#outsideClickHandler);
        } else {
            document.removeEventListener('click', this.#outsideClickHandler);
        }
    }

    #closePopup() {
        this.#selectPopup.classList.remove("open");
        document.removeEventListener('click', this.#outsideClickHandler);
    }

    #filterOptions(query) {
        const filtered = this.#options.filter(option =>
            option.text.toLowerCase().includes(query.toLowerCase())
        );
        this.#optionsBox.innerHTML = '';
        this.#optionsBox.append(this.#renderOptions(filtered));
        this.#syncCheckedState();
    }

    #onOptionChange(e) {
        if (e.target.type === 'checkbox') {
            const label = e.target.closest('.option');
            const value = label.dataset.value;
            if (e.target.checked) {
                if (!this.#selectedValues.includes(value)) {
                    this.#selectedValues.push(value);
                }
            } else {
                this.#selectedValues = this.#selectedValues.filter(v => v !== value);
            }
            this.value = this.#selectedValues.join(',');
            this.#updateButtonText();
        }
    }

    #syncCheckedState() {
        const labels = this.#optionsBox.querySelectorAll('.option');
        labels.forEach(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            checkbox.checked = this.#selectedValues.includes(label.dataset.value);
        });
    }

    #updateButtonText() {
        if (this.#selectedValues.length === 0) {
            this.#selectButton.textContent = 'раскрыть список';
        } else {
            const selectedTexts = this.#options
                .filter(opt => this.#selectedValues.includes(opt.value))
                .map(opt => opt.text);
            this.#selectButton.textContent = selectedTexts.join(', ');
        }
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

const selectComponentName = document.currentScript.dataset.name;
customElements.define(selectComponentName, MySelect);
