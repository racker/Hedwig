import Highcharts from 'highcharts/highcharts';
import {
  AxisLeft
} from './helpers/axisConverter';
export class LineGraph extends HTMLElement {

  constructor() {
    super();
    this.lineColor = [];
    this.height;
    this.width;
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
    this.height = parseInt(this.dataset.height);
    this.width = parseInt(this.dataset.width);
    this.innerHTML = `<div id="container"></div>`;
    var container = document.querySelector(`#container`);

    Highcharts.chart("container", this.optionObject());
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.appendChild(container);
  }

  getDataLineColor(colors, groupCount) {
    // Check if there are multiple colors or only one color passed.
    var arrColor = [];
    if (colors.indexOf(',') > -1) {                          // split color property, check and compare length with group of lines.
      if(groupCount === 0) {                                 // check if groupcount is zero means single line. 
        if(colors.split(',')[0])                            // check if multiple colors or not.
          arrColor.push(colors.split(',')[0]);
        else
          arrColor.push(colors);                                // for single color or no color.
      } else if(colors.split(',').length === groupCount) {     // CASE 1: if no. of colors passed is equal to no. of groups.
        colors.split(',').forEach((value, i) => {
          arrColor.push(value);
        })
      } else if(colors.split(',').length !== groupCount) {      // CASE2: if no. of colors not match with groups.
          for(var i=0; i < groupCount; i++) {                 
            if(colors.split(',')[i])                    
              arrColor[i] = colors.split(',')[i];
            else
            arrColor[i] = Highcharts.getOptions().colors[i];
          }   
      }
    } else {                                                     // CASE 3: when only one color is pased.
      if(groupCount === 0) {
        arrColor.push(colors); 
      } else { 
        for(var i=0; i < groupCount; i++) {
          if(i === 0)
            arrColor[i] = colors;
          else
          arrColor[i] = Highcharts.getOptions().colors[i];
        }
      }  
    }  
    return arrColor;    
  }

  /**
   * make series object
   * @param {stringyfy data} data
   * @returns Array of objects
   */
  series() {
    let jsonObj = JSON.parse(this.dataset.graph);
    let grouping = this.parseData(jsonObj);
    let series = [];
    let groupCount = 0; 
    grouping.forEach(e => {
      if(e.group !== undefined) {
        groupCount++;
      }
      series.push(this.seriesData(e.group, e.datapoints));
    })
    var arr = this.getDataLineColor(this.dataset.lineColor, groupCount);
    this.lineColor.push.apply(this.lineColor, arr);
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
    });
    return {
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
        height: this.height,
        width: this.width,
        type: 'line'
      },
      unit: {
        value: this.dataset.unit
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
        }

      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
        }
      },
      colors: this.lineColor,
      series: this.series(),

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
