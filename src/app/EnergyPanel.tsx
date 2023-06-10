import { useRecoilValue } from "recoil";
import { sightAt, rawSightAt, playerActionRecoil } from "./playerActionRecoil";
import { jsx } from "@emotion/react";
import { LightningChargeFill } from "@emotion-icons/bootstrap/LightningChargeFill";


export function EnergyPanel({
    css: cssProp, ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const playerAction = useRecoilValue(playerActionRecoil);
    const trek = playerAction.trek;
    const log = playerAction.log ?? rawSightAt(trek)[1];
    const sight = sightAt(trek);

    const log1 = ("prev" in trek)
        ? rawSightAt(trek.prev)[1]
        : "";

    const log2 = ("prev" in trek && "prev" in trek.prev)
        ? rawSightAt(trek.prev.prev)[1]
        : "";

    return <div
        css={[{}, cssProp]}
        {...props}
    >
        <div css={{
            display: "flex",
            flexFlow: "row nowrap",
        }}>
            <div css={{
                fontSize: "5em",
                margin: "0.1em 0 -0.2em 0",
            }}>
                <LightningChargeFill css={{
                    height: "1em",
                    margin: "-0.1em 0 0.2em 0",
                }} />
                {sight.playerEnergy.toString().padStart(5, ".")}
            </div>
            <div css={{
                fontSize: "1em",
                marginLeft: "1.5em",
                display: "flex",
                flexFlow: "column nowrap",
                justifyContent: "flex-end",
            }}>
                <div css={{ opacity: 0.4, fontSize: "0.9em" }}>{log2}</div>
                <div css={{ opacity: 0.7, fontSize: "0.95em" }}>{log1}</div>
                <div>
                    {(playerAction.action?.action === "undo"
                        ? "⤣"
                        : playerAction.ok ? ">" : "⚠")}
                    &nbsp;
                    {log}</div>
            </div>
        </div>
    </div>;
}
