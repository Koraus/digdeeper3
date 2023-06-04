import { useState } from "react";
import type { jsx } from "@emotion/react";
import { DropzonePreview } from "./DropzonePreview";
import { Dropzone } from "../../model/terms/Dropzone";
import { useSetDropzone } from "./useSetDropzone";
import { caStateCount } from "../../model/terms/World";
import { generateRandomDropzone, generateWorld } from "../../model/generate";
import { generateRandomSymmetricalRule } from "../../ca/generateRandomSymmetricalRule";
import { generateRandomRule } from "../../ca/generateRandomRule";
import { getComposition } from "../../ca/calculateComposition";

const generators = {
    "symmetrical": generateRandomSymmetricalRule,
    "full": generateRandomRule,
} as const;

export function NewDropzones({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const [dropzones, setDropzones] = useState<Dropzone[]>([]);

    const [generator, setGenerator] =
        useState<keyof typeof generators>("symmetrical");

    const setDropzone = useSetDropzone();

    const [isCompositionFiltered, setIsCompositionFiltered] = useState(false);
    const [generateCount, setGenerateCount] = useState(10);

    if (dropzones.length === 0) {
        setDropzones(
            Array.from({ length: generateCount },
                () => generateRandomDropzone({
                    world: generateWorld({
                        ca: generators[generator](caStateCount),
                    }),
                })));
    }

    let filteredDropzones = dropzones;

    const rockRange = [0.5, 1];
    const energyRange = [0.00001, 0.1];
    if (isCompositionFiltered) {
        filteredDropzones = dropzones.filter((v) => {
            const composition = getComposition(v.world.ca);

            const [rock, _grass, energy] = composition
                .map((p, i) => [p, i])
                .sort(([a], [b]) => b - a)
                .map(([_, i]) => i);
            return composition[rock] >= rockRange[0]
                && composition[rock] <= rockRange[1]
                && composition[energy] >= energyRange[0]
                && composition[energy] <= energyRange[1];
        });
    }

    return <div {...props}>
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
        </label> =&gt; <label>
            Count:
            <select
                value={generateCount}
                onChange={e => setGenerateCount(Number(e.target.value))}
            >
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="100">100</option>
            </select>
        </label> =&gt; <button
            css={[{
                margin: "0.9vmin 0",
            }]}
            onClick={() => {
                setDropzones(
                    Array.from(
                        { length: generateCount },
                        () => generateRandomDropzone({
                            world: generateWorld({
                                ca: generators[generator](caStateCount),
                            }),
                        })));
            }}> (Re-)generate </button>
        <br />
        <label>
            <input type="checkbox"
                onChange={() =>
                    setIsCompositionFiltered(!isCompositionFiltered)} />
            filter rock in {JSON.stringify(rockRange)}
            &nbsp;and energy in {JSON.stringify(energyRange)}
        </label>
        <br />
        <div css={[{
            listStyle: "none",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
        }]}>
            {filteredDropzones.map((dropzone, i) => <div key={i} css={[{
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
        </div>
    </div>;
}
