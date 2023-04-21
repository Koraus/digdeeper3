import { useEffect, useRef, useState } from "react";
import { toFullTable } from "../ca";
import { getDigits } from "../ca/digits";

export function WorldSelectionPanel({
    ...props
}) {
    const [list, setList] = useState<number[][] | []>([]);

    useEffect(() => {
        const pretable = getDigits(1815n, 3);
        setList(Array.from({ length: 10 },
            () => toFullTable(3, () => pretable[Math.floor(Math.random() * 4)]))
        );
    }, []);

    console.log(list);

    return <div
        css={[{
            background: "#000000b0",
            border: "1px solid #ffffffb0",
        }]}
        {...props}
    >
        WorldSelectionPanel <br />
        <button
            onClick={() => { console.log("Reroll"); }}> Reroll </button>
        <ul> {
            list.map((space, index) =>
                <li> <WorldPreview index={index} space={space} /> </li>)}
        </ul>
    </div>;
}

export function WorldPreview({ index, space, ...props }:
    { index: number, space: number[] }) {
    const selectedWorldRef = useRef(null);
    const canvasRef = useRef(null);
    // render space on canvas
    return <div
        key={index}
        ref={selectedWorldRef}
        onClick={
            () => { console.log("WorldPreview", selectedWorldRef.current); }
        }
        css={[
            {
                width: "50px",
                height: "50px",
                background: "red",
                border: "1px solid #ffffffb0",
            },
        ]}>
        <div> {space} </div>
        <canvas ref={canvasRef} css={[{ width: "100%", height: "100%" }]}>
        </canvas>
    </div>;
}