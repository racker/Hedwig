import * as d3 from 'd3';
import "d3-selection-multi";
import {
  Defaults
} from './defaults';
import * as styleSheet from './styles/main.css';
import {
  Utils
} from "./core/utils";


const spclCharRegx = /[&\/\\#, +()$~%.'":*?<>{}]/g;
/**
 * @name LineGraph
 * @description
 * @extends HTMLElement
 * Generic line graph component for reusability
 */

export class LineGraph extends HTMLElement {


  constructor() {
    super();
    this.lineColor = [];
  }

  /**
   * @name connectedCallback
   * @description
   * Call back for when the component is attached to the DOM
   */
  connectedCallback() {

    let id = 'hedwig-' + btoa(Math.random()).substr(5, 5);
    this.innerHTML = `<style>${styleSheet}</style><svg id='${id}'></svg>`;
    var svg = document.querySelector(`#${id}`);
    var data = JSON.parse(this.dataset.graph);

    this.attachShadow({
      mode: 'open'
    });
    if (svg) {
      this.shadowRoot.appendChild(svg);
      this.renderGraph(this.parseData(data), svg);
    }
  }

  /**
   * @name parseData
   * @param {Array} requestBody
   * @description
   * Parses data into an array and converts dates into
   * javascript date objects which is required for d3js
   */
  parseData(requestBody) {
    let grouping = this.dataset.group;
    // get color array
    this.getDataLineColor(this.dataset.lineColor);
    return requestBody.map((item, i) => {
      let pointsArray = [];
      let group = Utils.findByProp(item.data, grouping);
      let valuesArray = Object.keys(item.data.values);
      // loop through each time property
      for (const obj of valuesArray) {
        pointsArray.push({
          time: new Date(obj),
          value: +item.data.values[obj]
        });
      }
      return {
        group,
        datapoints: pointsArray,
        color: this.lineColor[i]
      }
    });
  }

  /**
   * @name getDataLineColor
   * @description // create function to return random color array for each line.
   */

  getDataLineColor(colors) {
    var arr = [];
    var arrColor;
    var defaults = new Defaults();
    colors.split(',').map(value => arr.push(value));
    arrColor = [...arr, ...Utils.randomColor()];
    this.lineColor.push.apply(this.lineColor, arrColor);
  }
  /**
   * @name disconnectedCallback
   * @description
   * Call back for when the component is detached from the DOM
   */
  disconnectedCallback() {}

  /**
   * @name renderGraph
   * @param {Array} data
   * @param {innerHTML} el
   * @description
   * Renders the graph using d3js
   */
  renderGraph(data, el) {
    // Setup the margins and height, width
    var margin = JSON.parse(this.dataset.margin);
    var height = parseInt(this.dataset.height);
    var width = parseInt(this.dataset.width);
    var unit = this.dataset.unit;
    if(unit === 'undefined')
        unit = "";
    // Create X time scale
    var xScale = d3.scaleTime()
      .domain(d3.extent(Utils.maxTime(data)))
      .range([0, width - margin.bottom]);
    // Create Y linear scale
    var yScale = d3.scaleLinear()
      .domain(d3.extent(Utils.maxValue(data)))
      .range([height - margin.left, 0]);


    // create color scale for each line

    // Define a div and add styling for tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
    // Setup the svg element in the DOM
    var svg = d3.select(el)
      .styles({
        "width": width + margin.left + +margin.right,
        "height": height + +margin.top + +margin.bottom,
        "overflow": "inherit"
      })
      .append('g')
      .attr("transform", `translate(${margin.top}, 0)`);

    this.setBrush(svg, xScale, height, width);
    // Create the lines
    var line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value));

    // add element for line and add class name
    let lines = svg.append('g')
      .attr('class', 'lines');
    // create g tag with path having class line-group and line.
    lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')
      .append('path')
      .attrs({
        'class': (d, i) => {
          return `${d.group}${i}`.replace(spclCharRegx, '_'); // Assigning a class to work with its opacity
        },
        'd': d => line(d.datapoints)
      })
      // Line Click and change Opacity
      .on('click', function (d, i) {
        let cssCls = `${d.group}${i}`.replace(spclCharRegx, '_');
        let currentLgndLineOpacity = d3.select(this.parentNode).selectAll(`.${cssCls}`).style("opacity");
        d3.select(this.parentNode).selectAll(`.${cssCls}`).style('opacity', currentLgndLineOpacity == 1 ? 0.2 : 1);

        let currentTextOpacity = d3.select(this.parentNode.parentNode.parentNode).selectAll('.legend').selectAll(`.text${cssCls}`).style("opacity");
        d3.select(this.parentNode.parentNode.parentNode).selectAll('.legend').selectAll(`.text${cssCls}`).style('opacity', currentTextOpacity == 1 ? 0.2 : 1);

        let currentRectOpacity = d3.select(this.parentNode.parentNode.parentNode).selectAll('.legend').selectAll(`.rect${cssCls}`).style("opacity");
        d3.select(this.parentNode.parentNode.parentNode).selectAll('.legend').selectAll(`.rect${cssCls}`).style('opacity', currentRectOpacity == 1 ? 0.2 : 1);

      })
      .styles({
        'stroke': d => d.color,
        'fill': 'none',
        "stroke-width": "2px",
        cursor: "pointer"
      })
      .each((d, i) => { // loop through datapoints to fetch time and value to create tooltip hover events with value.
        

        var toltipDat = {group:d.group, color:d.color, unit}; // collection properties for Tooltip
        
        lines.selectAll('dot')
          .data(d.datapoints)
          .enter()
          .append("circle")
          .attrs({
            "r": 4,
            "cx": function (d) {
              return xScale(d.time);
            },
            "cy": function (d) {
              return yScale(Utils.roundUnitsValue(unit, d.value));
            }
          })
          .styles({
            "opacity": 0,
            "stroke": d.color,
            "fill": "none",
            "stroke-width": "2px"
          })
          .on("mouseover",  (d)=> {
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 0.9); // add opacity in case of hover
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(this.tooltipTemplate(d,toltipDat)) // ToolTip Html template binding
              .styles({
                "left": (d3.event.pageX + 10) + "px",
                "top": (d3.event.pageY - 28) + "px",
                "pointer-events": "none"
              });
          })
          .on("mouseout", function (d) {
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 0); // Remove hover in case of mouse out
            div.transition()
              .duration(500)
              .style("opacity", 0);
          });
      });

    // Configure X Axis ticks and add xScale
    var xAxis = d3.axisBottom(xScale).ticks(5);
    // Configure Y Axis ticks and
    var yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => {
      return `${Utils.roundUnitsValue(unit, d)}${unit}`;
    });


    // Add both Axis' to the SVG
    svg.append("g")
      .attrs({
        "class": "x axis",
        "transform": `translate(0, ${height - margin.top})`
      })
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append('text')
      .attrs({
        "y": 15,
        "transform": "rotate(-90)",
        "fill": "#000"
      })
    this.setLegend(svg, height, data);

  }

  setTitle(svg, width) {
    if (this.dataset.title !== 'undefined') {
      svg.append("text")
        .attr("transform", `translate(-14, -23)`)
        .attr("x", width / 2)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .text(this.dataset.title);
    }
  }

  /**
   *
   * @param {d3 svg element} svg
   * @param {height} height
   * @param {data} data
   */
  setLegend(svg, height, data) {
    // These variables are used to create legends and also adjust distance between different legends
    var j = 6;
    var k = 12;
    var l = 6;
    var m = 12;
    var n = 18;
    var o = 24;
    var p = 18;
    var q = 24;
   

    var legend = svg.append("g")
      .attrs({
        "class": "legend",
        'transform': `translate(0,${height-40})`
      })
      .styles({
        "font-size": 12,
        "cursor": "pointer"
      })
    // create rectangle for legends
    legend.selectAll('rect')
      .data(data)
      .enter()
      .append("rect")
      .attr(`class`, (d, i) => {
        // Assigning a class to work with its opacity
        let cssCls = `${d.group}${i}`.replace(spclCharRegx, '_');
        return `rect${cssCls}`
      })

      .attrs({
        "x": (d, i) => {
          if(i < 6) {
            return 18;
          }

          if(i >= 6 && i < 12) {
            return 220;
          } 

          if( i >= 12 && i < 18) {
            return 422;
          }

          if( i >= 18 && i < 24) {
            return 624;
          }

          if( i >= 24 && i < 30) {
            return 826;
          }
        },
        "y": (d, i) => {
            if(i < 6) {
              return i * 20 + 30;
            }

            if(i >= 6 && i < 12) {
              return (i - j) * 20 + 30;
            }
            
            if(i >= 12 && i < 18) {
              return (i - k) * 20 + 30;
            }

            if(i >= 18 && i < 24) {
              return (i - p) * 20 + 30;
            }
            
            if(i >= 24 && i < 30) {
              return (i - q) * 20 + 30;
            }


        },
        "width": 10,
        "height": 10
      })
      .style("fill", (d) => {
        return d.color;
      })
    // set text of legends
    legend.selectAll('text')
      .data(data)
      .enter()
      .append("text")
      .attr(`class`, (d, i) => { // Assigning a class to work with its opacity
        let cssCls = `${d.group}${i}`.replace(spclCharRegx, '_');
        return `text${cssCls}`
      })
      .attrs({
        "x": (d, i) => {    
          

          if(i < 6) {
            return 36;
          }

          if(i >= 6 && i < 12) {
            return 238;
          } 

          if( i >= 12 && i < 18) {
            return 440;
          }

          if( i >= 18 && i < 24) {
            return 642;
          }

          if( i >= 24 && i < 30) {
            return 844;
          }
        },
        "y": (d, i) => {

          if(i < 6) {
            return i * 20 + 39;
          }

          if(i >= 6 && i < 12) {
            return (i - l) * 20 + 39;
          }

          if(i >= 12 && i < 18) {
            return (i - m) * 20 + 39;
          }

          if(i >= 18 && i < 24) {
            return (i - n) * 20 + 39;
          }
          
          if(i >= 24 && i < 30) {
            return (i - o) * 20 + 39;
          }

        }
      })
      .text((d) => {
        if (d.group) {
          let spltdGro=d.group.split('/');
          let nwgrp=spltdGro[spltdGro.length-1]; // taking Last part of legend if "/" exist
          if(nwgrp.length >= 20)
             return nwgrp.substring(0, 20)+ '...';
          else
            return  nwgrp;
        } else {
          let spltdGro=this.dataset.field.split('/');
          let nwgrp=spltdGro[spltdGro.length-1];
          if(nwgrp.length >= 20)
             return nwgrp.substring(0, 20)+ '...'; 
          else
            return nwgrp;
        }
      })
      // Legend text Click
      .on('click', function (d, i) {
        let cssCls = `${d.group}${i}`.replace(spclCharRegx, '_');
        let currentLgndRectOpacity = d3.select(this.parentNode).selectAll(`.rect${cssCls}`).style("opacity");
        d3.select(this.parentNode).selectAll(`.rect${cssCls}`).style('opacity', currentLgndRectOpacity == 1 ? 0.2 : 1);

        let currentLgndTextOpacity = d3.select(this.parentNode).selectAll(`.text${cssCls}`).style("opacity");
        d3.select(this.parentNode).selectAll(`.text${cssCls}`).style('opacity', currentLgndTextOpacity == 1 ? 0.2 : 1);

        let currentLineOpacity = d3.select(this.parentNode.parentNode).selectAll('.lines').selectAll(`.${cssCls}`).style("opacity");
        d3.select(this.parentNode.parentNode).select('.lines').selectAll(`.${cssCls}`).style('opacity', currentLineOpacity == 1 ? 0.2 : 1);
      });
  }

  setBrush(svg, xScale, height, width) {

    let brush = d3.brushX() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width - 50, height - 50]
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", () => {
        let extent = d3.event.selection;
        if (extent) {
          this.dispatchEvent(new CustomEvent("areaSelected", {
            bubbles: true,
            composed: true,
            detail: {
              start: xScale.invert(extent[0]),
              end: xScale.invert(extent[1])
            }
          }));

          let getBrushArea = d3.select(this.shadowRoot.getElementById('brushArea'));
          getBrushArea.call(brush.move, null);
        }
      });
    svg.append("g")
      .attr("id", "brushArea")
      .attr("class", "brush")
      .call(brush)

  }

  /**
   * 
   * @param d Data points object [value,time]
   * @param ttlD An object with key unit and color and group
   * @returns Tooltip html body
   */
   
  tooltipTemplate(d,ttlD){
    return `
    <table>
            <tr>
              <td colspan="2" class="color-box paddingleft">
                ${d3.timeFormat("%c")(d.time)}
              </td>
            </tr>
            <tr>
              <td class="color-box">
                <span style="background:${ttlD.color}"></span> ${ttlD.group}
              </td>
              <td class="color-box">
                ${Utils.roundUnitsValue(ttlD.unit, d.value)}
              </td>
            </tr>
      </table>
    `
  }

}

customElements.define('line-graph', LineGraph);
