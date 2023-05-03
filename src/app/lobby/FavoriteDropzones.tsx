import type { jsx } from "@emotion/react";
import { useState } from "react";
import { Bookmarks } from "@emotion-icons/ionicons-solid/Bookmarks";
import { ChevronForward } from "@emotion-icons/ionicons-solid/ChevronForward";
import { favoriteWorldsRecoil } from "./favoriteWorldsRecoil";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { WorldPreview } from "./WorldPreview";
import { trekRecoil } from "../trekRecoil";


export function FavoriteDropzones({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    const [isOpen, setIsOpen] = useState(false);
    const favorites = useRecoilValue(favoriteWorldsRecoil);
    const setProgression = useSetRecoilState(trekRecoil);

    return <div  {...props} css={[{ marginBottom: "1vmin" }]}>

        <h3
            onClick={() => setIsOpen(!isOpen)}
            css={[{
                margin: "0.9vmin 0",
            }]}>
            <ChevronForward css={[{
                transitionDuration: "100ms",
                width: "2vmin",
                marginRight: "0.4vmin",
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            }]} />
            <Bookmarks css={[{
                width: "2vmin",
                marginRight: "0.6vmin",
            }]} />Favorites</h3>

        {isOpen &&
            <div css={[{
                listStyle: "none",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            }]}>
                {favorites.map((dropzone, i) => <div key={i} css={[{
                    position: "relative",
                }]}>
                    <WorldPreview
                        css={[{
                            margin: "0.1vmin",
                        }]}
                        dropzone={dropzone} />
                    <button
                        onClick={() => setProgression({ dropzone })}
                        css={[{
                            position: "absolute",
                            bottom: "1vmin",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }]}
                    > Play!</button>
                </div>)}
            </div>
        }
    </div >;
}
