import { useEffect, useRef } from "react";
import type { jsx } from "@emotion/react";
import { Dropzone, caForDropzone } from "../../model/terms";


export function WorldPreview({
    dropzone, ...props
}: {
    dropzone: Dropzone,
} & jsx.JSX.IntrinsicElements["div"]) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        const theCa = caForDropzone(dropzone);

        const w = dropzone.width;
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
