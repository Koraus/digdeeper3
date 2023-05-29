import type { jsx } from "@emotion/react";
import { FavoriteDropzones } from "./FavoriteDropzones";
import { HistoricalWorlds } from "./HistoricalWorlds";
import { NewDropzones } from "./NewDropzones";
import { CurrentDropInfo } from "./CurrentDropInfo";
import { DropEquipmentSelector } from "./DropEquipmentSelector";

export function WorldSelectionPanel({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    return <div
        css={[{
            padding: "1vmin",
        }, cssProp]}
        {...props}
    >
        <CurrentDropInfo />
        <br />
        <DropEquipmentSelector />
        <NewDropzones />
        <FavoriteDropzones />
        <HistoricalWorlds />
    </div >;
}

