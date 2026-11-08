class MyCard extends HTMLElement {
    #shadow;
    #headerElement;
    #subHeaderElement;

    static observedAttributes = ["header", "sub-header"];

    constructor() {
        super();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: "open" });
        this.#createTemplate();

        const header = this.getAttribute("header");
        if (header) {
            this.#headerElement.textContent = header;
        }

        const subHeader = this.getAttribute("sub-header");
        if (subHeader) {
            this.#subHeaderElement.textContent = subHeader;
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "header" && this.#headerElement) {
            this.#headerElement.textContent = newValue;
        }
        if (name === "sub-header" && this.#subHeaderElement) {
            this.#subHeaderElement.textContent = newValue;
        }
    }

    #createTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host{
                    display: block;
                    font-family: var(--card-font-family, 'Segoe UI', Arial, sans-serif);
                    font-size: 14px;
                    --card-border: var(--card-border-color, #e5e7eb);
                    --card-bg: var(--card-background, #ffffff);
                    --card-text: var(--card-text-color, #374151);
                    --card-header-bg: var(--card-header-bg, #f9fafb);
                    --card-radius: var(--card-border-radius, 8px);
                }

                .card{
                    border: 1px solid var(--card-border);
                    border-radius: var(--card-radius);
                    background: var(--card-bg);
                    overflow: hidden;
                }

                .card-header{
                    padding: 14px 18px;
                    background: var(--card-header-bg);
                    border-bottom: 1px solid var(--card-border);
                    font-weight: 600;
                    color: var(--card-text);
                }

                .card-sub-header{
                    padding: 6px 18px;
                    background: var(--card-header-bg);
                    border-bottom: 1px solid var(--card-border);
                    font-size: 12px;
                    color: var(--card-text);
                    opacity: 0.7;
                }

                .card-body{
                    padding: 18px;
                    color: var(--card-text);
                }
            </style>
            <div class="card">
                <div class="card-header">Default header</div>
                <div class="card-sub-header"></div>
                <div class="card-body">
                    <slot></slot>
                </div>
            </div>
        `;

        this.#shadow.append(template.content.cloneNode(true));
        this.#headerElement = this.#shadow.querySelector(".card-header");
        this.#subHeaderElement = this.#shadow.querySelector(".card-sub-header");
    }
}

const cardComponentName = document.currentScript.dataset.name;
customElements.define(cardComponentName, MyCard);
