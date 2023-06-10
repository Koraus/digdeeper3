import { World } from "../model/terms/World";


async function fetchTrekOpenBlock() {
    const url = "https://dd3.x-pl.art/trek/openBlock";
    const res = await fetch(url, { method: "GET" });
    const result = await res.json();
    return result as {
        prev?: string,
        hids: string[],
    };
}

async function fetchByHid<T>(hid: string) {
    const response = await fetch(`https://dd3.x-pl.art/hid_kv/${hid}/json`);
    const result = await response.json();
    return result as T;
}

export async function testFetch() {
    const openBlock = await fetchTrekOpenBlock();

    const worlds =
        await Promise.all(openBlock.hids.map(
            async (w) => { return await fetchByHid<World>(w); },
        ));

    console.log("worlds", worlds);
}

