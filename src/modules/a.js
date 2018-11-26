/**
 * This is the class for A that does stuff
 * @class A
 * @module A
 */

class A {
    /**
     * Uses these parameters if any
     * @type {Object}
     */
    constructor() {}

    doSomething() {
        return 'A is doing something';
    }
}

const instance = new A();
export { instance as A };