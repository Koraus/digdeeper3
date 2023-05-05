import { useRecoilValue } from "recoil";
import { trekDropzone, sightAt, generateRandomDropzone } from "../model/terms";
import { trekRecoil } from "./trekRecoil";
import { useSetDropzone } from "./lobby/useSetDropzone";


export function Gui() {
    const progression = useRecoilValue(trekRecoil);
    const sight = sightAt(progression);
    const dropzone = trekDropzone(progression);

    const setDropzone = useSetDropzone();

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
            <button
                onClick={() => setDropzone(dropzone)}
            >Restart</button>
            <button
                onClick={() =>
                    setDropzone(generateRandomDropzone(dropzone.world))}
            >New Dropzone</button>
            <button
                onClick={() =>
                    setDropzone(generateRandomDropzone())
                }
            >New World</button>
        </div>
    </div >;
}
