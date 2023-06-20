import { useRecoilValue } from "recoil";
import { playerActionRecoil, startForTrek } from "./playerActionRecoil";
import { RestartAlt } from "@emotion-icons/material/RestartAlt";
import { PinDrop } from "@emotion-icons/material-outlined/PinDrop";
import { World } from "@emotion-icons/boxicons-regular/World";
import { generateRandomDropzone } from "../model/generate";
import { useSetDrop } from "./basecamp/useSetDrop";
import { jsx } from "@emotion/react";
import { caStateCount } from "../model/terms/World";
import { generateWorld } from "../model/generate";
import { generateRandomSymmetricalRule } from "../ca/generateRandomSymmetricalRule";
import { useSetDropzone } from "./basecamp/useSetDropzone";
import { useTranslate } from "./languageRecoil";
import { _throw } from "../utils/_throw";
import { NewGameInCuratedDailyDropzoneButton } from "./NewGameInCuratedDailyDropzoneButton";
import { NewGameInWildDailyDropzoneButton } from "./NewGameInWildDailyDropzoneButton";
import { NewGameInCuratedMonthlyDropzoneButton } from "./NewGameInCuratedMonthlyDropzoneButton";
import { NewGameInWildMonthlyDropzoneButton } from "./NewGameInWildMonthlyDropzoneButton";


export function NewGameButtonsPanel({
    css: cssProp, ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const trek = useRecoilValue(playerActionRecoil).trek;
    const drop = startForTrek(trek);
    const setDrop = useSetDrop();
    const setDropzone = useSetDropzone();
    const translate = useTranslate();

    return <div css={[{
        display: "flex",
        flexFlow: "column nowrap",
    }, cssProp]} {...props}>
        <div css={[{
            display: "flex",
            flexFlow: "row nowrap",
        }]}>
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
                {translate("Restart")}
            </button>
            <button
                css={[{
                    display: "flex",
                    alignItems: "center",
                }]}
                onClick={() => setDropzone(generateRandomDropzone({
                    world: drop.zone.world,
                }))}
            >
                <PinDrop
                    css={[{
                        width: "2vmin",
                        marginRight: "0.4vmin",
                    }]} />
                {translate("New Dropzone")}
            </button>
            <button
                css={[{
                    display: "flex",
                    alignItems: "center",
                }]}
                onClick={() => setDropzone(generateRandomDropzone({
                    world: generateWorld({
                        // todo use gen rules from "NewDropzones" here
                        ca: generateRandomSymmetricalRule(caStateCount),
                    }),
                }))}
            >
                <World
                    css={[{
                        width: "2vmin",
                        marginRight: "0.4vmin",
                    }]} />
                {translate("New World")}
            </button>
        </div>
        <div css={[{
            display: "flex",
            flexFlow: "row nowrap",
        }]}>
            <NewGameInCuratedDailyDropzoneButton />
            <NewGameInWildDailyDropzoneButton />
        </div>
        <div css={[{
            display: "flex",
            flexFlow: "row nowrap",
        }]}>
            <NewGameInCuratedMonthlyDropzoneButton />
            <NewGameInWildMonthlyDropzoneButton />
        </div>
    </div>;
}
