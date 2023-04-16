import { LehmerPrng } from "../../utils/LehmerPrng";
import { VersionSubject } from "../../utils/VersionSubject";
import { toFullTable } from "../ca";
import { getDigits } from "../ca/digits";
import { ca } from "./ca";


export const emptyState = 1;
export type Cell = Universe["spacetime"][0][0];

export class Universe {
    static readonly seed = Math.floor(Math.random() * LehmerPrng.MAX_INT32);
    
    static spaceSize = 31;
    spaceSize = Universe.spaceSize;

    ca = ca({
        stateCount: 3,
        spaceSize: Universe.spaceSize,
        table: (() => {
            const pretable = getDigits(1815n, 3);
            return toFullTable(
                    /* stateCount: */ 3,
                (stateCount, n1, c, n2, pc) => pretable[n1 + c + n2]);
        })(),
        emptyState,
        seed: Universe.seed,
    });

    readonly stateVersion = new VersionSubject();

    timeSize = 51;
    startingDepth = 10;

    spacetime = Array.from(
        { length: this.timeSize },
        () => Array.from(
            { length: Universe.spaceSize },
            () => ({
                isEmpty: true,
            })));

    step = 0;

    getCaState(t: number, x: number) {
        return this.ca.at(t - this.startingDepth, x) ?? emptyState;
    }

    get(t: number, x: number) {
        return this.spacetime[t - this.step]?.[x];
    }

    _iterate() {
        this.spacetime.push(this.spacetime.shift()!);
        const t = this.spacetime.length - 1;
        for (let x = 0; x < this.spacetime[t].length; x++) {
            this.spacetime[t][x].isEmpty = false;
        }
    }

    iterate() {
        this._iterate();

        this.step++;
        this.stateVersion.increment();
    }

    constructor() {
        // eslint-disable-next-line no-console
        console.log("seed", Universe.seed);

        const t = this.spacetime.length - 1;
        for (let x = 0; x < this.spacetime[t].length; x++) {
            this.spacetime[t][x].isEmpty = false;
        }
        for (
            let _ = 0;
            _ < this.spacetime.length - this.startingDepth - 2;
            _++
        ) {
            this._iterate();
        }
    }
}

export const universe = new Universe();
