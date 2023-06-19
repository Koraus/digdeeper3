import { PackedTrek } from "../model/terms/PackedTrek";
import { fetchByHidMemoized } from "./fetchByHid";

type Block = { prev?: string, hids: string[] };

async function fetchTrekOpenBlock() {
    const res = await fetch("https://dd3.x-pl.art/trek/openBlock");
    const result = await res.json();
    return result as Block;
}

export async function fetchLastTreks(limit = 1000) {
    let block = await fetchTrekOpenBlock();

    const treks: PackedTrek[] =
        await Promise.all(block.hids.map(fetchByHidMemoized));

    while (treks.length < limit && block.prev) {
        block = await fetchByHidMemoized(block.prev) as Block;
        treks.unshift(...(
            await Promise.all(
                block.hids
                    .slice(0, limit - treks.length)
                    .map(fetchByHidMemoized)) as PackedTrek[]
        ));
    }

    return treks;
}
