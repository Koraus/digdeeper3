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
import { playerProgressionRecoil } from "./playerProgressionRecoil";
import { dropShadow5 } from "../utils/dropShadow5";
import { evacuationLineProgress } from "../model/evacuation";
import { LightningChargeFill } from "@emotion-icons/bootstrap/LightningChargeFill";
import { LevelBadge } from "./LevelBadge";

export function Gui({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const trek = useRecoilValue(trekRecoil);
    const [, log] = rawSightAt(trek);
    const sight = sightAt(trek);
    const drop = startForTrek(trek);
    const pos = sight.playerPosition;

    const log1 =
        ("prev" in trek)
            ? rawSightAt(trek.prev)[1]
            : "";

    const log2 =
        ("prev" in trek && "prev" in trek.prev)
            ? rawSightAt(trek.prev.prev)[1]
            : "";

    const theEvacuationLineProgress = evacuationLineProgress(pos[1]) % 1;
    const theEvacuationLineProgress1 =
        evacuationLineProgress(sight.maxDepth) % 1;

    const setDrop = useSetDrop();

    return <div
        css={[{
            filter: dropShadow5("0.2em", "0.1em", "rgb(0 0 0 / 0.8)"),
        }, cssProp]}
        {...props}
    >
        <div css={{
            position: "relative",
            width: "40vmin",
            height: "0.3vmin",
            margin: "1vmin 0 0 0",
        }}>
            <div css={{
                position: "absolute",
                inset: "0",
                background: "#f91702",
            }} />
            <div css={{
                position: "absolute",
                inset: `0 ${100 * (1 - theEvacuationLineProgress1)}% 0 0`,
                background: "#f98602",
            }} />
            <div css={{
                position: "absolute",
                top: "50%",
                left: `${100 * theEvacuationLineProgress}%`,
                background: "#ffc98b",
                height: "300%",
                aspectRatio: "1/1",
                borderRadius: "50%",
                border: "0.2vmin solid #f98602",
                translate: "-50% -50%",
            }}>
                <div css={{
                    background: "#000000",
                    height: "40%",
                    width: "80%",
                    position: "absolute",
                    left: "10%",
                    top: "25%",
                }} />
            </div>
        </div>

        <div css={{
            fontSize: "0.7em",
            margin: "1em 0 -3em 0",
        }}>{sight.playerPosition.join(",")}</div>

        <div css={{
            display: "flex",
            flexFlow: "row nowrap",
            margin: "0.7em 0 0 0",
        }}>
            <div css={{
                fontSize: "5em",
            }}>
                <LightningChargeFill css={{
                    height: "1em",
                    margin: "-0.1em 0 0.1em 0",
                }} />
                {sight.playerEnergy.toString().padStart(5, ".")}
            </div>
            <div css={{
                fontSize: "1em",
                margin: "1.5em 0 0 1.5em",
            }}>
                <span css={{ opacity: 0.4, fontSize: "0.9em" }}>{log2}</span>
                <br />
                <span css={{ opacity: 0.7, fontSize: "0.95em" }}>{log1}</span>
                <br />
                &gt; {log}
            </div>
        </div>

        <div css={{
            pointerEvents: "all",
            display: "flex",
            flexFlow: "row nowrap",
            margin: "1em 0 0 0",
            // width: "40vmin",
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

        <br />

        <LevelBadge />
    </div >;
}
