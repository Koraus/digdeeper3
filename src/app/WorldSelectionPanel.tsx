import { useState } from "react";
import type { jsx } from "@emotion/react";
import { useSetRecoilState } from "recoil";
import { progressionRecoil } from "./progressionRecoil";
import { LehmerPrng } from "../utils/LehmerPrng";
import { modelId } from "../model/terms";
import { WorldPreview } from "./WorldPreview";



export function WorldSelectionPanel({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const setProgression = useSetRecoilState(progressionRecoil);
    const stateCount = 3;
    const [ruleTables, setRuleTables] = useState<number[][]>();
    return <div
        css={[{
            background: "#000000b0",
            border: "1px solid #ffffffb0",
        }]}
        {...props}
    >
        <h3 css={[{
            margin: "0.9vmin 0",
        }]}>World Selection:</h3>
        <button
            css={[{
                margin: "0.9vmin 0",
            }]}
            onClick={() =>
                setRuleTables(
                    Array.from(
                        { length: 20 },
                        () => Array.from(
                            { length: stateCount ** 4 },
                            () => Math.floor(Math.random() * stateCount))))
            }> Reroll </button>
        {ruleTables
            && <div css={[{
                listStyle: "none",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            }]}>
                {ruleTables.map((ruleTable, i) => <div key={i} css={[{
                    position: "relative",
                }]}>
                    <WorldPreview
                        css={[{
                            margin: "0.1vmin",
                        }]}
                        stateCount={stateCount}
                        table={ruleTable}
                        spaceSize={31}
                        emptyState={1}
                        seed={4242}
                    />
                    <button
                        css={[{
                            position: "absolute",
                            bottom: "1vmin",
                            left: "50%",
                            transform: "translateX(-50%)",

                        }]}
                        onClick={() => setProgression({
                            problem: {
                                modelId,
                                caStateCount: stateCount,
                                table: ruleTable,
                                seed: Math.floor(
                                    Math.random() * LehmerPrng.MAX_INT32),
                                stateEnergyDrain: [81 * 9, 1, 0],
                                stateEnergyGain: [0, 0, 81],
                                emptyState: 1,
                                spaceSize: 31,
                                depthLeftBehind: 10,
                            },
                        })}
                    > Play!</button >
                </div>)}
            </div>
        }
    </div >;
}
