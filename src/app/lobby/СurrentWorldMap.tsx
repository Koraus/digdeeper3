import { useRef, useState } from "react";
import { useEffect } from "react";
import { caForDropzone, sightAt, startForTrek } from "../../model/terms";
import { Color } from "three";
import { useRecoilValue } from "recoil";
import { trekRecoil } from "../trekRecoil";

export function СurrentWorldMap() {

    const [isMapShown, setIsMapShown] = useState(false);

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

        const colorMap = [
            new Color("#8d8d8d"),
            new Color("#000000"),
            new Color("#ff6ff5"),
        ];

        const theCa = caForDropzone(dropzone);

        const w = 30; // pt * 4
        const h = 30;



        const px = pos[0]; // UP/DOWN
        const pt = pos[1]; 
        const pPos = (pt + px * w) * 4;

        const cell1 = [0, 1 , 2, 3]; 

        const myImageData = ctx.createImageData(w, h);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const color = colorMap[theCa._at(x, y)];
                myImageData.data[i + 0] = Math.floor(color.r * 256);
                myImageData.data[i + 1] = Math.floor(color.g * 256);
                myImageData.data[i + 2] = Math.floor(color.b * 256);
                myImageData.data[i + 3] = 255;
            }
        }
        // const [px, pt] = pos;


        // px i pt - абсолютні координати в світі 
        console.log(pt * 4 )
        // console.log("arr " + myImageData.data);
        // віднсоні координати на зображенні
        const p = (pt * 4) + px *4 ;
        myImageData.data[p  + 0] = 256;
        myImageData.data[p + 1] = 100;
        myImageData.data[p + 2] = 100;
        myImageData.data[p + 3] = 255;


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
        background: "rgba(0, 0, 143, 0.8)",
        pointerEvents: isMapShown ? "all" : "none",
        opacity: isMapShown ? 1 : 0,
    }}
    >
        <div css={[{
            textAlign: "center"
        }]}> MAP </div>
        <canvas ref={canvasRef} css={[{
            imageRendering: "pixelated",
            // width: "90%",
            height: "80%"
        }]}>
        </canvas>
    </ div>;
}