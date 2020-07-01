import Highcharts from 'highcharts/highcharts';
export class HighchartHedwig extends HTMLElement {
    constructor() {
        super();
      }
    connectedCallback() {
      this.innerHTML = `<div style="height: 400px,width:400px" id="container"> test</div>`;
      var container = document.querySelector(`#container`);
    
      Highcharts.chart("container", {
        chart: {
            height: 300,
            width:600,
            type: 'line'
        },

        title: {
            text: 'Hedwig High chart Demo'
        },
    
        subtitle: {
            text: 'Source: Metrics'
        },
    
        yAxis: {
            title: {
                text: 'Number of cpus'
            }
        },
    
        xAxis: {
            accessibility: {
                rangeDescription: 'Range: 2010 to 2017'
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
            name: '6221-forestofdean.prod.com',
            data: [0.45, 0.67,0.10, 0.99],
            color:"#F7CD9D"
        }, {
            name: '7877-ministryofmagic.staging.com',
            data: [0.80, 0.33,0.2, 0.78],
            color:"red"
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
    
    });
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(container);
    }
  
  }
      
  customElements.define('hedwig-highchart', HighchartHedwig);