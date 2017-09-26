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

@suite
class UnitTest extends Greater {
    @test
    public greater() {
        assert(this.great());
    }
}
