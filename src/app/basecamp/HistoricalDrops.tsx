import type { jsx } from "@emotion/react";
import { useRecoilValue } from "recoil";
import { DropzonePreview } from "./DropzonePreview";
import { historicalDropsRecoil } from "./historicalDropsRecoil";
import { useSetDrop } from "./useSetDrop";
import { Sparkles } from "@emotion-icons/ionicons-solid/Sparkles";
import { Hiking } from "@emotion-icons/fa-solid/Hiking";


export function HistoricalDrops({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const historicalWorlds = useRecoilValue(historicalDropsRecoil);
    const setDrop = useSetDrop();

    return <div {...props}>
        {historicalWorlds.length === 0 && <>
            <Sparkles css={{ height: "8em", margin: "2em" }} />
        </>}
        <div css={{ display: "flex", height: "100%" }}>
            <div css={[{
                listStyle: "none",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                overflow: "auto",
            }]}>
                {historicalWorlds
                    .slice(0, 10)
                    .map((drop, i) => <div
                        key={i}
                        css={[{
                            position: "relative",
                        }]}>
                        <DropzonePreview
                            css={[{
                                margin: "0.1vmin",
                            }]}
                            dropzone={drop.zone} />
                        <button
                            css={[{
                                position: "absolute",
                                bottom: "1vmin",
                                left: "50%",
                                transform: "translateX(-50%)",
                            }]}
                            onClick={() => setDrop(drop)}
                        >  <Hiking css={{
                            height: "1em",
                            marginTop: "-0.2em",
                        }} />
                            &nbsp;Go!</button>
                    </div>)}
            </div>
        </div>
    </div>;
}
