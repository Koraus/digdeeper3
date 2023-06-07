import { atom, useRecoilState } from "recoil";
import { localStorageAtomEffect } from "../utils/reactish/localStorageAtomEffect";
import update from "immutability-helper";
import { _never } from "../utils/_never";
import { Identify, identify, track } from "@amplitude/analytics-browser";
import { onChangeAtomEffect } from "../utils/reactish/onChangeAtomEffect";

const firstLevelAt = 2;

const PHI = 1.618033988749895;
export const levelProgress = (t: number) =>
    Math.log(t * (PHI - 1) / firstLevelAt + 1) / Math.log(PHI);

export const levelCap = 2;

export const playerProgressionRecoil = atom({
    key: "playerProgression",
    default: {
        xp: 0,

        // level is stored separately from xp
        // so that the level achieved is stored
        // even if the xp curve changes
        level: 0,
    },
    effects: [
        localStorageAtomEffect({
            key: key => `${key}@1`,
        }),
        ({ onSet, getInfo_UNSTABLE, node }) => {
            const value = getInfo_UNSTABLE(node).loadable?.getValue();
            if (value) { setPlayerUserProps(value); }
            onSet(setPlayerUserProps);
        },
        onChangeAtomEffect({
            select: x => JSON.stringify(x),
            onChange: (_, __, x, ___, ____, { node: { key } }) =>
                track(key, x),
        }),
        onChangeAtomEffect({
            select: ({ level }) => level,
            onChange: (level) => track("level up", { level }),
        }),
    ],
});

const setPlayerUserProps = ({
    level, xp,
}: typeof playerProgressionRecoil.__tag[0]) => {
    const props = new Identify();
    props.set("level", level);
    props.set("xp", xp);
    identify(props);
};


export const useRegisterXp = () => {
    const [playerProgression, setPlayerProgression] =
        useRecoilState(playerProgressionRecoil);
    return (xp: number) => {
        if (playerProgression.level >= levelCap) {
            return;
        }

        const nextXp = playerProgression.xp + xp;
        const nextLevel =
            Math.max(
                Math.floor(levelProgress(nextXp)),
                Math.min(levelCap, playerProgression.level));
        return setPlayerProgression(prev => update(prev, {
            xp: { $set: nextXp },
            level: { $set: nextLevel },
        }));
    };
};