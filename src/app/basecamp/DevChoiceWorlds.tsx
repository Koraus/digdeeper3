import { useState } from "react";
import type { jsx } from "@emotion/react";
import { DropzonePreview } from "./DropzonePreview";
import { Dropzone } from "../../model/terms/Dropzone";
import { useSetDropzone } from "./useSetDropzone";
import { caStateCount } from "../../model/terms/World";
import { generateRandomDropzone, generateWorld } from "../../model/generate";
import { version as caVersion } from "../../ca";
import { Hiking } from "@emotion-icons/fa-solid/Hiking";

export const devChoiceWorlds = [
    "418459516935405908508209846366493604693",
    "353278173336238116464683288537109340634",
    "125432894114651584386512079219058453323",
    "375358561086232522799402423076844346150",
    "117320689941183655982114521230086064939",
    "80099586056416398604960037363570047041",
    "384277115668279449344695603946182104823",
    "232974959492229044052219571881457540176",
    "299995569439125313185844037724571538281",
    "369500507803108195110435666910293361907",
].map((rule) => generateWorld({
    ca: {
        v: caVersion,
        rule,
        stateCount: caStateCount,
    },
}));

export function DevChoiceWorlds({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const [dropzones, setDropzones] = useState<Dropzone[]>();

    const setDropzone = useSetDropzone();

    if (!dropzones) {
        setDropzones(
            devChoiceWorlds.map((world) => generateRandomDropzone({ world })));
    }
    return <div {...props}>
        <button
            css={[{
                margin: "0.9vmin 0",
            }]}
            onClick={() =>
                setDropzones(
                    devChoiceWorlds.map((world) =>
                        generateRandomDropzone({ world })))
            }> Reroll </button>
        {dropzones
            && <div css={[{
                listStyle: "none",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            }]}>
                {dropzones.map((dropzone, i) => <div key={i} css={[{
                    position: "relative",
                }]}>
                    <DropzonePreview
                        css={[{
                            margin: "0.1vmin",
                        }]}
                        dropzone={dropzone} />
                    <button
                        css={[{
                            position: "absolute",
                            bottom: "1vmin",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }]}
                        onClick={() => setDropzone(dropzone)}
                    >
                        <Hiking css={{ height: "1em", marginTop: "-0.2em" }} />
                        &nbsp;Go!
                    </button>
                </div>)}
            </div>}
    </div>;
}
