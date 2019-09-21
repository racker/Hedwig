'use strict';

import { graphs } from './supported.json';

/**
 * @name FindInfo
 * @description
 * Retrieve info on supported graph types
 */
export class FindInfo {

    constructor() {
        this.supported = graphs;
    }

    /**
     * @name info
     * @description
     * Function to get the info on graph type from JSON
     * @param {string} type
     * @returns {object}
     */
    info(type, field) {
        let supportedInfo;
        if (type === "" || type === undefined) {
            return;
        }

        if (field === "" || field === undefined) {
            throw new Error('Missing field attribute')
        }

        let supported = Object.keys(this.supported).find(key => key === type);
        let metrics = this.supported[supported].metric;

        supportedInfo = metrics.find(key => key.field === field);

        if (supportedInfo === undefined) {
            throw new Error("Unknown graph data-type!");
        }

        return supportedInfo;
    }
}
