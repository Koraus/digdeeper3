import { useRecoilValue } from "recoil";
import { trekDropzone, sightAt } from "../model/terms";
import { trekRecoil } from "./trekRecoil";


export function Gui() {
    const progression = useRecoilValue(trekRecoil);
    const sight = sightAt(progression);
    const dropzone = trekDropzone(progression);

    return <div>

        <div>WASD / Arrows to move</div>
        <div>С to accept hint</div>
        <div>Z to undo</div>
        <div>---</div>
        <div>p: {sight.playerPosition.join(",")}</div>
        <div>Seed: {dropzone.seed}</div>
        <div>Energy: {sight.playerEnergy}</div>
        <div>Last move: {sight.log}</div>

    </div>;
}
