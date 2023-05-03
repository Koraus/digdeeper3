import { useState } from "react";
import type { jsx } from "@emotion/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { generateRandomDropzone } from "../../model/terms";
import { DropzonePreview } from "./DropzonePreview";
import { historicalWorldsRecoil } from "./historicalWorldsRecoil";
import { Dropzone } from "../../model/terms";
import { Dice } from "@emotion-icons/fa-solid/Dice";
import { eqDropzone } from "../../model/terms";
import { ChevronForward } from "@emotion-icons/ionicons-solid/ChevronForward";

export function NewDropzones({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const [isOpen, setIsOpen] = useState(false);

    const setProgression = useSetRecoilState(trekRecoil);

    const [historicalWorlds, setHistoricalWorlds] =
        useRecoilState(historicalWorldsRecoil);

    const [worlds, setWorlds] = useState<Dropzone[]>();

    const setWorld = (dropzone: Dropzone) => {
        setHistoricalWorlds([
            dropzone,
            ...historicalWorlds
                .filter(p => !eqDropzone(p, dropzone)),
        ]);
        setProgression({ dropzone });
    };

    if (!worlds) {
        setWorlds(Array.from({ length: 20 }, () => generateRandomDropzone()));
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
                }]} />Generate </h3>
            <button
                css={[{
                    margin: "0.9vmin 0",
                }]}
                onClick={() => setWorlds(
                    Array.from(
                        { length: 20 },
                        () => generateRandomDropzone()))}> Reroll </button>
            {worlds
                && <div css={[{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }]}>
                    {worlds.map((world, i) => <div key={i} css={[{
                        position: "relative",
                    }]}>
                        <DropzonePreview
                            css={[{
                                margin: "0.1vmin",
                            }]}
                            dropzone={world} />
                        <button
                            css={[{
                                position: "absolute",
                                bottom: "1vmin",
                                left: "50%",
                                transform: "translateX(-50%)",
                            }]}
                            onClick={() => setWorld(world)}
                        > Play!</button>
                    </div>)}
                </div>}
        </div>
    </div>;
}
