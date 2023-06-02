import type { jsx } from "@emotion/react";
import { favoriteDropzonesRecoil } from "./favoriteDropzonesRecoil";
import { useRecoilValue } from "recoil";
import { DropzonePreview } from "./DropzonePreview";
import { useSetDrop } from "./useSetDrop";
import { version } from "../../model/version";
import { Sparkles } from "@emotion-icons/ionicons-solid/Sparkles";



export function FavoriteDropzones({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const favoriteDropzones = useRecoilValue(favoriteDropzonesRecoil);
    const setDrop = useSetDrop();

    return <div  {...props}>
        {favoriteDropzones.length === 0 && <>
            <Sparkles css={{ height: "8em", margin: "2em" }} />
        </>}
        <div css={[{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
        }]}>
            {favoriteDropzones.map((dropzone, i) => <div key={i} css={[{
                position: "relative",
            }]}>
                <DropzonePreview
                    css={[{
                        margin: "0.1vmin",
                    }]}
                    dropzone={dropzone} />
                <button
                    onClick={() => setDrop({
                        v: version,
                        zone: dropzone,
                        depthLeftBehind: 10,
                        equipment: {
                            pickNeighborhoodIndex: 0,
                        },
                    })}
                    css={[{
                        position: "absolute",
                        bottom: "1vmin",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }]}
                > Play!</button>
            </div>)}
        </div>
    </div >;
}
