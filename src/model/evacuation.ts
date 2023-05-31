import { _never } from "../utils/_never";

const firstEvacuationLineAt = 30;

const PHI = 1.618033988749895;
export const evacuationLineProgress = (t: number) =>
    Math.log(t * (PHI - 1) / firstEvacuationLineAt + 1) / Math.log(PHI);
export const approximatedEvacuationLinePosition = (t: number) =>
    (Math.pow(PHI, t) - 1) * firstEvacuationLineAt / (PHI - 1);

export const isEvacuationLineCrossed = (prevT: number, nextT: number) =>
    prevT !== nextT
    && (Math.floor(evacuationLineProgress(prevT)) !==
        Math.floor(evacuationLineProgress(nextT)));

export const evacuationLinePosition = (p: number): number => {
    const approximated = Math.round(approximatedEvacuationLinePosition(p));
    if (isEvacuationLineCrossed(approximated - 1, approximated)) {
        return approximated;
    }
    if (isEvacuationLineCrossed(approximated, approximated + 1)) {
        return approximated + 1;
    }

    // expect to never need to check broader range
    return _never();
};