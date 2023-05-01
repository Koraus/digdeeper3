import { useRecoilValue } from "recoil";
import { trekWorld, sightAt } from "../model/terms";
import { trekRecoil } from "./trekRecoil";


export function Gui() {
    const progression = useRecoilValue(trekRecoil);
    const sight = sightAt(progression);
    const world = trekWorld(progression);

    return <div>

        <div>WASD / Arrows to move</div>
        <div>С to accept hint</div>
        <div>Z to undo</div>
        <div>---</div>
        <div>p: {sight.playerPosition.join(",")}</div>
        <div>Seed: {world.seed}</div>
        <div>Energy: {sight.playerEnergy}</div>
        <div>Last move: {sight.log}</div>

    </div>;
}
