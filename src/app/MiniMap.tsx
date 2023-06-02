import { useRef } from "react";
import { useEffect } from "react";
import { caForDropzone } from "../model/sight";
import { useRecoilValue } from "recoil";
import { sightAt, startForTrek, trekRecoil } from "./trekRecoil";
import { epxandedSight } from "./mainSscene/cells/CellsView";
import { createImageData32 } from "../utils/createImageData32";
import { mapEnergyColor, mapGrassColor, mapRockColor } from "./basecamp/DropzonePreview";
import { jsx } from "@emotion/react";

export function MiniMap({
    ...props
}: jsx.JSX.IntrinsicElements["canvas"]) {
    const trek = useRecoilValue(trekRecoil);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) { return; }

        const dropzone = startForTrek(trek).zone;
        const w = 200;
        const h = dropzone.width;
        const pixelsPerCell = 2;
        canvasEl.width = w * pixelsPerCell;
        canvasEl.height = h * pixelsPerCell;
        const {
            put,
            setPixel,
        } = createImageData32(canvasEl);


        const sight = sightAt(trek);
        const pos = sight.playerPosition;
        const depth = sight.depth;
        const {
            visualStateMap: { rock, energy },
            collectedCells,
            visitedCells,
        } = epxandedSight(trek);

        const theCa = caForDropzone(dropzone);

        const fillCell = (
            wt: number,
            wx: number,
            color: string,
        ) => {
            const x = wt - depth;
            const y = wx;

            if (x < 0 || x >= w) { return; }
            if (y < 0 || y >= h) { return; }

            for (let dx = 0; dx < pixelsPerCell; dx++) {
                for (let dy = 0; dy < pixelsPerCell; dy++) {
                    setPixel(
                        x * pixelsPerCell + dx,
                        y * pixelsPerCell + dy,
                        color);
                }
            }
        };


        for (let wt = depth; wt < depth + w; wt++) {
            for (let wx = 0; wx < h; wx++) {
                fillCell(wt, wx, "#000000"); // clear
                const state = theCa._at(wt, wx);
                if (state === energy) {
                    const isCollected = collectedCells[wt]?.[wx];
                    if (!isCollected) {
                        fillCell(wt, wx, mapEnergyColor);
                    }
                } else if (state === rock) {
                    fillCell(wt, wx, mapRockColor);
                } else {
                    fillCell(wt, wx, mapGrassColor);
                }
                const isVisited = visitedCells[wt]?.[wx];
                const isPlayer = pos[0] === wx && pos[1] === wt;
                if (isPlayer) {
                    fillCell(wt, wx, "#ffffff");
                } else {
                    if (isVisited) {
                        fillCell(wt, wx, "#f8a974");
                    }
                }
            }
        }

        put();
    }, [canvasRef.current, trek]);

    return <canvas
        ref={canvasRef}
        css={[{
            imageRendering: "pixelated",
            height: "100%",
        }]}
        {...props}
    />;
}