import Highcharts from 'highcharts/highcharts';
import {
  AxisLeft
} from './helpers/axisConverter';

export class LineGraph extends HTMLElement {
  constructor() {
    super();
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
          return {
            time: new Date(d.time),
            value: +d.mean
          }
        })
      }
    });
  }
  connectedCallback() {
    this.innerHTML = `<div style="height: 400px,width:400px" id="container"></div>`;
    var container = document.querySelector(`#container`);
    /*if (this.dataset.lineColor.indexOf(',') > -1) {
      var arrColor =  this.dataset.lineColor.split(',');
      if(arrColor.length > 1) {
        arrColor.forEach((value, i) => {
          console.log("value " + value + "i " + i);
          Highcharts.getOptions().colors[i] = value;
        })      
      }
    } else {*/
      Highcharts.getOptions().colors[0] = this.dataset.lineColor;
    /*}*/
    Highcharts.chart("container", this.optionObject());
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.appendChild(container);
  }

  /**
   * make series object
   * @param {stringyfy data} data 
   * @returns Array of objects
   */
  series(data) {
    let jsonObj = JSON.parse(data);
    let grouping = this.parseData(jsonObj);
    let series = [];
    grouping.forEach(e => {
      series.push(this.seriesData(e.group, e.datapoints));
    })

    console.log("series ", series);

    return series;
  }

  /**
   * 
   * @param {name for series} name 
   * @param {datapoints with time and value} datapoints 
   */
  seriesData(name, datapoints) {
    let arr = [];
    datapoints.forEach(e => {
      arr.push([new Date(e.time).getTime(), e.value])
    })
    return {
      marker: {
        lineColor : Highcharts.getOptions().colors
      },
      name,
      data: arr,
    };
  }

  /**
   * Highchart option object
   */
  optionObject() {
    return {
      chart: {
        height: 300,
        width: 600,
        type: 'line'
      },
      // colors:this.getAttribute('data-line-color')?[this.getAttribute('data-line-color'),Highcharts.getOptions().colors]:Highcharts.getOptions().colors,
      unit: {
        value: this.getAttribute('data-unit')
      },
      // remove highchart water mark
      credits: {
        enabled: false
      },
      legend: {
        layout: 'horizontal', // default
      },
      yAxis: {
        labels: {
          // y axis labels formatting
          formatter: function () {
            let u = new AxisLeft();
            return this.axis.defaultLabelFormatter.call(this) + u.convert(this.chart.options.unit.value);
          }
        }
      },
      xAxis: {
        type: 'datetime',
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
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
        }
      },

      series: this.series(this.getAttribute('data-graph')),

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