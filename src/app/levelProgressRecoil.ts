import { atom, useRecoilState } from "recoil";
import { localStorageAtomEffect } from "../utils/reactish/localStorageAtomEffect";
import { _never } from "../utils/_never";
import { Identify, identify, track } from "@amplitude/analytics-browser";
import { onChangeAtomEffect } from "../utils/reactish/onChangeAtomEffect";
import { knightMovesPerLevel, neighborhoods } from "../model/sight";


const PHI = 1.618033988749895;
const xpPerFirstLevel = 2;
const xpPerLevelProgress = (levelProgress: number) =>
    xpPerFirstLevel * Math.pow(PHI, Math.floor(levelProgress));
const addXp = (levelProgress: number, xp: number) => {
    while (xp > 0) {
        // xp needed to reach next level (not including current progress)
        const _xpPerLevelProgress = xpPerLevelProgress(levelProgress);

        const levelProgressToAdd = Math.min(
            // progress the given xp adds
            xp / _xpPerLevelProgress,

            // progress needed to reach next level
            1 - (levelProgress % 1));

        levelProgress += levelProgressToAdd;
        xp -= levelProgressToAdd * _xpPerLevelProgress;
    }
    return levelProgress;
};


export const levelCap =
    neighborhoods.length
    + knightMovesPerLevel.length;

// Level is stored as state agnostically as possible
// so that the level achieved persists
// even if the progression implementation changes.
// The levelProgress value includes both the level 
// and the progress towards the next level (as a fractional part).
export const levelProgressRecoil = atom({
    key: "levelProgress",
    default: 0,
    effects: [
        localStorageAtomEffect(),
        ({ onSet, getInfo_UNSTABLE, node }) => {
            const levelProgress = getInfo_UNSTABLE(node).loadable?.getValue();
            if (levelProgress !== undefined) {
                identify(new Identify().set("level", levelProgress));
            }
            onSet(
                (levelProgress) =>
                    identify(new Identify().set("level", levelProgress)));
        },
        onChangeAtomEffect({
            select: x => Math.floor(x),
            onChange: (level) =>
                track("level up", { level }),
        }),
    ],
});


const lastXpTriggersRecoil = atom({
    key: "lastXpTriggers",
    default: [] as string[],
    effects: [
        localStorageAtomEffect(),
    ],
});


export const useRegisterXp = () => {
    const [levelProgress, setLevelProgress] =
        useRecoilState(levelProgressRecoil);
    const [lastXpTriggers, setLastXpTriggers] =
        useRecoilState(lastXpTriggersRecoil);
    return (xp: number, trigger: string) => {
        if (levelProgress >= levelCap) { return; }
        if (lastXpTriggers.includes(trigger)) { return; }

        setLastXpTriggers([trigger, ...lastXpTriggers].slice(0, 10));
        const nextLevelProgress = Math.min(addXp(levelProgress, xp), levelCap);
        setLevelProgress(nextLevelProgress);
    };
};