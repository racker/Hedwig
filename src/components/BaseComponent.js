

export class BaseComponent extends HTMLElement {

    constructor(htmlTemplate) {
        super();
        this.html = htmlTemplate;
        //this.html = bind(htmlTemplate);
    }

    static get template() {
        return this.html;
    }

    connectedCallback() {
        console.log("basecomponent - component is connected");
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {

    }



}
