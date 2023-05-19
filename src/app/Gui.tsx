import { useRecoilValue } from "recoil";
import { trekDropzone, sightAt } from "../model/terms";
import { trekRecoil } from "./trekRecoil";
import { useSetDropzone } from "./lobby/useSetDropzone";
import { RestartAlt } from "@emotion-icons/material/RestartAlt";
import { PinDrop } from "@emotion-icons/material-outlined/PinDrop";
import { World } from "@emotion-icons/boxicons-regular/World";
import { generateRandomDropzone } from "../model/Dropzone";


export function Gui() {
    const progression = useRecoilValue(trekRecoil);
    const sight = sightAt(progression);
    const dropzone = trekDropzone(progression);

    const setDropzone = useSetDropzone();

    return <div>

        <div>WASD / Arrows to move</div>
        <div>С to accept hint</div>
        <div>Z to undo</div>
        <div>---</div>
        <div>p: {sight.playerPosition.join(",")}</div>
        <div>Seed: {dropzone.seed}</div>
        <div>Energy: {sight.playerEnergy}</div>
        <div>Last move: {sight.log}</div>
        <div css={{
            pointerEvents: "all",
            display: "flex",
            flexWrap: "wrap",
        }}>
            <button
                onClick={() => setDropzone(dropzone)}
                css={[{
                    display: "flex",
                    alignItems: "center",
                }]}
            >
                <RestartAlt
                    css={[{
                        width: "2vmin",
                        marginRight: "0.4vmin",
                    }]}
                />
                Restart</button>
            <button
                css={[{
                    display: "flex",
                    alignItems: "center",
                }]}
                onClick={() =>
                    setDropzone(generateRandomDropzone(dropzone.world))}

            >
                <PinDrop
                    css={[{
                        width: "2vmin",
                        marginRight: "0.4vmin",
                    }]}
                />
                New Dropzone</button>
            <button
                css={[{
                    display: "flex",
                    alignItems: "center",
                }]}
                onClick={() =>
                    setDropzone(generateRandomDropzone())
                }
            >
                <World
                    css={[{
                        width: "2vmin",
                        marginRight: "0.4vmin",
                    }]}
                />
                New World</button>
        </div>
    </div >;
}
