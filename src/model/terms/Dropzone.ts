import { pipe } from "fp-ts/lib/function";
import * as D from "io-ts/Decoder";
import { CaState, WorldDecoder, caStateCount } from "./World";
import { version } from "../version";
import { decode, eqByKey } from "../../utils/keyifyUtils";


export const DropzoneDecoder = D.struct({
    v: D.literal(version),
    world: WorldDecoder,
    seed: pipe(
        D.number,
        D.refine(Number.isInteger as (x: unknown) => x is number, "integer"),
        D.refine(
            (n): n is number => n >= 0 && n <= 0xffffffff, "within UInt32"),
    ),
    width: pipe(
        D.number,
        D.refine(Number.isInteger as (x: unknown) => x is number, "integer"),
        D.refine((n): n is number => n > 0, "strictly positive"),
    ),
    startFillState: pipe(
        D.number,
        D.refine(
            (n): n is CaState =>
                Number.isInteger(n) && n >= 0 && n < caStateCount,
            `integer within state space [0, ${caStateCount})`),
    ),
});

export type Dropzone = D.TypeOf<typeof DropzoneDecoder>;

export const keyProjectDropzone = decode(DropzoneDecoder);
export const keyifyDropzone =
    (x: Dropzone) => JSON.stringify(keyProjectDropzone(x));
export const eqDropzone = eqByKey(keyifyDropzone);