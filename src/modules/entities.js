'use strict';
import { fetchAPI } from '../helpers/fetch';
import { BaseModule } from './base';
import { promises } from 'fs';

/**
 * This is the class for Entities
 * @class Entity
 * @module Entity
 * @extends BaseModule
 */
export default class Entities extends BaseModule{
    /**
     * Construct the class
     * @param {string} xauth - the token needed for request
     * @param {number} tenant - the tenant Id for acct */
    constructor(xauth, tenant) {
        super(xauth, tenant);
        this.endpoint = '/entities';
    }

    /**
     * Gets list of entities
     * @param {number} index - paging index
     * @param {umber} count - amount to take
     * @returns {promises} - A promise with array of entity objects
     */
    list(index, count) {
        return new Promise((resolve, reject) => {
            let API = this.url + this.endpoint;
            let options = {
                mode: "cors",
                headers: {
                    "Content-Type" : 'application/json',
                    "X-Auth-Token" : this.xauth
                }
            };

            fetchAPI(API, options)
            .then(res => res.json())
            .then(json => { console.log(JSON.stringify(json)); return resolve(json); })
            .catch(err => { return reject(err); });
        });
    }

    /**
     * Retrieves a single entity
     * @param {number} id - Id of the Entity
     */
    retrieve(id) {

    }

    create() {

    }

    update() {

    }

    delete(id) {

    }


}