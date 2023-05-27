import { useRef } from "react";
import { useEffect } from "react";
import { caForDropzone } from "../../model/trek";
import { sightAt, startForTrek } from "../../model/sightAtTrek";
import { Color } from "three";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "./trekRecoil";
import { getComposition } from "../ca/calculateComposition";
import { jsx } from "@emotion/react";


export function СurrentWorldMap({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const trek = useRecoilValue(trekRecoil);
    useEffect(() => {

        const canvasEl = canvasRef.current;
        if (!canvasEl) { return; }

        const ctx = canvasEl.getContext("2d");
        if (!ctx) { return; }

        const dropzone = startForTrek(trek).dropzone;
        const sight = sightAt(trek);
        const pos = sight.playerPosition;
        const depth = sight.depth;

        //colors
        const composition = getComposition(dropzone.world.ca);
        const [stone, grass, energy] = composition
            .map((p, i) => [p, i])
            .sort(([a], [b]) => b - a)
            .map(([_, i]) => i);
        const colorMap = [];
        colorMap[stone] = new Color("#8d8d8d");
        colorMap[grass] = new Color("#000000");
        colorMap[energy] = new Color("#ff6ff5");
        const alphaMap = [];
        alphaMap[stone] = 0.8;
        alphaMap[grass] = 0.1;
        alphaMap[energy] = 0.5;

        const theCa = caForDropzone(dropzone);

        //map(canvas) size
        const w = 60;
        const h = dropzone.width;
        const myImageData = ctx.createImageData(w, h);
        const setColorAt = (
            wt: number,
            wx: number,
            color: ColorRepresentation,
            alpha = 1,
        ) => {
            const x = wt - depth;
            const y = wx;

            if (x < 0 || x >= w) { return; }
            if (y < 0 || y >= h) { return; }

            const i = ((y * w + x) * 4);
            const c = new Color(color);
            myImageData.data[i + 0] = Math.floor(c.r * 256);
            myImageData.data[i + 1] = Math.floor(c.g * 256);
            myImageData.data[i + 2] = Math.floor(c.b * 256);
            myImageData.data[i + 3] = Math.floor(alpha * 256);
        };

        for (let wt = depth; wt < depth + w; wt++) {
            for (let wx = 0; wx < h; wx++) {
                const state = theCa._at(wt, wx);
                setColorAt(wt, wx, colorMap[state], alphaMap[state]);
            }
        }

        for (const cell of sight.collectedCells) {
            const [wx, wt] = cell;
            const isEnergy = theCa._at(wt, wx) === energy;
            if (isEnergy) {
                setColorAt(wt, wx, colorMap[energy], 0.05);
            }
        }

        for (const cell of sight.visitedCells) {
            const [wx, wt] = cell;
            setColorAt(wt, wx, "rgb(255, 100, 0)", 0.2);
        }

        // player on map
        const [px, pt] = pos;
        setColorAt(pt, px, "rgb(255, 255, 255)");

        const scale = 1;
        canvasEl.width = w * scale;
        canvasEl.height = h * scale;

        ctx.putImageData(myImageData, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvasEl, 0, 0, w, h, 0, 0, w * scale, h * scale);
    }, [canvasRef.current, trek]);

    return <div css={[{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
        inset: 0,
        transitionDuration: "0.2s",
        overflowX: "hidden",
        position: "absolute",
    }, cssProp]}
        {...props}
    >
        <div css={[{
            textAlign: "center",
        }]}> MAP </div>
        <canvas ref={canvasRef} css={[{
            imageRendering: "pixelated",
            height: "60%",
        }]}>
        </canvas>
    </ div>;
}