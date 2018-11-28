import * as d3 from 'd3';
import shadowMarkup from './cpu-max_usage.html';
//import shadowStyle from './cpu-max_usage.css';
//import BaseComponent from '../../BaseComponent';

export class CPU_MaxUsage extends HTMLElement {

    constructor() {
        super();
    }


    static get template() {
        return `${shadowMarkup}`;
        //return `<style>${shadowStyle}</style>${shadowMarkup}`;
    }

    connectedCallback() {
        console.log("basecomponent - component is connected");
        this.render();
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {

    }


    render() {


    }


}