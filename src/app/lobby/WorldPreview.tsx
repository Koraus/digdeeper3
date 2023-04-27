import { useEffect, useRef, useMemo } from "react";
import { ca } from "../../model/ca";
import type { jsx } from "@emotion/react";


export function WorldPreview({
    stateCount, table, spaceSize, seed, emptyState, ...props
}: {
    stateCount: number;
    table: number[];
    spaceSize: number;
    emptyState: number;
    seed: number;
} & jsx.JSX.IntrinsicElements["div"]) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const theCa = useMemo(() => ca({
        stateCount,
        table,
        spaceSize,
        emptyState,
        seed,
    }), [stateCount, table, spaceSize, emptyState, seed]);

    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) { return; }

        const ctx = canvasEl.getContext("2d");
        if (!ctx) { return; }

        const colorMap = [
            [128, 0, 255, 255],
            [64, 64, 64, 255],
            [128, 255, 0, 255],
        ];

        const w = spaceSize;
        const h = 100;

        const myImageData = ctx.createImageData(w, h);
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const color = colorMap[theCa._at(y, x)];
                myImageData.data[i + 0] = color[0]; // R 
                myImageData.data[i + 1] = color[1]; // G 
                myImageData.data[i + 2] = color[2]; // B 
                myImageData.data[i + 3] = color[3]; // A 
            }
        }

        const scale = 2;
        canvasEl.width = w * scale;
        canvasEl.height = h * scale;

        ctx.putImageData(myImageData, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvasEl, 0, 0, w, h, 0, 0, w * scale, h * scale);
    });

    return <div {...props}>
        <canvas ref={canvasRef} css={[{
            imageRendering: "pixelated",
        }]}>
        </canvas>
    </div>;
}
