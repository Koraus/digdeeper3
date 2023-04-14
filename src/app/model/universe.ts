import {LehmerPrng} from "../../utils/LehmerPrng";
import {rule} from "./rule";
import {VersionSubject} from "../../utils/VersionSubject";

export type Cell = Universe["spacetime"][0][0];

export class Universe {
    static readonly seed = Math.floor(Math.random() * LehmerPrng.MAX_INT32);
    static random = new LehmerPrng(Universe.seed);
    static getRandomState() {
        return Universe.random.next() % rule.stateCount;
    }

    readonly stateVersion = new VersionSubject();

    spaceSize = 301;
    timeSize = 51;
    startingDepth = 10;

    spacetime = Array.from(
        {length: this.timeSize},
        () => Array.from(
            {length: this.spaceSize},
            () => ({
                isEmpty: true,
                isPlayer: false,
                state: 1,
            })));

    step = 0;

    get(t: number, x: number) {
        return this.spacetime[t - this.step][x];
    }

    _ruleGetState(t: number, x: number) {
        const cell = this.spacetime[t][x];
        if (cell.isEmpty || cell.isPlayer) {
            return undefined;
        }
        return cell.state;
    }

    _updateCell(t: number, x: number) {
        const newState = rule.getState(this._ruleGetState, t, x);
        if ("undefined" === typeof newState) {
            return;
        }
        this.spacetime[t][x].state = newState;
        this.spacetime[t][x].isEmpty = false;
    }

    _iterate() {
        this.spacetime.push(this.spacetime.shift()!);
        const t = this.spacetime.length - 1;

        const nr = rule.spaceNeighbourhoodRadius;
        for (let x = 0; x < nr; x++) {
            this.spacetime[t][x].state = Universe.getRandomState();
            this.spacetime[t][x].isEmpty = false;
            this.spacetime[t][this.spacetime[t].length - 1 - x].state = Universe.getRandomState();
            this.spacetime[t][this.spacetime[t].length - 1 - x].isEmpty = false;
        }
        for (let x = nr; x < this.spacetime[t].length - nr; x++) {
            this._updateCell(t, x);
        }
    }

    iterate() {
        this._iterate();

        this.step++;
        this.stateVersion.increment();
    }

    constructor() {
        console.log("seed", Universe.seed);

        this._ruleGetState = this._ruleGetState.bind(this);

        const playerT = this.spacetime.length - 2;
        const playerX = (this.spacetime[playerT].length - 1) / 2;
        this.spacetime[playerT][playerX].isPlayer = true;
        const t = this.spacetime.length - 1;
        for (let x = 0; x < this.spacetime[t].length; x++) {
            this.spacetime[t][x].state = Universe.getRandomState();
            this.spacetime[t][x].isEmpty = false;
        }
        this.spacetime[playerT + 1][playerX].state = 1;
        for (let _ = 0; _ < this.spacetime.length - this.startingDepth - 2; _++) {
            this._iterate();
        }
    }

    refresh(fromT: number, toT?: number) {
        const nr = rule.spaceNeighbourhoodRadius;
        const _toT = "undefined" === typeof toT ? this.spacetime.length : toT;
        for (let t = fromT; t < _toT; t++) {
            for (let x = nr; x < this.spacetime[t].length - nr; x++) {
                this._updateCell(t, x);
            }
        }
        this.stateVersion.increment();
    }
}

export const universe = new Universe();
