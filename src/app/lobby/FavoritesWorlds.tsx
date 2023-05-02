import type { jsx } from "@emotion/react";
import { useState } from "react";
import { Bookmarks } from "@emotion-icons/ionicons-solid/Bookmarks";


export function FavoritesWorlds({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    const [isFavorites, setIsFavorites] = useState(false);

    return <div {...props}><h3
        onClick={() => setIsFavorites(!isFavorites)}
        css={[{
            margin: "0.9vmin 0",
        }]}>  <Bookmarks css={[{
            width: "2vmin",
            marginRight: "0.4vmin",
        }]} />favorites:</h3>
        {isFavorites &&
            <div> <span>111</span> </div>
        }

    </div>;
}
