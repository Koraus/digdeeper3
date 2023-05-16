import { useState } from "react";
import type { jsx } from "@emotion/react";
import { generateRandomDropzone } from "../../model/terms";
import { DropzonePreview } from "./DropzonePreview";
import { Dropzone } from "../../model/terms";
import { Dice } from "@emotion-icons/fa-solid/Dice";
import { ChevronForward } from "@emotion-icons/ionicons-solid/ChevronForward";
import { useSetDropzone } from "./useSetDropzone";
import { WorldСomposition } from "./WorldСomposition";

export function NewDropzones({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const [isOpen, setIsOpen] = useState(false);
    const [worlds, setWorlds] = useState<Dropzone[]>();

    const setDropzone = useSetDropzone();

    if (!worlds) {
        setWorlds(Array.from({ length: 5 }, () => generateRandomDropzone()));
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
                        { length: 5 },
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
                        <WorldСomposition
                            world={world.world}
                            seed={world.seed}
                            width={world.width}
                            space={20}
                        />
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
                            onClick={() => setDropzone(world)}
                        > Play!</button>
                    </div>)}
                </div>}
        </div>
    </div>;
}
