import { A } from '../../src/modules/a';

describe("Tests module A", function () {

    it("class should exist", () => {
        expect(A).toBeDefined();
    });

    it("method doSomething() should return string", () => {
        expect(A.doSomething()).toEqual('A is doing something');
    })

});