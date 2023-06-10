import _ from "lodash";
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
    return result.drop.zone.world as T;
}

export async function topTenWorlds() {
    const openBlock = await fetchTrekOpenBlock();

    const worlds =
        await Promise.all(openBlock.hids.map(
            async (w) => { return await fetchByHid<World>(w); },
        ));

    if (worlds) {
        const worldRules: string[] = worlds.map((w) => w.ca.rule);
        const worldsCount = _.countBy(worldRules, _.identity);
        const sortedValues = [];

        for (const [rule, count] of Object.entries(worldsCount)) {
            sortedValues.push({ rule, count });
        }
        // last 10
        console.log(
            sortedValues.sort((a, b) => a.count - b.count).slice(-10));
    }

}

