import { pipe } from "fp-ts/lib/function";
import * as D from "io-ts/Decoder";
import { CodeDecoder } from "../../ca/Code";
import { version } from "../version";
import { decode } from "../../utils/keyifyUtils";


const asIdGuard = <T>(fn: (x: T) => boolean) => fn as (x: T) => x is typeof x;

export const caStateCount = 3;
export type CaState = number; // 0 | 1 | 2;

export const WorldDecoder = D.struct({
    v: D.literal(version),
    ca: pipe(
        CodeDecoder,
        D.refine(
            asIdGuard(({ stateCount }) => stateCount === caStateCount),
            `ca.stateCount is caStateCount=${caStateCount}`,
        ),
    ),
    stateEnergyDrain: D.tuple(D.number, D.number, D.number),
    stateEnergyGain: D.tuple(D.number, D.number, D.number),
});

export type World = D.TypeOf<typeof WorldDecoder>;

export const keyProjectWorld = decode(WorldDecoder);