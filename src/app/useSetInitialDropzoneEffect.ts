import { useEffect, useState } from "react";
import { useSetDropzone } from "./basecamp/useSetDropzone";
import { generateRandomDropzone } from "../model/generate";
import { devChoiceWorlds } from "./basecamp/DevChoiceWorlds";
import { fetchDailyDateseed } from "./fetchDateseed";
import { generateCuratedDailyDropzone } from "./NewGameInCuratedDailyDropzoneButton";
import usePromise from "react-use-promise";


const randomEl = <T>(arr: readonly T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

const prefetchedDailyDateseed = fetchDailyDateseed();

// set the very first world once on start
export function useSetInitialDropzoneEffect() {
    const setDropzone = useSetDropzone();
    const [seed, , seedStatus] = usePromise(() => Promise.race([
        (async () => {
            try {
                return await prefetchedDailyDateseed;
            } catch (ex) {
                console.error(ex);
                return undefined;
            }
        })(),

        // give a chance to the curated daily world to load
        // to avoid flickering
        // but fallback to random world if it takes too long
        new Promise<undefined>(resolve => setTimeout(
            () => resolve(undefined),
            1000)),
    ]), []);
    useEffect(() => {
        if (seedStatus !== "resolved") { return; }
        setDropzone(
            seed
                ? generateCuratedDailyDropzone(seed)
                : generateRandomDropzone({
                    world: randomEl(devChoiceWorlds),
                }));
    }, [seedStatus]);
    return seedStatus === "resolved";
}
