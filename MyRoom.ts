import {Room, Client} from "colyseus";
import MyState from "./MyState";

export default class MyRoom extends Room {
    onCreate(options: any) {
        this.maxClients = 2;
        this.setState(new MyState());
    }

    onJoin(client: Client, options: any) {
        if (this.clients.length == this.maxClients) {
            this.state.firstPlayer = this.clients[0].id;
            this.state.secondPlayer = this.clients[1].id;
            this.lock().then(() => this.state.gameStarted = true)
        }
    }


    onMessage(client: Client, message: any) {
        if (this.state.gameStarted) {
            if (message instanceof Object && message.hasOwnProperty("fieldId")) {
                let firstPlayerGoes = client.id == this.state.firstPlayer && this.state.firstPlayersTurn;
                let secondPlayerGoes = client.id == this.state.secondPlayer && !this.state.firstPlayersTurn;
                if (firstPlayerGoes || secondPlayerGoes) {
                    if (this.state.field[message.fieldId] == "") {
                        this.state.field[message.fieldId] = client.id;
                        this.state.firstPlayersTurn = !this.state.firstPlayersTurn;
                        this.checkGameEnding();
                    }
                }
            }
        }
    }

    onLeave(client: Client, consented: boolean) {

    }

    onDispose() {

    }

    checkGameEnding() {
        let owner = this.state.field[0];
        if (owner != "") {
            if (owner == this.state.field[1] && owner == this.state.field[2] ||
                owner == this.state.field[3] && owner == this.state.field[6]) {
                this.gameEnd(owner);
                return;
            }
        }
        owner = this.state.field[4];
        if (owner != "") {
            if (owner == this.state.field[1] && owner == this.state.field[7] ||
                owner == this.state.field[3] && owner == this.state.field[5] ||
                owner == this.state.field[0] && owner == this.state.field[8] ||
                owner == this.state.field[2] && owner == this.state.field[6]) {
                this.gameEnd(owner);
                return;

            }
        }
        owner = this.state.field[8];
        if (owner != "") {
            if (owner == this.state.field[6] && owner == this.state.field[7] ||
                owner == this.state.field[2] && owner == this.state.field[5]) {
                this.gameEnd(owner);
                return;
            }
        }
        let isFieldFull = true;
        for (let field of this.state.field) {
            if (field == "") {
                isFieldFull = false;
            }
        }
        if (isFieldFull) {
            this.gameEnd("draw");
            return;
        }
    }

    gameEnd(winner: string) {
        this.state.winner = winner;
        this.state.gameStarted = false;
        this.clock.setTimeout(() => this.disconnect(), 5000)
    }
}