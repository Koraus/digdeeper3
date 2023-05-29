import { useRecoilValue } from "recoil";
import { sightAt, startForTrek } from "../model/sightAtTrek";
import { trekRecoil } from "./trekRecoil";
import { RestartAlt } from "@emotion-icons/material/RestartAlt";
import { PinDrop } from "@emotion-icons/material-outlined/PinDrop";
import { World } from "@emotion-icons/boxicons-regular/World";
import { generateRandomDropzone } from "../model/generate";
import { useSetDrop } from "./basecamp/useSetDrop";
import { jsx } from "@emotion/react";
import { caStateCount } from "../model/terms/World";
import { generateRandomWorld } from "../model/generate";
import { generateRandomSymmetricalRule } from "../ca/generateRandomSymmetricalRule";
import { version } from "../model/version";


export function Gui({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const progression = useRecoilValue(trekRecoil);
    const sight = sightAt(progression);
    const drop = startForTrek(progression);
    const world = drop.zone.world;

    const setDrop = useSetDrop();

    return <div {...props}>
        {world.v}<br />
        -- ca rule: {world.ca.rule}<br />
        -- drain: {world.stateEnergyDrain.join(" ")}
        &nbsp;/ gain: {world.stateEnergyGain.join(" ")}<br />

        - startFillState: {drop.zone.startFillState}<br />
        - seed: {drop.zone.seed}<br />
        - width: {drop.zone.width}<br />
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
                    v: version,
                    zone: generateRandomDropzone({
                        world: drop.zone.world,
                    }),
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
                    v: version,
                    zone: generateRandomDropzone({
                        world: generateRandomWorld({
                            // todo use gen rules from "NewDropzones" here
                            ca: generateRandomSymmetricalRule(caStateCount),
                        }),
                    }),
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
