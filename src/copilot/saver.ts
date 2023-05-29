import { World, keyProjectWorld } from "../model/terms/World";
import { Trek } from "../model/trek";
import { _throw } from "../utils/_throw";
import { PackedTrek, flattenTrek, packTrek } from "../model/PackedTrek";

export const saverVersion = "digdeeper3/copilot/saver@3";

export function savePackedTrek(trek: PackedTrek) {
    const countKey = JSON.stringify({
        saverVersion,
        world: keyProjectWorld(trek.start.dropzone.world),
        key: "count",
    });

    const count = JSON.parse(localStorage.getItem(countKey) ?? "0");

    const trekId = count;
    const trekKey = JSON.stringify({
        saverVersion,
        world: keyProjectWorld(trek.start.dropzone.world),
        key: "trek",
        trekId,
    });

    localStorage.setItem(trekKey, JSON.stringify(trek));
    localStorage.setItem(countKey, JSON.stringify(count + 1));
}

export const saveTrek = (trek: Trek) =>
    savePackedTrek(packTrek(flattenTrek(trek)));

export function loadPackedTreks(world: World) {
    const countKey = JSON.stringify({
        saverVersion,
        world: keyProjectWorld(world),
        key: "count",
    });
    const count = JSON.parse(localStorage.getItem(countKey) ?? "0");
    return Array.from(
        { length: count },
        (_, i) => {
            const trekKey = JSON.stringify({
                saverVersion,
                world: keyProjectWorld(world),
                key: "trek",
                trekId: i,
            });
            return JSON.parse(
                localStorage.getItem(trekKey)
                ?? _throw("Unexpectedly missing saved trek"),
            ) as PackedTrek;
        });
}
