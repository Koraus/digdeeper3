import { useEffect, useState } from "react";
import { useSetDropzone } from "./basecamp/useSetDropzone";
import { generateRandomDropzone } from "../model/generate";
import { devChoiceWorlds } from "./basecamp/DevChoiceWorlds";
import { fetchDailyDateseed } from "./fetchDateseed";
import { generateCuratedDailyDropzone } from "./NewGameInCuratedDailyDropzoneButton";


const randomEl = <T>(arr: readonly T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

const prefetchedDailyDateseed = fetchDailyDateseed();

// set the very first world once on start
export function useSetInitialDropzoneEffect() {
    const [done, setDone] = useState(false);
    const setDropzone = useSetDropzone();
    useEffect(() => {
        (async () => {
            const seed = await Promise.race([
                prefetchedDailyDateseed,

                // give a chance to the curated daily world to load
                // to avoid flickering
                new Promise<undefined>(resolve => setTimeout(
                    () => resolve(undefined),
                    1000)),
            ]);

            setDropzone(
                seed
                    ? generateCuratedDailyDropzone(seed)
                    : generateRandomDropzone({
                        world: randomEl(devChoiceWorlds),
                    }));

            setDone(true);
        })();
    }, []);
    return done;
}
