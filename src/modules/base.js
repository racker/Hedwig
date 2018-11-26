const config = require('../../config.json');
/**
 * This is the base class for all Modules
 * @class BaseModule
 * @module BaseModule
 */
export class BaseModule {

    /**
     * Constructs the BaseModule
     * @param {string} xauth - required authorization token
     * @param {number} tenant - required tenant id
     */
    constructor(xauth, tenant, endpoint) {
        this._xauth = xauth;
        this._tenant = tenant;
    }

    /**
     * Get the xauth value
     * @return {string} The xauth value
     */
    get xauth() {
        return this._xauth;
    }

    /**
     * Get the tenant value
     * @return {number} The tenant ID
     */
    get tenant() {
        return this._tenant;
    }

    /** Concatenate API url
     * @return {string} The URl + tenantId
    */
    get url() {
        return config.monitoring.url + this.tenant;
    }


}