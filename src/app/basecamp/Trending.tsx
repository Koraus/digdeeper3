import { jsx, keyframes } from "@emotion/react";
import { DropzonePreview } from "./DropzonePreview";
import { useSetDrop } from "./useSetDrop";
import { version } from "../../model/version";
import { Sparkles } from "@emotion-icons/ionicons-solid/Sparkles";
import { Reload } from "@emotion-icons/ionicons-solid/Reload";
import { Dice } from "@emotion-icons/ionicons-solid/Dice";
import { Hiking } from "@emotion-icons/fa-solid/Hiking";
import usePromise from "react-use-promise";
import { fetchLastTreks } from "../fetchLastTreks";
import _ from "lodash";
import { generateRandomDropzone } from "../../model/generate";
import { generateWorld } from "../../model/generate";
import { version as caVersion } from "../../ca";
import { caStateCount } from "../../model/terms/World";
import { LoaderCircle } from "@emotion-icons/boxicons-regular/LoaderCircle";
import { useTranslate } from "../languageRecoil";
import { useEffect, useState } from "react";
import { Dropzone } from "../../model/terms/Dropzone";
import { dropEquipmentRecoil } from "./dropEquipmentRecoil";
import { useRecoilValue } from "recoil";


export function Trending({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const equipment = useRecoilValue(dropEquipmentRecoil);
    const setDrop = useSetDrop();
    const [fetchCoutnt, setFetchCoutnt] = useState(0);
    const [dropzones, setDropzones] = useState<Dropzone[] | undefined>();
    const [fetchedData] = usePromise(async () => {
        const treks = await fetchLastTreks(1000);
        const rules = Object.entries(
            _.groupBy(treks, trek => trek.drop.zone.world.ca.rule))
            .sort((a, b) => b[1].length - a[1].length);
        const rullesFrequency = rules.map((r) => [r[0], r[1].length]);
        const dropzones = rules
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

        return { dropzones, rullesFrequency };
    }, [fetchCoutnt]);

    useEffect(() => setDropzones(fetchedData?.dropzones), [fetchedData]);

    const rullesFrequency = fetchedData?.rullesFrequency;

    const translate = useTranslate();

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
        <div css={{ overflow: "auto", height: "100%" }}>
            {dropzones && <>
                <button css={[{ margin: "0.9vmin 0" }]}
                    onClick={() => {
                        rullesFrequency &&
                            setDropzones(rullesFrequency.map(
                                (i) => {
                                    const rule = i[0].toString();
                                    return generateRandomDropzone({
                                        world: generateWorld({
                                            ca: {
                                                v: caVersion,
                                                rule,
                                                stateCount: caStateCount,
                                            },
                                        }),
                                    });
                                }));
                    }}>
                    <Dice css={{
                        height: "1em",
                        marginTop: "-0.2em",
                    }} />&nbsp;{translate("Reroll")}
                </button>
                <button css={[{ margin: "0.9vmin 0" }]}
                    onClick={() => { setFetchCoutnt(fetchCoutnt + 1); }}>
                    <Reload css={{
                        height: "1em",
                        marginTop: "-0.2em",
                    }} />
                    &nbsp;{translate("Reload")}
                </button>
            </>}
            <div css={[{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            }]}>
                {dropzones && dropzones.map((dropzone, i) =>
                    <div key={i} css={[{
                        position: "relative",
                        height: "fit-content",
                    }]}>
                        {rullesFrequency &&
                            `rule: ${rullesFrequency[i][0]} 
                        count :  ${rullesFrequency[i][1]}`}
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
                                equipment,
                            })}
                            css={[{
                                position: "absolute",
                                bottom: "10%",
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
