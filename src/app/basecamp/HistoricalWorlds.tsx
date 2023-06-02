import type { jsx } from "@emotion/react";
import { useRecoilValue } from "recoil";
import { DropzonePreview } from "./DropzonePreview";
import { historicalWorldsRecoil } from "./historicalWorldsRecoil";
import { useSetDrop } from "./useSetDrop";
import { version } from "../../model/version";
import { Sparkles } from "@emotion-icons/ionicons-solid/Sparkles";


export function HistoricalWorlds({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const historicalWorlds = useRecoilValue(historicalWorldsRecoil);
    const setDrop = useSetDrop();

    return <div {...props}>
        {historicalWorlds.length === 0 && <>
            <Sparkles css={{ height: "8em", margin: "2em" }} />
        </>}
        <div css={[{
            listStyle: "none",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
        }]}>
            {historicalWorlds
                .slice(0, 10)
                .map((p, i) => <div
                    key={i}
                    css={[{
                        position: "relative",
                    }]}>
                    <DropzonePreview
                        css={[{
                            margin: "0.1vmin",
                        }]}
                        dropzone={p} />
                    <button
                        css={[{
                            position: "absolute",
                            bottom: "1vmin",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }]}
                        onClick={() => setDrop({
                            v: version,
                            zone: p,
                            depthLeftBehind: 10,
                            equipment: {
                                pickNeighborhoodIndex: 0,
                            },
                        })}
                    > Play!</button>
                </div>)}
        </div>
    </div>;
}
