import "./initAnalytics";

import { Canvas } from "@react-three/fiber";
import { MainScene } from "./mainSscene/MainScene";
import { NoToneMapping } from "three";
import { appVersion } from "./appVersion";
import { Gui as _Gui } from "./Gui";
import { NewGameButtonsPanel as _NewGameButtonsPanel } from "./NewGameButtonsPanel";
import { EnergyPanel as _EnergyPanel } from "./EnergyPanel";
import { BasecampPanel as _BasecampPanel } from "./basecamp/BasecampPanel";
import { memo, useEffect, useRef, useState } from "react";
import { useGrabFocusFromBody } from "../utils/reactish/useGrabFocusFromBody";
import { Tent as BasecampIcon } from "@emotion-icons/fluentui-system-regular/Tent";
import { X as CloseIcon } from "@emotion-icons/boxicons-regular/X";
import { OverlayMap as _OverlayMap } from "./OverlayMap";
import { MiniMap as _MiniMap } from "./MiniMap";
import { ControlsHelpPanel as _ContraolsPanel, ControlsPanelVisibility, controlsPanelVisibilityToggle, controlsPanelVisibilityToggleInverse } from "./ControlsHelpPanel";
import "@fontsource/noto-sans-mono";
import { useRecoilValue } from "recoil";
import { playerProgressionRecoil } from "./playerProgressionRecoil";
import { startForTrek, trekRecoil } from "./trekRecoil";
import { dropShadow5 } from "../utils/dropShadow5";
import { FrameLimiter } from "../utils/reactish/FrameLimiter";
import { Invalidator } from "./Invalidator";
import { DisclaimerPanel as _DisclaimerPanel } from "./DisclaimerPanel";
import { CheckboxWarning as DisclaimerIcon } from "@emotion-icons/fluentui-system-regular/CheckboxWarning";


const eqStringify = <T,>(p: T, n: T) =>
    JSON.stringify(p) === JSON.stringify(n);

const MainCanvas = memo(() => <Canvas
    css={{ position: "absolute", inset: 0, zIndex: -1 }}
    gl={{
        useLegacyLights: true,
        toneMapping: NoToneMapping,
        antialias: true,
    }}
    shadows="percentage"
    frameloop="demand"
>
    <FrameLimiter fps={Infinity} />
    <Invalidator />
    <MainScene />
</Canvas>);

const OverlayMap = memo(
    (props: Parameters<typeof _OverlayMap>[0]) =>
        <_OverlayMap {...props} />,
    eqStringify);
const BasecampPanel = memo(
    (props: Parameters<typeof _BasecampPanel>[0]) =>
        <_BasecampPanel {...props} />,
    eqStringify);
const MiniMap = memo(
    (props: Parameters<typeof _MiniMap>[0]) =>
        <_MiniMap {...props} />,
    eqStringify);
const Gui = memo(
    (props: Parameters<typeof _Gui>[0]) =>
        <_Gui {...props} />,
    eqStringify);
const ControlsPanel = memo(
    (props: Parameters<typeof _ContraolsPanel>[0]) =>
        <_ContraolsPanel {...props} />,
    eqStringify);
const NewGameButtonsPanel = memo(
    (props: Parameters<typeof _NewGameButtonsPanel>[0]) =>
        <_NewGameButtonsPanel {...props} />,
    eqStringify);
const EnergyPanel = memo(
    (props: Parameters<typeof _EnergyPanel>[0]) =>
        <_EnergyPanel {...props} />,
    eqStringify);
const DisclaimerPanel = memo(
    (props: Parameters<typeof _DisclaimerPanel>[0]) =>
        <_DisclaimerPanel {...props} />,
    eqStringify);


export function App() {
    const [isBasecampShown, setIsBasecampShown] = useState(false);
    const [mapShowState, setMapShowState] = useState(0);
    const isMapShown = mapShowState > 0;
    const isMapBackShown = mapShowState === 2;
    const focusRootRef = useRef<HTMLDivElement>(null);
    useGrabFocusFromBody(focusRootRef);

    const { xp } = useRecoilValue(playerProgressionRecoil);
    const trek = useRecoilValue(trekRecoil);
    const hasMoved = trek !== startForTrek(trek);
    const [controlsVisibility, setControlsVisibility] =
        useState<ControlsPanelVisibility>(xp === 0 ? "tutorial" : "hint");
    const isControlsOpen =
        controlsVisibility === "open"
        || controlsVisibility === "tutorial";

    useEffect(() => {
        if (!hasMoved) { return; }
        if (controlsVisibility !== "tutorial") { return; }
        setControlsVisibility(
            controlsPanelVisibilityToggle[controlsVisibility]);
    }, [hasMoved]);

    const [isDisclaimerShown, setIsDisclaimerShown] = useState(false);

    return <div
        css={{
            display: "flex",
            position: "fixed",
            inset: "0",
            overflow: "auto",
            fontFamily: "'Noto Sans Mono', monospace",
            fontSize: "1.15vmin",
        }}
        ref={focusRootRef}
        tabIndex={-1}
        onKeyDown={ev => {
            if (ev.code === "Escape") {
                setIsBasecampShown(!isBasecampShown);
            }
            if (ev.code === "KeyH") {
                setControlsVisibility((ev.shiftKey
                    ? controlsPanelVisibilityToggleInverse
                    : controlsPanelVisibilityToggle
                )[controlsVisibility]);
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
        <MainCanvas />
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
                <div
                    css={{
                        pointerEvents: "all",
                        cursor: "pointer",
                    }}
                    onClick={() => setMapShowState((mapShowState + 1) % 3)}
                >
                    <MiniMap css={{
                        filter: dropShadow5("0.2em", "0.2em", "#00000080"),
                    }} />
                </div>
                <Gui css={{
                    pointerEvents: "all",
                }} />
            </div>
            <div
                css={{
                    pointerEvents: "all",
                    cursor: "pointer",
                    position: "absolute",
                    bottom: "1vmin",
                    left: "50%",
                    transformOrigin: "50% 100%",
                    translate: "-50%",
                    scale: isControlsOpen ? "1" : "0.4",
                    transitionDuration: "0ms",
                    owerflow: "hidden",
                }}
                onClick={(ev) => setControlsVisibility((ev.shiftKey
                    ? controlsPanelVisibilityToggleInverse
                    : controlsPanelVisibilityToggle
                )[controlsVisibility])}
            >
                <ControlsPanel visibility={controlsVisibility} />
            </div>
            <NewGameButtonsPanel css={{
                filter: dropShadow5("0.2em", "0.1em", "rgb(0 0 0 / 0.8)"),
                pointerEvents: "all",
                position: "absolute",
                right: "6vmin",
                top: "1vmin",
            }} />
            <EnergyPanel css={{
                position: "absolute",
                left: "1vmin",
                bottom: "1vmin",
                filter: dropShadow5("0.2em", "0.1em", "rgb(0 0 0 / 0.8)"),
            }} />
            <BasecampPanel css={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.9)",
                pointerEvents: isBasecampShown ? "all" : "none",
                visibility: isBasecampShown ? "visible" : "hidden",
            }} />
            <button // toggle basecamp 
                css={{
                    filter: dropShadow5("0.2em", "0.1em", "rgb(0 0 0 / 0.8)"),
                    padding: "0.0vmin 0.0vmin 0.4vmin 0.0vmin",
                    pointerEvents: "all",
                    position: "absolute",
                    right: "1vmin",
                    top: "1vmin",
                }}
                onClick={() => setIsBasecampShown(!isBasecampShown)}
            >
                {isBasecampShown
                    ? <CloseIcon css={{
                        width: "3vmin",
                        marginBottom: "-0.6vmin",
                    }} />
                    : <BasecampIcon css={{
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
            <button // toggle basecamp 
                css={{
                    filter: dropShadow5(
                        "0.2vmin", "0.2vmin", "rgb(0 0 0 / 0.5)"),
                    padding: "0",
                    pointerEvents: "all",
                    position: "absolute",
                    right: "1vmin",
                    bottom: "1vmin",
                    fontSize: "2.5em",
                    display: "flex",
                }}
                onClick={() => setIsDisclaimerShown(!isDisclaimerShown)}
            >
                {isDisclaimerShown
                    ? <CloseIcon css={{
                        width: "1em",
                        margin: "0.015em 0 -0.03em 0",
                    }} />
                    : <DisclaimerIcon css={{
                        width: "1em",
                        margin: "0.05em -0.05em -0.05em 0.05em",
                    }} />
                }
            </button>
            <div css={{ // appVersion panel
                position: "absolute",
                right: "5.4vmin",
                bottom: "1vmin",
                textAlign: "right",
                fontSize: "1.4vmin",
                lineHeight: "90%",
                filter: dropShadow5("0.2em", "0.2em", "#00000080"),
            }}>
                {appVersion.split("+")[0]}<br />
                <span css={{ fontSize: "0.8em" }}>
                    {appVersion.split("+")[1]}
                </span>
            </div>
            <DisclaimerPanel
                css={{
                    position: "absolute",
                    left: "50vw",
                    top: "50vh",
                    width: "60vmin",
                    maxHeight: "60vmin",
                    translate: "-50% -50%",
                    background: "rgba(0, 0, 0, 0.9)",
                    pointerEvents: isDisclaimerShown ? "all" : "none",
                    visibility: isDisclaimerShown ? "visible" : "hidden",
                    filter: dropShadow5("0.2em", "0.2em", "rgb(0 0 0 / 0.3)"),
                }}
                onClose={() => setIsDisclaimerShown(false)}
            />
        </div>
    </div >;
}