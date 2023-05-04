import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { trekDropzone, sightAt, generateRandomDropzone, Dropzone, eqDropzone } from "../model/terms";
import { trekRecoil } from "./trekRecoil";
import { historicalWorldsRecoil } from "./lobby/historicalWorldsRecoil";


export function Gui() {
    const progression = useRecoilValue(trekRecoil);
    const setProgression = useSetRecoilState(trekRecoil);
    const sight = sightAt(progression);
    const dropzone = trekDropzone(progression);

    const [historicalWorlds, setHistoricalWorlds] =
        useRecoilState(historicalWorldsRecoil);

    const setWorld = (dropzone: Dropzone) => {
        setHistoricalWorlds([
            dropzone,
            ...historicalWorlds
                .filter(p => !eqDropzone(p, dropzone)),
        ]);
        setProgression({ dropzone });
    };

    return <div>

        <div>WASD / Arrows to move</div>
        <div>С to accept hint</div>
        <div>Z to undo</div>
        <div>---</div>
        <div>p: {sight.playerPosition.join(",")}</div>
        <div>Seed: {dropzone.seed}</div>
        <div>Energy: {sight.playerEnergy}</div>
        <div>Last move: {sight.log}</div>
        <div css={{
            pointerEvents: "all",
            display: "flex",
            flexWrap: "wrap",
        }}>
            <button onClick={() => setProgression({ dropzone })}
            > Restart </button>
            <button
                onClick={() => { setWorld(generateRandomDropzone()); }}
            > New World
            </button>
        </div>
    </div >;
}
