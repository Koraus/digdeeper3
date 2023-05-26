import { useRef, useState } from "react";
import { useEffect } from "react";
import { caForDropzone, sightAt, startForTrek } from "../../model/terms";
import { Color } from "three";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";
import { getComposition } from "../../ca/calculateComposition";

export function СurrentWorldMap() {

    const [isMapShown, setIsMapShown] = useState(true);

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

        const w = 51;
        const h = dropzone.width;

        const px = pos[0];
        const pt = pos[1];

        const pPos = (px * w * 4) + pt * 4;

        const myImageData = ctx.createImageData(w, h);

        // старт карти має бути з нуля, 
        // при досягненні точки неповернення > 0, має стартувати з неї

        const mapStart = sight.depth > 0 ? sight.depth : 0;
        // const mapY = 

        console.log(mapStart);

        // які з комірок візуалізувати на краті рядок/ствпчик
        // віхуалізувати всі рядки, до яких можна повернутися 

        for (let y = 0; y < h; y++) {
            for (let x = mapStart; x < w ; x++) {
                const i = (y * w + x) * 4;
                const color = colorMap[theCa._at(x, y)];
                myImageData.data[i + 0] = Math.floor(color.r * 256);
                myImageData.data[i + 1] = Math.floor(color.g * 256);
                myImageData.data[i + 2] = Math.floor(color.b * 256);
                myImageData.data[i + 3] = theCa._at(x, y) === energy ? 99 : 255;
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

    return <div css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
        inset: 0,
        transitionDuration: "0.2s",
        overflowX: "hidden",
        position: "absolute",
        pointerEvents: isMapShown ? "all" : "none",
        opacity: isMapShown ? 1 : 0,
    }}
    >
        <div css={[{
            textAlign: "center",
        }]}> MAP </div>
        <canvas ref={canvasRef} css={[{
            imageRendering: "pixelated",
            // width: "90%",
            height: "60%",
        }]}>
        </canvas>
    </ div>;
}