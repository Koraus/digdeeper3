import { LehmerPrng } from "../utils/LehmerPrng";
import { fillSpace } from "../ca/fillSpace";
import { Code, parseFullTransitionLookupTable } from "../ca";


export function ca({
    ca: caCode, spaceSize, seed, emptyState,
}: {
    ca: Code;
    spaceSize: number;
    emptyState: number;
    seed: number;
}) {
    const { stateCount } = caCode;
    const table = parseFullTransitionLookupTable(caCode);
    const random = new LehmerPrng(seed);

    const spacetime = [
        Array.from({ length: spaceSize }, () => emptyState),
        Array.from({ length: spaceSize }, () => random.next() % stateCount),
        Array.from({ length: spaceSize }, () => random.next() % stateCount),
    ];

    const _at = (t: number, x: number) => {
        while (t >= spacetime.length) {
            const space = Array.from({ length: spaceSize }, () => 0);
            space[0] = random.next() % stateCount;
            space[space.length - 1] = random.next() % stateCount;
            spacetime.push(space);
            fillSpace(
                stateCount,
                spacetime[spacetime.length - 3],
                spacetime[spacetime.length - 2],
                spacetime[spacetime.length - 1],
                table);
        }
        return spacetime[t][x];
    };
    const at = (t: number, x: number) => {
        if (t < 0) { return; }
        if (x < 0 || x >= spaceSize) { return; }
        return _at(t, x);
    };

    return {
        spacetime,
        _at,
        at,
    };
}
