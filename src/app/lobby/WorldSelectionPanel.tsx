import type { jsx } from "@emotion/react";
import { FavoriteWorlds } from "./FavoriteWorlds";
import { HistoricalWorlds } from "./HistoricalWorlds";
import { GenerateDropzone } from "./GenerateDropzone";


export function WorldSelectionPanel({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    
        return <div
        css={[{
            background: "#000000b0",
            border: "1px solid #ffffffb0",
        }, cssProp]}
        {...props}
    >
        <GenerateDropzone />
        <FavoriteWorlds />
        <HistoricalWorlds />
    </div >;
}

