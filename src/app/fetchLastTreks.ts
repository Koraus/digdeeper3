import { PackedTrek } from "../model/terms/PackedTrek";

type Block = { prev?: string, hids: string[] };

async function fetchTrekOpenBlock() {
    const res = await fetch("https://dd3.x-pl.art/trek/openBlock");
    const result = await res.json();
    return result as Block;
}

const fetchByHid = async (hid: string) =>
    (await fetch(`https://dd3.x-pl.art/hid_kv/${hid}/json`)).json();

export async function fetchLastTreks(limit = 1000) {
    let block = await fetchTrekOpenBlock();

    const treks: PackedTrek[] = await Promise.all(block.hids.map(fetchByHid));

    while (treks.length < limit && block.prev) {
        block = await fetchByHid(block.prev) as Block;
        treks.unshift(...(
            await Promise.all(block.hids.map(fetchByHid)) as PackedTrek[]
        ));
    }

    return treks.slice(-limit);
}
