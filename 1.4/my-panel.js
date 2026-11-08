class MyPanel extends HTMLElement {
    #shadow;
    #header;
    #content;
    #toggleIcon;
    #isCollapsed = false;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: "open" });
        this.#createTemplate();
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
                    display: block;
                    font-family: var(--panel-font-family, 'Segoe UI', Arial, sans-serif);
                    font-size: 14px;
                    --panel-primary: var(--panel-primary-color, #6366f1);
                    --panel-border: var(--panel-border-color, #e5e7eb);
                    --panel-bg: var(--panel-background, #ffffff);
                    --panel-text: var(--panel-text-color, #374151);
                    --panel-header-bg: var(--panel-header-bg, #f9fafb);
                    --panel-radius: var(--panel-border-radius, 8px);
                }

                .panel{
                    border: 1px solid var(--panel-border);
                    border-radius: var(--panel-radius);
                    background: var(--panel-bg);
                }

                .panel-header{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 18px;
                    background: var(--panel-header-bg);
                    border-bottom: 1px solid var(--panel-border);
                    font-weight: 600;
                    color: var(--panel-text);
                    cursor: pointer;
                    user-select: none;
                }

                .panel-header-title{
                    flex: 1;
                }

                .panel-toggle{
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s;
                    color: var(--panel-primary);
                }

                .panel-toggle::after{
                    content: '';
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 6px solid currentColor;
                }

                .panel-toggle.collapsed{
                    transform: rotate(-90deg);
                }

                .panel-content{
                    padding: 18px;
                    color: var(--panel-text);
                    transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.2s ease;
                    max-height: 1000px;
                    opacity: 1;
                }

                .panel-content.collapsed{
                    max-height: 0;
                    padding-top: 0;
                    padding-bottom: 0;
                    opacity: 0;
                    overflow: hidden;
                }
            </style>
            <div class="panel">
                <div class="panel-header">
                    <span class="panel-header-title">
                        <slot name="header">Panel</slot>
                    </span>
                    <span class="panel-toggle"></span>
                </div>
                <div class="panel-content">
                    <slot></slot>
                </div>
            </div>
        `;

        this.#shadow.append(template.content.cloneNode(true));

        this.#header = this.#shadow.querySelector(".panel-header");
        this.#content = this.#shadow.querySelector(".panel-content");
        this.#toggleIcon = this.#shadow.querySelector(".panel-toggle");

        this.#header.addEventListener('click', () => this.#toggle());
    }

    #toggle() {
        this.#isCollapsed = !this.#isCollapsed;
        this.#content.classList.toggle("collapsed", this.#isCollapsed);
        this.#toggleIcon.classList.toggle("collapsed", this.#isCollapsed);
    }
}

const panelComponentName = document.currentScript.dataset.name;
customElements.define(panelComponentName, MyPanel);
