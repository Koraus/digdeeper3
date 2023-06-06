import { pipe } from "fp-ts/lib/function";
import * as D from "io-ts/Decoder";
import { version } from "../version";
import { DropzoneDecoder } from "./Dropzone";
import { decode, eqByKey } from "../../utils/keyifyUtils";


export const DropDecoder = D.struct({
    v: D.literal(version),
    zone: DropzoneDecoder,
    equipment: D.struct({
        pickNeighborhoodIndex: D.union(
            D.literal(0),
            D.literal(1),
            D.literal(2),
        ),
    }),
    depthLeftBehind: pipe(
        D.number,
        D.refine(Number.isInteger as (x: unknown) => x is number, "integer"),
        D.refine((n): n is number => n > 0, "strictly positive"),
    ),
});

export type Drop = D.TypeOf<typeof DropDecoder>;
export type DropEquipment = Drop["equipment"];


export const keyProjectDrop = decode(DropDecoder);
export const keyifyDrop =
    (x: Drop) => JSON.stringify(keyProjectDrop(x));
export const eqDrop = eqByKey(keyifyDrop);