import { useRef } from "react";
import { useEffect } from "react";
import { caForDropzone } from "../model/sight";
import { sightAt, startForTrek } from "../model/sightChain";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "./trekRecoil";
import { epxandedSight } from "./mainSscene/cells/CellsView";
import { createImageData32 } from "../utils/createImageData32";
import { jsx } from "@emotion/react";

export function OverlayMap({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["canvas"]) {
    const trek = useRecoilValue(trekRecoil);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) { return; }

        const dropzone = startForTrek(trek).zone;
        const w = 150;
        const h = dropzone.width;
        const pixelsPerCell = 5;
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

        const drawVisisted = (
            wt: number,
            wx: number,
        ) => {
            let x = wt - depth;
            let y = wx;

            if (x < 0 || x >= w) { return; }
            if (y < 0 || y >= h) { return; }

            x *= pixelsPerCell;
            y *= pixelsPerCell;

            const color = "#ffffffa0";

            setPixel(x + 2, y + 2, color);
            setPixel(x + 2, y + 0, color);
            setPixel(x + 2, y + 4, color);
            setPixel(x + 0, y + 2, color);
            setPixel(x + 4, y + 2, color);
        };

        const drawEnergy = (wt: number, wx: number) => {
            const x = (wt - depth) * pixelsPerCell;
            const y = wx * pixelsPerCell;

            const color = "#ffffff";

            setPixel(x + 1, y + 2, color);
            setPixel(x + 1, y + 3, color);
            setPixel(x + 2, y + 1, color);
            setPixel(x + 2, y + 3, color);
            setPixel(x + 3, y + 1, color);
            setPixel(x + 3, y + 2, color);
        };

        const drawRock = (wt: number, wx: number) => {
            const x = (wt - depth) * pixelsPerCell;
            const y = wx * pixelsPerCell;

            const strokeColor = "#000000";

            // fill
            for (let dx = 0; dx < pixelsPerCell; dx++) {
                for (let dy = 0; dy < pixelsPerCell; dy++) {
                    setPixel(
                        x + dx,
                        y + dy,
                        dx === dy ? strokeColor : "#00000020");
                }
            }

            // draw borders
            if (wx <= 0 || theCa._at(wt, wx - 1) !== rock) {
                for (let dx = 0; dx < pixelsPerCell; dx++) {
                    setPixel(x + dx, y, strokeColor);
                }
            }
            if (wx >= h - 1 || theCa._at(wt, wx + 1) !== rock) {
                for (let dx = 0; dx < pixelsPerCell; dx++) {
                    setPixel(x + dx, y + pixelsPerCell - 1, strokeColor);
                }
            }
            if (wt <= depth || theCa._at(wt - 1, wx) !== rock) {
                for (let dy = 0; dy < pixelsPerCell; dy++) {
                    setPixel(x, y + dy, strokeColor);
                }
            }
            if (wt >= depth + w - 1 || theCa._at(wt + 1, wx) !== rock) {
                for (let dy = 0; dy < pixelsPerCell; dy++) {
                    setPixel(x + pixelsPerCell - 1, y + dy, strokeColor);
                }
            }
        };

        const drawPlayer = (wt: number, wx: number) => {
            const playerColor = "#ffffff";

            let x = wt - depth;
            let y = wx;

            x *= pixelsPerCell;
            y *= pixelsPerCell;

            setPixel(x + 0, y + 1, playerColor);
            setPixel(x + 0, y + 2, playerColor);
            setPixel(x + 0, y + 3, playerColor);
            setPixel(x + 1, y + 0, playerColor);
            setPixel(x + 1, y + 1, playerColor);
            setPixel(x + 1, y + 2, playerColor);
            setPixel(x + 1, y + 3, playerColor);
            setPixel(x + 1, y + 4, playerColor);
            setPixel(x + 2, y + 0, playerColor);
            setPixel(x + 2, y + 1, playerColor);
            setPixel(x + 2, y + 2, playerColor);
            setPixel(x + 2, y + 3, playerColor);
            setPixel(x + 2, y + 4, playerColor);
            setPixel(x + 3, y + 0, playerColor);
            setPixel(x + 3, y + 1, playerColor);
            setPixel(x + 3, y + 2, playerColor);
            setPixel(x + 3, y + 3, playerColor);
            setPixel(x + 3, y + 4, playerColor);
            setPixel(x + 4, y + 1, playerColor);
            setPixel(x + 4, y + 2, playerColor);
            setPixel(x + 4, y + 3, playerColor);
        };


        for (let wt = depth; wt < depth + w; wt++) {
            for (let wx = 0; wx < h; wx++) {
                const state = theCa._at(wt, wx);
                if (state === energy) {
                    const isCollected = collectedCells[wt]?.[wx];
                    if (!isCollected) {
                        drawEnergy(wt, wx);
                    }
                } else if (state === rock) {
                    drawRock(wt, wx);
                }
                const isVisited = visitedCells[wt]?.[wx];
                const isPlayer = pos[0] === wx && pos[1] === wt;
                if (isPlayer) {
                    drawPlayer(wt, wx);
                } else {
                    if (isVisited) {
                        drawVisisted(wt, wx);
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
        }, cssProp]}
        {...props}
    />;
}