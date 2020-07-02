import Highcharts from 'highcharts/highcharts';
import { contourDensity } from 'd3';

/**
 * @name CustomLineGraph
 * @description custom line graph - generic graph component used for different libraries for reusability
 * @extends HTMLElement
 * 
 */

export class CustomLineGraph extends HTMLElement {
    constructor() {
        super();
    }

    /**
     * @name connectedCallback 
     * @description
     * called when (after) the element is attached to the DOM.
     */

     connectedCallback() {
        var id = 'hedwig-' + btoa(Math.random()).substr(5, 5);
        console.log("id ", id);
        this.innerHTML = `<div style="width:100%; height:400px;" id='${id}'>`;
        var container = document.querySelector(`#${id}`);
        console.log("container ", container);
        var data = JSON.parse(this.dataset.graph);
        console.log("data JSON parse ", data);
        console.log("this dataset.group ", this.dataset.group);
        this.renderGraph(data, id, container);
     }

    /**
     * @name renderGraph 
     * @param data
     * @param el
     * @description
     * renderGraph function to render high chart line graph on the basis of passing data into.
     */

     renderGraph(data, elId, el) {

        console.log("renderGraph custom line graph ", data);

         Highcharts.chart(elId, {
            chart : {
                type : 'line'
            },
            title: {
                text: 'Fruit Consumption'
            },
            xAxis: {
                categories: ['Apples', 'Bananas', 'Oranges']
            },
            yAxis: {
                title: {
                    text: 'Fruit eaten'
                }
            },
            series: [{
                name: 'Jane',
                data: [1, 0, 4]
            }, {
                name: 'John',
                data: [5, 7, 3]
            }]
         });
        this.attachShadow({ mode : 'open' });
        this.shadowRoot.appendChild(el);
     }
} 

customElements.define('custom-line-graph', CustomLineGraph);