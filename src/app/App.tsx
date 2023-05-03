import "./initAnalytics";

import { Canvas } from "@react-three/fiber";
import { MainScene } from "./mainSscene/MainScene";
import { NoToneMapping } from "three";
import { appVersion } from "./appVersion";
import { Gui } from "./Gui";
import { WorldSelectionPanel } from "./lobby/WorldSelectionPanel";
import { useState } from "react";


export function App() {
    const [worldSelectionPanel, setIsWorldSelectionPanel] = useState(false);
    return <div
        css={{
            display: "flex",
            position: "fixed",
            inset: "0",
            overflow: "auto",
            fontFamily: "monospace",
        }}
    >
        <Canvas
            css={{ position: "absolute", inset: 0, zIndex: -1 }}
            gl={{
                useLegacyLights: false,
                toneMapping: NoToneMapping,
                antialias: true,
            }}
        >
            <MainScene />
        </Canvas>
        <div css={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            display: "flex",
            flex: "row",
        }}>
            <WorldSelectionPanel css={{
                pointerEvents: "all",
                transitionDuration: "0.2s",
                overflowX: "hidden",
                flex: worldSelectionPanel
                    ? "0 0 100vmin"
                    : "0 0 0vmin",
                padding: worldSelectionPanel ? "5px 5px" : 0,
            }} />
            <button // toggle 
                css={{
                    padding: 0,
                    pointerEvents: "all",
                }}
                onClick={() =>
                    setIsWorldSelectionPanel(!worldSelectionPanel)}
            >
                <span css={{
                    display: "inline-block",
                    transitionDuration: "0.2s",
                    transform: worldSelectionPanel
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                }}>&gt;</span>
                <br /><span css={{ textDecoration: "underline" }}></span>
            </button>
            <div css={{
                flex: "1 1 0",
                position: "relative",
                margin: "1.5vmin",
            }}>
                <div>
                    <Gui />
                </div>
                <div css={{ // appVersion panel
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    textAlign: "right",
                    fontSize: "1.4vmin",
                    lineHeight: "90%",
                }}>
                    {appVersion.split("+")[0]}<br />
                    <span css={{ fontSize: "0.8em" }}>
                        {appVersion.split("+")[1]}
                    </span>
                </div>
            </div>
        </div>

    </div>;
}