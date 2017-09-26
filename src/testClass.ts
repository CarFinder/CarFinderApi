export class Test {
    public one: number;
    protected two: number;
    private three: number;

    constructor() {
        this.one = 1;
        this.two = 2;
        this.three = 3;
    }

    get _one(): number {
        return this.one;
    }

    set _one(value: number) {
        this.one = value;
    }

    get _two(): number {
        return this.two;
    }

    set _two(value: number) {
        if (value === 2) {
            this.two *= 2;
            return;
        } else {
            this.two = value;
        }
    }

    get _three(): number {
        return this.three;
    }

    set _three(value: number) {
        if (value !== 3) {
            return;
        } else {
            this.three = value;
        }
    }

    public getAll() {
        return [this._one, this._two, this._three];
    }
}
