import { useRecoilValue } from "recoil";
import { progressionProblem, worldAt } from "../model/terms";
import { progressionRecoil } from "./progressionRecoil";


export function Gui() {
    const progression = useRecoilValue(progressionRecoil);
    const world = worldAt(progression);
    const problem = progressionProblem(progression);

    return <div>
        <div>p: {world.playerPosition.join(",")}</div>
        <div>Seed: {problem.seed}</div>
        <div>Energy: {world.playerEnergy}</div>
        <div>Last move: {world.log}</div>
    </div>;
}
