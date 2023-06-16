import { RouterType, text } from "itty-router";
import { Env } from "./Env";
import { pipe } from "fp-ts/lib/function";
import * as D from "io-ts/Decoder";
import { HmacSHA256, enc } from "crypto-js";
import { decode } from "../../src/utils/keyifyUtils";


const asIdGuard = <T>(fn: (x: T) => boolean) => fn as (x: T) => x is typeof x;

const DatetimeDecoder = pipe(
    D.string,
    D.refine(
        asIdGuard(s => new Date(s).toISOString() === s),
        "datetime is a `.toISOString()` output (YYYY-MM-DDTHH:mm:ss.sssZ)"),
    D.refine(
        asIdGuard(s => new Date(s) <= new Date()),
        "datetime is in the past"),
);


export const addDateseedRoutes = (router: RouterType) => router
    .get("/dateseed/:datetime", async ({ params: {
        datetime,
    } }, env: Env) => {
        return text(
            HmacSHA256(
                decode(DatetimeDecoder)(datetime),
                env.DATESEED_SECRET,
            ).toString(enc.Hex),
        );
    });