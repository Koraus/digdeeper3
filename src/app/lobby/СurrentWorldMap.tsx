import { useRef } from "react";
import { useEffect } from "react";
import { caForDropzone } from "../../model/trek";
import { sightAt, startForTrek } from "../../model/sightAtTrek";
import { Color } from "three";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { getComposition } from "../../ca/calculateComposition";
import { jsx } from "@emotion/react";


export function СurrentWorldMap({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const trek = useRecoilValue(trekRecoil);
    const dropzone = startForTrek(trek).dropzone;
    const sight = sightAt(trek);
    const pos = sight.playerPosition;

    useEffect(() => {

        const canvasEl = canvasRef.current;
        if (!canvasEl) { return; }

        const ctx = canvasEl.getContext("2d");
        if (!ctx) { return; }

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


        const theCa = caForDropzone(dropzone);

        //map(canvas) size
        const w = 60;
        const h = dropzone.width;
        //player position
        const px = pos[0];
        const pt = pos[1];


        const myImageData = ctx.createImageData(w, h);
        //painting the canvas
        for (let x = 0; x < w; x++) { // row

            for (let y = 0; y < h; y++) { // line

                const i = ((y * w + x) * 4);

                //color for canvas pixel
                const color = colorMap[theCa._at(x, y)];

                myImageData.data[i + 0] = Math.floor(color.r * 256);
                myImageData.data[i + 1] = Math.floor(color.g * 256);
                myImageData.data[i + 2] = Math.floor(color.b * 256);
                myImageData.data[i + 3] = theCa._at(x, y) === energy ? 99 : 255;

                // painting collectedCells 
                sight.collectedCells.map(v => {
                    if (v[1] === x && v[0] === y) {
                        myImageData.data[i + 0] = 255;
                        myImageData.data[i + 1] = 100;
                        myImageData.data[i + 2] = 0;
                        myImageData.data[i + 3] = 255;
                    }
                });
            }
        }

        // player on map
        const pPos = (px * w * 4) + pt * 4;
        myImageData.data[pPos + 0] = 215;
        myImageData.data[pPos + 1] = 53;
        myImageData.data[pPos + 2] = 53;
        myImageData.data[pPos + 3] = 255;

        const scale = 1;
        canvasEl.width = w * scale;
        canvasEl.height = h * scale;

        ctx.putImageData(myImageData, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvasEl, 0, 0, w, h, 0, 0, w * scale, h * scale);
    }, [canvasRef.current, dropzone, pos]);

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