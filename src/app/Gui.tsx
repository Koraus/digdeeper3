import { useRecoilValue } from "recoil";
import { sightAt, rawSightAt, startForTrek, trekRecoil } from "./trekRecoil";
import { RestartAlt } from "@emotion-icons/material/RestartAlt";
import { PinDrop } from "@emotion-icons/material-outlined/PinDrop";
import { World } from "@emotion-icons/boxicons-regular/World";
import { generateRandomDropzone } from "../model/generate";
import { useSetDrop } from "./basecamp/useSetDrop";
import { jsx } from "@emotion/react";
import { caStateCount } from "../model/terms/World";
import { generateWorld } from "../model/generate";
import { generateRandomSymmetricalRule } from "../ca/generateRandomSymmetricalRule";
import { version } from "../model/version";
import { levelCap, levelProgress, playerProgressionRecoil } from "./playerProgressionRecoil";
import { dropShadow5 } from "../utils/dropShadow5";


export function Gui({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const trek = useRecoilValue(trekRecoil);
    const [, log] = rawSightAt(trek);
    const sight = sightAt(trek);
    const drop = startForTrek(trek);
    const world = drop.zone.world;
    const { xp, level } = useRecoilValue(playerProgressionRecoil);

    const setDrop = useSetDrop();

    const levelPercentText =
        level < levelCap
            ? ((levelProgress(xp) % 1) * 100).toFixed(0) + "%"
            : "cap";

    return <div
        css={[{
            filter: dropShadow5("0.2em", "0.1em", "rgb(0 0 0 / 0.8)"),
        }, cssProp]}
        {...props}
    >
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
        <div>Last move: {log}</div>
        <div>---</div>
        <div>XP: {xp}</div>
        <div>
            Level: {level} ({levelPercentText})
        </div>

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
                        world: generateWorld({
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
