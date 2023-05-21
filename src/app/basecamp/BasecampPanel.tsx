import type { jsx } from "@emotion/react";
import { FavoriteDropzones} from "./FavoriteDropzones";
import { HistoricalWorlds } from "./HistoricalWorlds";
import { NewDropzones } from "./NewDropzones";
import { CurrentDropInfo } from "./CurrentDropInfo";


export function WorldSelectionPanel({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    return <div
        css={[{
            //
        }, cssProp]}
        {...props}
    >
        <CurrentDropInfo/>
        <NewDropzones/>
        <FavoriteDropzones/>
        <HistoricalWorlds />
    </div >;
}

