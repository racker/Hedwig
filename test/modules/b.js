import { B } from '../../src/modules/b';

describe("Tests module B", function () {

    it("class should exist", function () {
        expect(B).toBeDefined();
    });

    it("method doSomething() should return string", () => {
        expect(B.doSomething()).toEqual('B is doing something');
    });
});