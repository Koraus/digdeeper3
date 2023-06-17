import type { jsx } from "@emotion/react";
import usePromise from "react-use-promise";
import { fetchLastTreks } from "../fetchLastTreks";
import { LoaderCircle } from "@emotion-icons/boxicons-regular/LoaderCircle";


export function DropStats({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    const [treks] = usePromise(async () => {
        const treks = await fetchLastTreks(100);
        return treks;
    }, []);

    return <div {...props}>
        <div css={{ overflow: "auto", height: "100%" }}>
            {!treks && <LoaderCircle css={{ height: "8em", margin: "2em", }} />}
            {treks &&
                treks.map(
                    (i, index) => {
                        return <div key={index}
                            css={{ borderBottom: "1px solid gray" }}>
                            <p>
                                {JSON.stringify(i.v)}</p>
                            <p>
                                {JSON.stringify(i.bytecodeBase64)}</p>
                        </div>;
                    },
                )}
        </div>
    </div >;
}
