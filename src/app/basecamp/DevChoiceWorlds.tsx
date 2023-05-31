import { useState } from "react";
import type { jsx } from "@emotion/react";
import { DropzonePreview } from "./DropzonePreview";
import { Dice } from "@emotion-icons/fa-solid/Dice";
import { ChevronForward } from "@emotion-icons/ionicons-solid/ChevronForward";
import { Dropzone } from "../../model/terms/Dropzone";
import { useSetDropzone } from "./useSetDropzone";
import { caStateCount } from "../../model/terms/World";
import { generateRandomDropzone, generateWorld } from "../../model/generate";
import { version as caVersion } from "../../ca";

export const devChoiceWorlds = [
    "418459516935405908508209846366493604693",
    "353278173336238116464683288537109340634",
    "125432894114651584386512079219058453323",
    "375358561086232522799402423076844346150",
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
    const [isOpen, setIsOpen] = useState(true);
    const [dropzones, setDropzones] = useState<Dropzone[]>();

    const setDropzone = useSetDropzone();

    if (!dropzones) {
        setDropzones(
            devChoiceWorlds.map((world) => generateRandomDropzone({ world })));
    }

    return <div {...props}>
        <div css={[{
            height: isOpen ? "fit-content" : "3vmin",
            overflow: "hidden",
            marginBottom: "1vmin",
        }]}>
            <h3 css={[{
                margin: "0.9vmin 0",
            }]}
                onClick={() => setIsOpen(!isOpen)}
            >
                <ChevronForward css={[{
                    transitionDuration: "100ms",
                    width: "2vmin",
                    marginRight: "0.4vmin",
                    transform: isOpen
                        ? "rotate(90deg)" : "rotate(0deg)",
                }]} />
                <Dice css={[{
                    width: "2vmin",
                    marginRight: "0.6vmin",
                }]} />Dev Choice Worlds</h3>
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
                        > Play!</button>
                    </div>)}
                </div>}
        </div>
    </div>;
}
