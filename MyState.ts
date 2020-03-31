import {ArraySchema, Schema, type} from "@colyseus/schema";

export default class MyState extends Schema {
    @type("boolean") gameStarted = false;
    @type("string") firstPlayer: string | undefined;
    @type("string") secondPlayer: string | undefined;
    @type("boolean") firstPlayersTurn = true;
    @type(["string"]) field = new ArraySchema<string>();
    @type("string") winner: string | undefined;

    constructor() {
        super();
        for (let i = 0; i < 9; i++) {
            this.field.push("");
        }
    }
}