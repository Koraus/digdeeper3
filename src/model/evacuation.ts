
const firstEvacuationLineAt = 30;

const PHI = 1.618033988749895;
const iLogPHI = 1 / Math.log(PHI);
const evacuationLineFactor = firstEvacuationLineAt / (PHI - 1);
export const evacuationLineProgress = (t: number) =>
    Math.log(t / evacuationLineFactor + 1) * iLogPHI;
export const evacuationLinePosition = (p: number) =>
    (Math.pow(PHI, p) - 1) * evacuationLineFactor;