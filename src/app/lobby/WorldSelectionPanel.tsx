import type { jsx } from "@emotion/react";
import { FavoriteDropzones} from "./FavoriteDropzones";
import { HistoricalWorlds } from "./HistoricalWorlds";
import { NewDropzones } from "./NewDropzones";
import {СurrentWorldInfo} from "./СurrentWorldInfo";


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
        <СurrentWorldInfo/>
        <NewDropzones/>
        <FavoriteDropzones/>
        <HistoricalWorlds />
    </div >;
}

