export interface InterfaceUser {
    greated: string;
}

export class Greater implements InterfaceUser {
    public greated: string;
    protected abracodabra: string;
    protected jsonBorn: string = "Json Born";
    private personName: string;

    constructor(name: string = "anonimous") {
        this.personName = name;
        this.greated = "Hello, " + name;
    }
    public great(): string {
        return this.greated;
    }
    public test(): void {
        return;
    }
    set name(name: string) {
        this.personName = name;
    }
    get name(): string {
        return this.personName;
    }

    public test2() {
        return this.jsonBorn;
    }

    public test3() {
        return;
    }

    public test4() {
        return;
    }

    public test45() {
        return;
    }

    public test5() {
        return;
    }

    public test6() {
        return;
    }
}
