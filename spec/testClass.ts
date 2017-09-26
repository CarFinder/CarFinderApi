import { assert } from "chai";
import { slow, suite, test, timeout } from "mocha-typescript";
import { Test } from "../src/testClass";

describe("object test", () => {
    it("test", () => {
        const obj = new Test();
        assert.equal(1, obj._one);
    });
    it("test2", () => {
        const getJsonBorn = new Test();
        getJsonBorn._three = 3;
        assert.equal(3, getJsonBorn._three);
    });
    it("test2", () => {
        const getJsonBorn = new Test();
        getJsonBorn._three = 6;
        assert.equal(3, getJsonBorn._three);
    });
    it("test2", () => {
        const getJsonBorn = new Test();
        getJsonBorn._three = 2;
        assert.equal(3, getJsonBorn._three);
    });
});
