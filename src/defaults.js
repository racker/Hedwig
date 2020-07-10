import * as d3 from 'd3';

/**
 * @name Defaults
 * @description
 * Default values for componets throughout Hedwig
 */
export class Defaults {
    constructor() {
        this.margin = { top: 50, right: 50, bottom: 50, left: 50 };
        this.graphHeight = 200;
        this.graphWidth = 400;
        this.lineColor = '#0c7c84';
        this.schemeCategory10Color = d3.schemeCategory10;
    }
}