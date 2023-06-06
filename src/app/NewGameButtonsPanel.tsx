import { useRecoilValue } from "recoil";
import { startForTrek, trekRecoil } from "./trekRecoil";
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
import { dropEquipmentRecoil } from "./basecamp/dropEquipmentRecoil";



export function NewGameButtonsPanel({
    css: cssProp, ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const trek = useRecoilValue(trekRecoil);
    const drop = startForTrek(trek);
    const equipment = useRecoilValue(dropEquipmentRecoil);
    const setDrop = useSetDrop();

    return <div css={[{
        display: "flex",
        flexFlow: "row nowrap",
    }, cssProp]} {...props}>
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
                }]} />
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
                equipment,
            })}
        >
            <PinDrop
                css={[{
                    width: "2vmin",
                    marginRight: "0.4vmin",
                }]} />
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
                equipment,
            })}
        >
            <World
                css={[{
                    width: "2vmin",
                    marginRight: "0.4vmin",
                }]} />
            New World</button>
    </div>;
}
