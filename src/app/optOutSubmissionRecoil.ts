import { atom } from "recoil";
import { localStorageAtomEffect } from "../utils/reactish/localStorageAtomEffect";
import { onChangeAtomEffect } from "../utils/reactish/onChangeAtomEffect";
import { track } from "@amplitude/analytics-browser";


export const optOutSubmissionRecoil = atom({
    key: "optOutSubmission",
    default: false,
    effects: [
        localStorageAtomEffect(),
        onChangeAtomEffect({
            select: x => JSON.stringify(x),
            onChange: (_, __, x, ___, ____, { node: { key } }) =>
                track(key, { value: x }),
        }),
    ],
});