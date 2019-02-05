
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
     */
    info(type) {
        let supportedInfo;
        if (type === "" || type === undefined) {
            return;
        }

        Object.keys(this.supported).find(key => {
            if (key === type) {
                supportedInfo = this.supported[key];
                return supportedInfo;
            }
        });

        if (supportedInfo === undefined) {
            throw new Error("Unknown graph data-type!");
        }

        return supportedInfo;
    }
}
