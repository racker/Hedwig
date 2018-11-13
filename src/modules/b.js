/**
 * This is the class for B that does stuff
 * @class B
 * @module B
 */

class B {
    /**
     * Uses these parameters if any
     * @type {Object}
     */
    constructor() {}

    doSomething() {
        console.log('B is doing something');
    }
}

const instance = new B();
export { instance as B };