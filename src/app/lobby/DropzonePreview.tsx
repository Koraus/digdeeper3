import { useEffect, useRef } from "react";
import type { jsx } from "@emotion/react";
import { Dropzone, caForDropzone } from "../../model/terms";
import { Star } from "@emotion-icons/ionicons-solid/Star";
import { useRecoilState } from "recoil";
import { favoriteDropzonesRecoil } from "./favoriteDropzonesRecoil";
import { eqDropzone } from "../../model/terms";


export function DropzonePreview({
    dropzone, ...props
}: {
    dropzone: Dropzone,
} & jsx.JSX.IntrinsicElements["div"]) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let isFavoriteDropzone = false;
    const [favoriteDropzones, setFavoriteDropzones] =
        useRecoilState(favoriteDropzonesRecoil);

    if (favoriteDropzones
        .some((el) => eqDropzone(dropzone, el))) {
        isFavoriteDropzone = true;
    }

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

    return <div {...props} css={[{
        position: "relative",
    }]} >
        <div
            css={[{
                position: "absolute",
                top: "0.8vmin",
                right: "0.8vmin",
                borderRadius: "4px",
                backgroundColor: "#A8E7D8",
                padding: "0.2vmin",
            }]}
        >
            <Star
                onClick={() => {
                    if (favoriteDropzones.some(p => eqDropzone(p, dropzone))) {
                        setFavoriteDropzones([...favoriteDropzones.
                            filter(p => !eqDropzone(p, dropzone))]);
                    } else setFavoriteDropzones(
                        [dropzone, ...favoriteDropzones]);
                }}
                color={isFavoriteDropzone ? "#D84949" : "#444444"}
                size={"2.1vmin"}
            />
        </div>
        <canvas ref={canvasRef} css={[{
            imageRendering: "pixelated",
        }]}>
        </canvas>
    </div>;
}
