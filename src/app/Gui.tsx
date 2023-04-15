import { maxDepthEver, player } from "./model/player";
import { useEffect, useState } from "react";
import { Universe, universe } from "./model/universe";
import { log } from "./model/log";


export function Gui() {
    const [v, setV] = useState<number>();
    useEffect(() => {
        const d = universe.stateVersion.subscribe(setV);
        return () => d.unsubscribe();
    }, [universe.stateVersion]);

    return <div>
        <div>{v}</div>
        <div>Seed: {Universe.seed}</div>
        <div>Energy: {player.energy}</div>
        <div>Depth: {player.depth}
            &nbsp;/ {player.maxDepth}
            &nbsp;/ {maxDepthEver.get()}</div>
        <div>
            <div>Log:</div>
            {log.data.slice(0, 5).map((x, i) => <div
                key={i}
                css={{ opacity: 1 - i / 5 }}
            >
                {x.entry} {x.count};
            </div>)}
        </div>
    </div>;
}
