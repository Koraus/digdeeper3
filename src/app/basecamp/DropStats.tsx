import type { jsx } from "@emotion/react";
import { useTranslate } from "../languageRecoil";


export function DropStats({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const translate = useTranslate();

    return <div {...props}>
        <div css={{ display: "flex", height: "100%" }}>
            {translate("Drop Stats")}
        </div>
    </div>;
}
