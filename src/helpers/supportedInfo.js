'use strict';

import { unit } from './supported.json';

/**
 * @name FindInfo
 * @description
 * Retrieve info on supported graph types
 */
export class FindInfo {

    constructor() {
        this.units = unit;
    }


    /**
     * Configure the unit of measurment to be used
     * @param {string} type
     * @returns string
     */
    configureUnits(type) {
        if (!(!!type)) {
            return;
        }

        let units = Object.keys(this.units).find(key => key === type);
        return unit[units];
    }
}
