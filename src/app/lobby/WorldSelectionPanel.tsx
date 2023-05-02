import { useState } from "react";
import type { jsx } from "@emotion/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { progressionRecoil } from "../progressionRecoil";
import { LehmerPrng } from "../../utils/LehmerPrng";
import { modelId } from "../../model/terms";
import { WorldPreview } from "./WorldPreview";
import { FavoritesWorlds } from "./FavoritesWorlds";
import { historicalWorldsRecoil } from "./historicalWorldsRecoil";
import { Problem } from "../../model/terms";
import { HistoricalWorlds } from "./HistoricalWorlds";
import { Dice } from "@emotion-icons/fa-solid/Dice";
import { eqProblem } from "../../model/terms";


export function WorldSelectionPanel({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    const setProgression = useSetRecoilState(progressionRecoil);
    const [isWorldSelection, setIsWorldSelection] = useState(false);
    const [historicalWorlds, setHistoricalWorlds] =
        useRecoilState(historicalWorldsRecoil);

    const stateCount = 3;
    const [ruleTables, setRuleTables] = useState<number[][]>();

    const setWorld = (problem: Problem) => {
        setHistoricalWorlds([
            problem,
            ...historicalWorlds
                .filter(p => !eqProblem(p, problem)),
        ]);
        setProgression({ problem });
    };

    return <div
        css={[{
            background: "#000000b0",
            border: "1px solid #ffffffb0",
        }, cssProp]}
        {...props}
    >
        <div css={[{
            transitionDuration: "0.4s",
            height: isWorldSelection ? "fit-content" : "3vmin",
            overflow: "hidden",
        }]} >
            <h3 css={[{
                margin: "0.9vmin 0",
            }]}
                onClick={() => setIsWorldSelection(!isWorldSelection)}
            > <Dice css={[{
                width: "2vmin",
                marginRight: "0.4vmin",
            }]} />Generate: <span css={[{
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

                            onClick={() => setWorld({
                                modelId,
                                caStateCount: stateCount,
                                table: ruleTable,
                                seed: Math.floor(
                                    Math.random()
                                    * LehmerPrng.MAX_INT32),
                                stateEnergyDrain: [81 * 9, 1, 0],
                                stateEnergyGain: [0, 0, 81],
                                emptyState: 1,
                                spaceSize: 31,
                                depthLeftBehind: 10,
                            })}
                        > Play!</button >
                    </div>)}
                </div>
            }
        </div>
        <FavoritesWorlds />
        <HistoricalWorlds />
    </div >;
}
