import { assert } from "chai";
import { slow, suite, test, timeout } from "mocha-typescript";
import { Greater } from "../src/greater";

describe("vanilla bdd", () => {
    it("test", () => {
        global.console.log(1);
    });
});

suite("vanilla tdd", () => {
    test("test", () => {
        global.console.log(1);
    });
});

// Dosent work.

@suite
class UnitTest extends Greater {
    @test
    public greater() {
        assert(this.great());
    }
}

describe("object test", () => {
    it("test", () => {
        const obj = new Greater("ivan");
        assert.equal("ivan", obj.name);
    });
    it("test2", () => {
        const getJsonBorn = new Greater("noname");
        assert.equal("Json Born", getJsonBorn.test2());
    });
});
