import { atom } from "recoil";
import { localStorageAtomEffect } from "../utils/reactish/localStorageAtomEffect";
import { setOptOut } from "./initAnalytics";
import { onChangeAtomEffect } from "../utils/reactish/onChangeAtomEffect";
import { track } from "@amplitude/analytics-browser";

export const optOutAnalyticsRecoil = atom({
    key: "optInAnalytics",
    default: false,
    effects: [
        localStorageAtomEffect(),
        ({ onSet, getInfo_UNSTABLE, node }) => {
            setOptOut(getInfo_UNSTABLE(node).loadable?.getValue() ?? false);
            onSet((optOut) => setOptOut(optOut));
        },
        onChangeAtomEffect({
            select: x => JSON.stringify(x),
            onChange: (_, __, x, ___, ____, { node: { key } }) =>
                track(key, { value: x }),
        }),
    ],
});