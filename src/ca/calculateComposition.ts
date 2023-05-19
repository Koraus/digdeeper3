import { LehmerPrng } from "../utils/LehmerPrng";
import { fillSpace } from "./fillSpace";
import { Code, parseFullTransitionLookupTable } from ".";


export function calculateComposition(caCode: Code) {
    const { stateCount } = caCode;
    const table = parseFullTransitionLookupTable(caCode);

    const spaceSize = 100;
    const timeSize = 1000;

    const spaceMargin = 2;
    const timeMargin = 5;

    const random = new LehmerPrng(4242);

    let prevPrevSpace =
        Array.from({ length: spaceSize }, () => random.next() % stateCount);
    let prevSpace =
        Array.from({ length: spaceSize }, () => random.next() % stateCount);
    let space =
        Array.from({ length: spaceSize }) as number[];

    let t = 2;

    const compostion = Array.from({ length: stateCount }, () => 0);

    for (; t < timeSize; t++) {
        space[0] = random.next() % stateCount;
        space[space.length - 1] = random.next() % stateCount;
        fillSpace(stateCount, prevPrevSpace, prevSpace, space, table);

        const tmp = space;
        prevPrevSpace = prevSpace;
        prevSpace = space;
        space = tmp;

        if (t < timeMargin) { continue; }

        for (let x = spaceMargin; x < spaceSize - spaceMargin; x++) {
            compostion[space[x]]++;
        }
    }

    const sum = compostion.reduce((a, b) => a + b, 0);
    return compostion.map(c => c / sum);
}
