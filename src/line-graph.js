
import Highcharts from 'highcharts/highcharts';
import { AxisLeft } from './helpers/axisConverter';

export class LineGraph extends HTMLElement {

    constructor() {
        super();
      }


      findMaxValue(data){    
		let arr=[];
		data.forEach(element => {
		  element.datapoints.forEach(el => {
			arr.push(el.value);  
		  });    
		});
		return arr;
	  }
	  findMaxTime(data){
		let arr=[];
		data.forEach(element => {
		  element.datapoints.forEach(el => {
			arr.push(el.time);  
		  });
		});
		return arr;
	  }

      /**
   * @name parseData
   * @param {Array} data
   * @description
   * Parses data into an array and converts dates into
   * javascript date objects which is required for d3js
   */
  parseData(data) {
    let uniqueGroups = [];
    let grouping = this.dataset.group;
    data.map((item) => {
      // if grouping is specified find unique groups
      let group = item[grouping];
      const index = uniqueGroups.findIndex((i) => i === group);
      if (index === -1) {
        uniqueGroups.push(group);
      }
    });

    // now that we have grouping we will filter and map our datapoints
    return uniqueGroups.map((group) => {
      return {
        group,
        datapoints: data.filter(d => d[grouping] === group).map((d) => {
          return { time: new Date(d.time), value: +d.mean }
        })
      }
    });
  }
    connectedCallback() {
      this.innerHTML = `<div style="height: 400px,width:400px" id="container"></div>`;
      var container = document.querySelector(`#container`); 
     Highcharts.chart("container", this.optionObject());
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(container);
    }

    dataParser(data){
        let arr=[];
        JSON.parse(data).forEach(e =>{
            arr.push([new Date(e.time).getTime(),e.mean])
        })
        return arr;
    }
    xcatagories(data){
        let xcat=[]
        return JSON.parse(data).forEach(e =>{
            xcat.push(new Date(e.time).toDateString());
        });
        return xcat;
    }
    optionObject(){

        return {chart: {
            height: 300,
            width:600,
            type: 'line'
        },
        unit:{
          value:this.getAttribute('data-unit')
        },

        title: {
            text: ''
        },
    
        subtitle: {
            text: ''
        },
        yAxis: {            
            labels: {
                formatter: function () {
                  let u=new AxisLeft();
                    return  this.axis.defaultLabelFormatter.call(this)+ u.convert(this.chart.options.unit.value);
                }            
            }
        },
        xAxis: {
            type: 'datetime',
            //categories:this.xcatagories(this.getAttribute('data-graph'))
            dateTimeLabelFormats: {
                second: '%H:%M:%S',
                // minute: '%H:%M',
                // hour: '%H:%M',
                // day: '%b. %e',
                // week: '%b. %e',
                // month: '%b. %y',
                // year: '%Y'
              }
            
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
            }
        },
        
        series: [{
            data: this.dataParser(this.getAttribute('data-graph'))
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 200
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    }
    }
  
  }
      
  customElements.define('line-graph', LineGraph);