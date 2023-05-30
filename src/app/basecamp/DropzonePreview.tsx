import { useEffect, useRef } from "react";
import type { jsx } from "@emotion/react";
import { caForDropzone } from "../../model/sight";
import { Star } from "@emotion-icons/ionicons-solid/Star";
import { useRecoilState } from "recoil";
import { favoriteDropzonesRecoil } from "./favoriteDropzonesRecoil";
import { eqDropzone, Dropzone } from "../../model/terms/Dropzone";
import { Color } from "three";
import { getComposition } from "../../ca/calculateComposition";


export const colorMap = [
    "#8d8d8d",
    "#000000",
    "#ff6ff5",
];

export function DropzonePreview({
    dropzone, ...props
}: {
    dropzone: Dropzone,
} & jsx.JSX.IntrinsicElements["div"]) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [favoriteDropzones, setFavoriteDropzones] =
        useRecoilState(favoriteDropzonesRecoil);

    const isFavoriteDropzone = favoriteDropzones
        .some((el) => eqDropzone(dropzone, el));

    const composition = getComposition(dropzone.world.ca);

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

        const w = 200;
        const h = dropzone.width;

        const _colorMap = colorMap.map(c => new Color(c));

        const myImageData = ctx.createImageData(w, h);
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const color = _colorMap[theCa._at(x, y)];
                myImageData.data[i + 0] = Math.floor(color.r * 256);
                myImageData.data[i + 1] = Math.floor(color.g * 256);
                myImageData.data[i + 2] = Math.floor(color.b * 256);
                myImageData.data[i + 3] = 255;
            }
        }
        const scale = 2;
        canvasEl.width = w * scale;
        canvasEl.height = h * scale;

        ctx.putImageData(myImageData, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvasEl, 0, 0, w, h, 0, 0, w * scale, h * scale);
    }, [canvasRef.current, dropzone]);

    return <div {...props} css={[{ position: "relative" }]}>
        <div
            css={[{
                position: "absolute",
                top: "0.1vmin",
                left: "0.2vmin",
                borderRadius: "4px",
                backgroundColor: "#8b4899",
                padding: "0.15vmin",
            }]}
        >{composition.map((v, i) => {
            return <span key={i}> {i} - {(v * 100).toPrecision(2)}%
                {i + 1 < composition.length && ","} </span>;
        })}
        </div>
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
                    if (isFavoriteDropzone) {
                        // remove from favorites
                        setFavoriteDropzones([
                            ...favoriteDropzones.
                                filter(p => !eqDropzone(p, dropzone)),
                        ]);
                    } else {
                        // add to favorites
                        setFavoriteDropzones([
                            dropzone,
                            ...favoriteDropzones,
                        ]);
                    }
                }}
                color={isFavoriteDropzone ? "#D84949" : "#444444"}
                css={[{ width: "2.1vmin" }]}
            />
        </div>
        <canvas ref={canvasRef} css={[{
            imageRendering: "pixelated",
        }]}>
        </canvas>
    </div>;
}
