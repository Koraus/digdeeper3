import { useState } from "react";
import type { jsx } from "@emotion/react";
import { DropzonePreview } from "./DropzonePreview";
import { Dice } from "@emotion-icons/fa-solid/Dice";
import { ChevronForward } from "@emotion-icons/ionicons-solid/ChevronForward";
import { Dropzone } from "../../model/terms/Dropzone";
import { useSetDropzone } from "./useSetDropzone";
import { caStateCount } from "../../model/terms/World";
import { generateRandomDropzone, generateRandomWorld } from "../../model/generate";
import { generateRandomSymmetricalRule } from "../../ca/generateRandomSymmetricalRule";
import { generateRandomRule } from "../../ca/generateRandomRule";

const generators = {
    "symmetrical": generateRandomSymmetricalRule,
    "full": generateRandomRule,
} as const;

export function NewDropzones({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropzones, setDropzones] = useState<Dropzone[]>();

    const [generator, setGenerator] =
        useState<keyof typeof generators>("symmetrical");

    const setDropzone = useSetDropzone();

    if (!dropzones) {
        setDropzones(Array.from({ length: 5 }, () => generateRandomDropzone({
            world: generateRandomWorld({
                ca: generators[generator](caStateCount),
            }),
        })));
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
            <label>
                Generator: <select
                    value={generator}
                    onChange={e =>
                        setGenerator(e.target.value as keyof typeof generators)}
                >
                    {Object.keys(generators).map((key) => <option
                        key={key}
                        value={key}
                    >{key}</option>)}
                </select>
            </label>
            <br />
            <button
                css={[{
                    margin: "0.9vmin 0",
                }]}
                onClick={() => setDropzones(
                    Array.from(
                        { length: 5 },
                        () => generateRandomDropzone({
                            world: generateRandomWorld({
                                ca: generators[generator](caStateCount),
                            }),
                        })))}> Reroll </button>
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
