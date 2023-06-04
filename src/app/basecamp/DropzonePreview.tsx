import { useEffect, useRef } from "react";
import type { jsx } from "@emotion/react";
import { caForDropzone } from "../../model/sight";
import { Star } from "@emotion-icons/ionicons-solid/Star";
import { useRecoilState } from "recoil";
import { favoriteDropzonesRecoil } from "./favoriteDropzonesRecoil";
import { eqDropzone, Dropzone } from "../../model/terms/Dropzone";
import { getComposition } from "../../ca/calculateComposition";
import { createFullCanvasImageData32 } from "../../utils/createImageData32";


export const mapRockColor = "#444444";
export const mapGrassColor = "#000000";
export const mapEnergyColor = "#ff28e9";

export function DropzonePreview({
    dropzone,
    showDetails = false,
    additionalDetails,
    css: cssProp,
    ...props
}: {
    showDetails?: boolean,
    additionalDetails?: string,
    dropzone: Dropzone,
} & jsx.JSX.IntrinsicElements["div"]) {
    const world = dropzone.world;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [favoriteDropzones, setFavoriteDropzones] =
        useRecoilState(favoriteDropzonesRecoil);

    const isFavoriteDropzone = favoriteDropzones
        .some((el) => eqDropzone(dropzone, el));

    const composition = getComposition(dropzone.world.ca);

    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) { return; }

        const w = 200;
        const h = dropzone.width;
        const pixelsPerCell = 1;
        canvasEl.width = w * pixelsPerCell;
        canvasEl.height = h * pixelsPerCell;
        const {
            ctx,
            put,
            setPixel,
        } = createFullCanvasImageData32(canvasEl);

        const composition = getComposition(dropzone.world.ca);

        const [rock, grass, energy] = composition
            .map((p, i) => [p, i])
            .sort(([a], [b]) => b - a)
            .map(([_, i]) => i);
        const colorMap = [];
        colorMap[rock] = mapRockColor;
        colorMap[grass] = mapGrassColor;
        colorMap[energy] = mapEnergyColor;

        const theCa = caForDropzone(dropzone);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                setPixel(x, y, colorMap[theCa._at(x, y)]);
            }
        }

        const scale = 2;
        canvasEl.width *= scale;
        canvasEl.height *= scale;

        put();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            canvasEl, 
            0, 0, canvasEl.width / scale, canvasEl.height / scale, 
            0, 0, canvasEl.width, canvasEl.height);

    }, [canvasRef.current, dropzone]);

    const details = `${dropzone.v}`
        + `\nca: ${world.ca.rule}`
        + `\ndrain: ${world.stateEnergyDrain.join(" ")}`
        + ` / gain: ${world.stateEnergyGain.join(" ")}`
        + `\nseed: ${dropzone.seed}`
        + `\nstartFillState: ${dropzone.startFillState}`
        + `\nwidth: ${dropzone.width}`
        + (additionalDetails ? `\n${additionalDetails}` : "");

    return <div
        css={[{
            display: "flex",
            flexDirection: "row",
        }, cssProp]}
        title={details}
        {...props}
    >
        <div css={{ position: "relative" }}>
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
            <canvas ref={canvasRef} css={[{ imageRendering: "pixelated" }]} />
        </div>
        {showDetails && <div css={{
            fontSize: "0.8em",
            lineHeight: "1.25em",
            marginLeft: "0.7em",
            marginTop: "-0.2em",
            whiteSpace: "pre-line",
        }}>{details}</div>}
    </div>;
}
