import { useState } from "react";
import type { jsx } from "@emotion/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { progressionRecoil } from "../progressionRecoil";
import { LehmerPrng } from "../../utils/LehmerPrng";
import { modelId } from "../../model/terms";
import { WorldPreview } from "./WorldPreview";
import { historicalWorldsRecoil } from "./historicalWorldsRecoil";
import { Problem } from "../../model/terms"


export function WorldSelectionPanel({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const setProgression = useSetRecoilState(progressionRecoil);
    const [isWorldSelection, setIsWorldSelection] = useState(false);

    const [historicalWorlds, setHistoricalWorlds] =
        useRecoilState(historicalWorldsRecoil);

    const tempPlayedWorlds = localStorage.getItem("historicalWorldsRecoil");
    const playedWorlds =
        tempPlayedWorlds ? JSON.parse(tempPlayedWorlds) : undefined;

    const stateCount = 3;
    const [ruleTables, setRuleTables] = useState<number[][]>();

    return <div
        css={[{
            background: "#000000b0",
            border: "1px solid #ffffffb0",
        }]}
        {...props}
    >
        <div css={[{
            transitionDuration: "0.4s",
            height: isWorldSelection ? "fit-content" : "3vmin",
            overflow: "hidden",
        }]}
        >
            <h3 css={[{
                margin: "0.9vmin 0",
            }]}
                onClick={() => setIsWorldSelection(!isWorldSelection)}
            >World Selection: <span css={[{
                display: "inline-block",
                rotate: isWorldSelection ? "0deg" : "180deg",
            }]} > ^ </span> </h3>
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

                            onClick={
                                () => {
                                    const problem: Problem =
                                    {
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
                                    };

                                    setHistoricalWorlds(
                                        [problem, ...historicalWorlds],
                                    );
                                    setProgression({ problem });
                                }
                            }
                        > Play!</button >
                    </div>)}
                </div>
            }
        </div>
        <h3 css={[{
            margin: "0.9vmin 0",
        }]}>Previously played worlds:</h3>

        {playedWorlds
            && <div css={[{
                listStyle: "none",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            }]}>
                {playedWorlds.map((i: Problem, key: number) => <div
                    key={key + "playedWorlds"} css={[{
                        position: "relative",
                    }]}>
                    <WorldPreview
                        css={[{
                            margin: "0.1vmin",
                        }]}
                        stateCount={stateCount}
                        table={i.table}
                        spaceSize={i.spaceSize}
                        emptyState={i.emptyState}
                        seed={i.seed}
                    />
                    <button
                        css={[{
                            position: "absolute",
                            bottom: "1vmin",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }]}
                        onClick={() => setProgression({ problem: i })}
                    > Play!</button >
                </div>)}
            </div>
        }
    </div >;
}
