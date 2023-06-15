import type { jsx } from "@emotion/react";


export function DropStats({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {


    return <div {...props}>
        <div css={{ display: "flex", height: "100%" }}>
            Drop Stats
        </div>
    </div>;
}
