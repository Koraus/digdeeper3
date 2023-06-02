import "./initAnalytics";

import { Canvas } from "@react-three/fiber";
import { MainScene } from "./mainSscene/MainScene";
import { NoToneMapping } from "three";
import { appVersion } from "./appVersion";
import { Gui } from "./Gui";
import { WorldSelectionPanel } from "./basecamp/BasecampPanel";
import { useRef, useState } from "react";
import { useGrabFocusFromBody } from "../utils/reactish/useGrabFocusFromBody";
import { Menu as MenuIcon } from "@emotion-icons/boxicons-regular/Menu";
import { X as XIcon } from "@emotion-icons/boxicons-regular/X";
import { OverlayMap } from "./OverlayMap";
import { MiniMap } from "./MiniMap";
import { InformationCircle } from "@emotion-icons/ionicons-solid/InformationCircle";
import { Tutorial } from "./Tutorial";


export function App() {
    const [isBasecampShown, setIsBasecampShown] = useState(false);
    const [mapShowState, setMapShowState] = useState(0);
    const isMapShown = mapShowState > 0;
    const isMapBackShown = mapShowState === 2;
    const focusRootRef = useRef<HTMLDivElement>(null);
    useGrabFocusFromBody(focusRootRef);

    const [isTutorial, setIsTutorial] = useState(false);

    // const isFirstGame =  " condition for the first demonstration "
    // if (isFirstGame) { setIsTutorial(true); }

    const keyCodes = ["KeyW", "KeyS", "KeyD", "KeyA", "KeyZ",
        "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    return <div
        css={{
            display: "flex",
            position: "fixed",
            inset: "0",
            overflow: "auto",
            fontFamily: "monospace",
        }}
        ref={focusRootRef}
        tabIndex={-1}
        onKeyDown={ev => {
            if (ev.code === "Escape") {
                setIsBasecampShown(!isBasecampShown);
            }
            if (ev.code === "KeyK") {
                setIsTutorial(!isTutorial);
            }
            if (isTutorial && keyCodes.some((code) => ev.code === code)) {
                setIsTutorial(false);
            }
            if (ev.code === "KeyM") {
                if (ev.shiftKey) {
                    setMapShowState((mapShowState + 3 - 1) % 3);
                } else {
                    setMapShowState((mapShowState + 1) % 3);
                }
            }
        }}
    >
        <Canvas
            css={{ position: "absolute", inset: 0, zIndex: -1 }}
            gl={{
                useLegacyLights: true,
                toneMapping: NoToneMapping,
                antialias: true,
            }}
            shadows="percentage"
            frameloop="demand"
        >
            <MainScene />
        </Canvas>
        <div css={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            display: "flex",
            flex: "row",
            overflow: "hidden",
        }}>
            <div css={{
                position: "absolute",
                top: "50vh",
                left: "35vw",
                opacity: isMapShown ? 1 : 0,
                transformOrigin: "0 50%",
                scale: "2",
                translate: "0 -50%",
                padding: "0.2vmin",
                background: isMapBackShown
                    ? "#505050ff"
                    : "transparent",
            }} >
                <OverlayMap css={{ display: "block" }} />
            </div>

            <div css={{
                position: "absolute",
                top: "1vmin",
                left: "1vmin",
            }} >
                <MiniMap />
                <Gui css={{
                    pointerEvents: "all",
                }} />
            </div>

            <WorldSelectionPanel css={{
                height: "100%",
                inset: 0,
                overflowX: "hidden",
                position: "absolute",
                background: "rgba(0, 0, 0, 0.8)",
                pointerEvents: isBasecampShown ? "all" : "none",
                opacity: isBasecampShown ? 1 : 0,
            }} />
            <button // bascamp 
                css={{
                    padding: "0.0vmin 0.0vmin 0.4vmin 0.0vmin",
                    pointerEvents: "all",
                    position: "absolute",
                    right: "1vmin",
                    top: "1vmin",
                }}
                onClick={() => setIsBasecampShown(!isBasecampShown)}
            >
                {isBasecampShown
                    ? <XIcon css={{
                        width: "3vmin",
                        marginBottom: "-0.6vmin",
                    }} />
                    : <MenuIcon css={{
                        width: "3vmin",
                        marginBottom: "-0.6vmin",
                    }} />
                }
                <br />
                <span css={{
                    textDecoration: "underline",
                    fontSize: "1.2vmin",
                }} >Esc</span>
            </button>
            <div css={{ // appVersion panel
                position: "absolute",
                right: "6vmin",
                top: "1vmin",
                textAlign: "right",
                fontSize: "1.4vmin",
                lineHeight: "90%",
                textShadow: "0 0 0.2vmin black",
                color: "black",
                filter: "invert(1)",
                mixBlendMode: "difference",
            }}>
                {appVersion.split("+")[0]}<br />
                <span css={{ fontSize: "0.8em" }}>
                    {appVersion.split("+")[1]}
                </span>
            </div>
        </div>
        <button css={{
            position: "absolute",
            left: "6vmin",
            bottom: "14vmin",
            padding: "0vmin 0vmin 0.4vmin 0vmin",
            zIndex: 1,
        }}
            onClick={() => setIsTutorial(!isTutorial)}
        >
            <InformationCircle css={{
                width: "3vmin",
                marginBottom: "0.6vmin",
                display: "block",
            }}
            />
            <span css={{
                textDecoration: "underline",
                fontSize: "1.2vmin",
            }} >K</span>
        </button>
        {<Tutorial css={[{
            opacity: isTutorial ? 1 : 0,
            position: "absolute",
            left: isTutorial ? "50%" : "4vmin",
            bottom: isTutorial ? "20%" : "12vmin",
            transform: isTutorial
                ? "translate(-50%, 20%) scale(1)"
                : "translate(-50%,20%) scale(0.4)",
            transitionDuration: "800ms",
            owerflow: "hidden",
        }]} />}
    </div >;
}