import { useState } from "react";
import type { jsx } from "@emotion/react";
import { DropzonePreview } from "./DropzonePreview";
import { Dice } from "@emotion-icons/fa-solid/Dice";
import { ChevronForward } from "@emotion-icons/ionicons-solid/ChevronForward";
import { useSetDrop } from "../useSetDrop";
import { Dropzone, generateRandomDropzone } from "../../model/Dropzone";

export function NewDropzones({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropzones, setDropzones] = useState<Dropzone[]>();

    const setDrop = useSetDrop();

    if (!dropzones) {
        setDropzones(Array.from({ length: 5 }, () => generateRandomDropzone()));
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
                onClick={() => setDropzones(
                    Array.from(
                        { length: 50 },
                        () => generateRandomDropzone()))}> Reroll </button>
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
                            onClick={() => setDrop({
                                dropzone: dropzone,
                                depthLeftBehind: 10,
                                equipment: {
                                    pickNeighborhoodIndex: 0,
                                },
                            })}
                        > Play!</button>
                    </div>)}
                </div>}
        </div>
    </div>;
}
