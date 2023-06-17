import type { jsx } from "@emotion/react";
import usePromise from "react-use-promise";
import { fetchLastTreks } from "../fetchLastTreks";
import { LoaderCircle } from "@emotion-icons/boxicons-regular/LoaderCircle";
import { Error as ErrorIcon } from "@emotion-icons/boxicons-solid/Error";
import { useRecoilValue } from "recoil";
import { playerActionRecoil, startForTrek } from "../playerActionRecoil";
import { eqDropzone } from "../../model/terms/Dropzone";
import { version as sightVersion } from "../../model/version";
import { Sparkles } from "@emotion-icons/ionicons-solid/Sparkles";


export function DropStats({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const playerAction = useRecoilValue(playerActionRecoil);
    const dropzone = startForTrek(playerAction.trek).zone;

    const [treks, treksError, treksStatus] = usePromise(async () => {
        const treks = await fetchLastTreks();
        return treks
            .filter(t => t.v === sightVersion)
            .filter(t => eqDropzone(t.drop.zone, dropzone));
    }, [dropzone]);

    return <div {...props}>
        <div css={{ overflow: "auto", height: "100%" }}>
            {treksStatus === "pending"
                && <LoaderCircle css={{ height: "8em", margin: "2em" }} />}
            {treksStatus === "rejected"
                && <>
                    <ErrorIcon css={{ height: "8em", margin: "2em" }} />
                    {treksError.message}
                </>}
            {treks && treks.length === 0 && <>
                <Sparkles css={{ height: "8em", margin: "2em" }} />
            </>}
            {treks && treks.map((i, index) => <div
                key={index}
                css={{ borderBottom: "1px solid gray" }}
            >
                <p>bytecodeLength: {JSON.stringify(i.bytecodeLength)}</p>
                <p>bytecodeBase64: {JSON.stringify(i.bytecodeBase64)}</p>
            </div>)}
        </div>
    </div >;
}
