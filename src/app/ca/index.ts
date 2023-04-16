export const getFullCombinedState =
    (stateCount: number, n1: number, c: number, n2: number, pc: number) =>
        n1 + stateCount * (c + stateCount * (n2 + stateCount * pc));

export function fillSpace(
    stateCount: number,
    prevPrevSpace: number[],
    prevSpace: number[],
    outSpace: number[],
    table: number[],
) {
    const nr = 1;
    for (let x = nr; x < outSpace.length - nr; x++) {
        const cs = getFullCombinedState(
            stateCount,
            prevSpace[x - 1],
            prevSpace[x],
            prevSpace[x + 1],
            prevPrevSpace[x]);
        outSpace[x] = table[cs];
    }
}

export const toFullTable = (
    stateCount: number,
    getState: typeof getFullCombinedState,
) => {
    const table: number[] = Array.from({ length: stateCount ** 4 });

    for (let n1 = 0; n1 < stateCount; n1++) {
        for (let c = 0; c < stateCount; c++) {
            for (let n2 = 0; n2 < stateCount; n2++) {
                for (let pc = 0; pc < stateCount; pc++) {
                    table[getFullCombinedState(stateCount, n1, c, n2, pc)] =
                        getState(stateCount, n1, c, n2, pc);
                }
            }
        }
    }

    return table;
};