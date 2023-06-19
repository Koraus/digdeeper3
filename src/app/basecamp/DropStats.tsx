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
import { useState } from "react";
import { Reload } from "@emotion-icons/ionicons-solid/Reload";
import { useTranslate } from "../languageRecoil";


export function DropStats({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const playerAction = useRecoilValue(playerActionRecoil);
    const dropzone = startForTrek(playerAction.trek).zone;
    const [refreahTrigger, setRefreahTrigger] = useState(0);
    const translate = useTranslate();

    const [treks, treksError, treksStatus] = usePromise(async () => {
        const treks = await fetchLastTreks();
        return treks
            .filter(t => t.v === sightVersion)
            .filter(t => eqDropzone(t.drop.zone, dropzone));
    }, [dropzone, refreahTrigger]);


    return <div {...props}>
        <button
            css={[{ margin: "0.9vmin 0" }]}
            onClick={() => { setRefreahTrigger(refreahTrigger + 1); }}
            disabled={treksStatus === "pending"}
        >
            <Reload css={{
                height: "1em",
                marginTop: "-0.2em",
            }} />
            &nbsp;{translate("Reload")}
        </button>
        <br />
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
        <div css={{ overflow: "auto", height: "100%" }}>
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
