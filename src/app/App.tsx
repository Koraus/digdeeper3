import "./initAnalytics";

import { Canvas } from "@react-three/fiber";
import { MainScene } from "./mainSscene/MainScene";
import { NoToneMapping } from "three";
import { appVersion } from "./appVersion";
import { player } from "./model/player";
import { Gui } from "./Gui";


window.addEventListener("keydown", ev => {
    switch (ev.code) {
        case "ArrowLeft": {
            player.move("left");
            break;
        }
        case "KeyA": {
            player.move("left");
            break;
        }
        case "ArrowRight": {
            player.move("right");
            break;
        }
        case "KeyD": {
            player.move("right");
            break;
        }
        case "ArrowUp": {
            player.move("up");
            break;
        }
        case "KeyW": {
            player.move("up");
            break;
        }
        case "ArrowDown": {
            player.move("down");
            break;
        }
        case "KeyS": {
            player.move("down");
            break;
        }
        case "KeyZ": {
            player.undo();
            break;
        }
        // case "KeyJ": {
        //     stage.gui.switchGamepadMode();
        //     break;
        // }
        case "KeyN": {
            if (confirm("Start new game? Current progress will be lost")) {
                location.href += "";
            }
            break;
        }
    }
});

export function App() {
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