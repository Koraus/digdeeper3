import { jsx, keyframes } from "@emotion/react";
import { DropzonePreview } from "./DropzonePreview";
import { useSetDrop } from "./useSetDrop";
import { version } from "../../model/version";
import { Sparkles } from "@emotion-icons/ionicons-solid/Sparkles";
import { Hiking } from "@emotion-icons/fa-solid/Hiking";
import usePromise from "react-use-promise";
import { fetchLastTreks } from "../fetchLastTreks";
import _ from "lodash";
import { generateRandomDropzone } from "../../model/generate";
import { generateWorld } from "../../model/generate";
import { version as caVersion } from "../../ca";
import { caStateCount } from "../../model/terms/World";
import { LoaderCircle } from "@emotion-icons/boxicons-regular/LoaderCircle";


export function Trending({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const setDrop = useSetDrop();
    const [dropzones] = usePromise(async () => {
        const treks = await fetchLastTreks(1000);
        return Object.entries(
            _.groupBy(treks, trek => trek.drop.zone.world.ca.rule))
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 10)
            .map(([rule]) => generateRandomDropzone({
                world: generateWorld({
                    ca: {
                        v: caVersion,
                        rule,
                        stateCount: caStateCount,
                    },
                }),
            }));
    }, []);
    // trending назва 
    // скрол
    //
    // todo reroll button
    // todo reload button
    // todo display popularity (treks count)

    return <div  {...props}>
        {!dropzones && <div css={{
            animation: `${keyframes`
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
            `} 2s linear infinite`,
        }}>
            <LoaderCircle css={{ height: "8em", margin: "2em" }} />
        </div>}
        {dropzones && dropzones.length === 0 && <>
            <Sparkles css={{ height: "8em", margin: "2em" }} />
        </>}
        <div css={{ display: "flex", height: "100%" }}>
            <div css={[{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                overflow: "auto",
            }]}>
                {dropzones && dropzones.map((dropzone, i) =>
                    <div key={i} css={[{
                        position: "relative",
                    }]}>
                        <DropzonePreview
                            css={[{
                                margin: "0.1vmin",
                            }]}
                            dropzone={dropzone} />
                        <button
                            onClick={() => setDrop({
                                v: version,
                                zone: dropzone,
                                depthLeftBehind: 10,
                                equipment: {
                                    pickNeighborhoodIndex: 0,
                                },
                            })}
                            css={[{
                                position: "absolute",
                                bottom: "1vmin",
                                left: "50%",
                                transform: "translateX(-50%)",
                            }]}
                        >  <Hiking css={{
                            height: "1em",
                            marginTop: "-0.2em",
                        }} />
                            &nbsp;Go!</button>
                    </div>)}
            </div>
        </div>
    </div >;
}
