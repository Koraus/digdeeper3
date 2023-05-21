import { useRecoilValue } from "recoil";
import { sightAt, startForTrek } from "../model/terms";
import { trekRecoil } from "./trekRecoil";
import { RestartAlt } from "@emotion-icons/material/RestartAlt";
import { PinDrop } from "@emotion-icons/material-outlined/PinDrop";
import { World } from "@emotion-icons/boxicons-regular/World";
import { generateRandomDropzone } from "../model/Dropzone";
import { useSetDrop } from "./basecamp/useSetDrop";
import { jsx } from "@emotion/react";


export function Gui({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const progression = useRecoilValue(trekRecoil);
    const sight = sightAt(progression);
    const drop = startForTrek(progression);
    const world = drop.dropzone.world;

    const setDrop = useSetDrop();

    return <div {...props}>

        <div>WASD / Arrows to move</div>
        <div>С to accept hint</div>
        <div>Z to undo</div>
        <div>---</div>
        {world.sightVersion}<br />
        -- ca rule: {world.ca.rule}<br />
        -- drain: {world.stateEnergyDrain.join(" ")}
        &nbsp;/ gain: {world.stateEnergyGain.join(" ")}<br />

        - startFillState: {drop.dropzone.startFillState}<br />
        - seed: {drop.dropzone.seed}<br />
        - width: {drop.dropzone.width}<br />
        depthLeftBehind:{drop.depthLeftBehind} <br />
        equipment:{JSON.stringify(drop.equipment)}<br />
        <div>---</div>
        <div>p: {sight.playerPosition.join(",")}</div>
        <div>Energy: {sight.playerEnergy}</div>
        <div>Last move: {sight.log}</div>
        <div css={{
            pointerEvents: "all",
            display: "flex",
            flexWrap: "wrap",
        }}>
            <button
                onClick={() => setDrop(drop)}
                css={[{
                    display: "flex",
                    alignItems: "center",
                }]}
            >
                <RestartAlt
                    css={[{
                        width: "2vmin",
                        marginRight: "0.4vmin",
                    }]}
                />
                Restart</button>
            <button
                css={[{
                    display: "flex",
                    alignItems: "center",
                }]}
                onClick={() => setDrop({
                    dropzone: generateRandomDropzone(drop.dropzone.world),
                    depthLeftBehind: 10,
                    equipment: {
                        pickNeighborhoodIndex: 0,
                    },
                })}
            >
                <PinDrop
                    css={[{
                        width: "2vmin",
                        marginRight: "0.4vmin",
                    }]}
                />
                New Dropzone</button>
            <button
                css={[{
                    display: "flex",
                    alignItems: "center",
                }]}
                onClick={() => setDrop({
                    dropzone: generateRandomDropzone(),
                    depthLeftBehind: 10,
                    equipment: {
                        pickNeighborhoodIndex: 0,
                    },
                })}
            >
                <World
                    css={[{
                        width: "2vmin",
                        marginRight: "0.4vmin",
                    }]}
                />
                New World</button>
        </div>
    </div>;
}
