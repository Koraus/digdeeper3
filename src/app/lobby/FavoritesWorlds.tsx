import type { jsx } from "@emotion/react";
import { useState } from "react";
import { Bookmarks } from "@emotion-icons/ionicons-solid/Bookmarks";
import { ChevronForward } from "@emotion-icons/ionicons-solid/ChevronForward";


export function FavoritesWorlds({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    const [isFavorites, setIsFavorites] = useState(false);

    return <div  {...props} css={[{ marginBottom: "1vmin" }]}>

        <h3
            onClick={() => setIsFavorites(!isFavorites)}
            css={[{
                margin: "0",
            }]}>

            <ChevronForward css={[{
                transitionDuration: "100ms",
                width: "2vmin",
                marginRight: "0.4vmin",
                transform: isFavorites ? "rotate(90deg)" : "rotate(0deg)",
            }]} />
            <Bookmarks css={[{
                width: "2vmin",
                marginRight: "0.6vmin",
            }]} />Favorites</h3>
        {isFavorites &&
            <div> <span>111</span> </div>
        }

    </div>;
}
