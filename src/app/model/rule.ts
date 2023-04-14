export const rule = new class Rule {
    readonly stateCount = 3;
    readonly ruleSpaceSizePower = 3 * (this.stateCount - 1) + 1;
    readonly spaceNeighbourhoodRadius = 1;
    readonly code = 1815;
    readonly tableString =
        (this.code)
            .toString(this.stateCount)
            .padStart(this.ruleSpaceSizePower, "0");
    readonly table = Array.from(this.tableString).reverse().map(x => +x);

    getState(
        getState: (t: number, x: number) => number | undefined,
        t: number,
        x: number,
    ) {
        const nm1 = getState(t - 1, x - 1);
        const nz0 = getState(t - 1, x);
        const np1 = getState(t - 1, x + 1);
        if (
            "undefined" == typeof nm1
            || "undefined" == typeof nz0
            || "undefined" == typeof np1
        ) {
            return undefined;
        }
        const sum = nm1 + nz0 + np1;
        return this.table[sum];
    }
};
