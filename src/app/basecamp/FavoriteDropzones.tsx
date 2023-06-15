import type { jsx } from "@emotion/react";
import { favoriteDropzonesRecoil } from "./favoriteDropzonesRecoil";
import { useRecoilValue } from "recoil";
import { DropzonePreview } from "./DropzonePreview";
import { useSetDrop } from "./useSetDrop";
import { version } from "../../model/version";
import { Sparkles } from "@emotion-icons/ionicons-solid/Sparkles";
import { Hiking } from "@emotion-icons/fa-solid/Hiking";
import { dropEquipmentRecoil } from "./dropEquipmentRecoil";


export function FavoriteDropzones({
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {
    const favoriteDropzones = useRecoilValue(favoriteDropzonesRecoil);
    const setDrop = useSetDrop();
    const equipment = useRecoilValue(dropEquipmentRecoil);

    return <div  {...props} css={{ display: "flex" }}>
        {favoriteDropzones.length === 0 && <>
            <Sparkles css={{ height: "8em", margin: "2em" }} />
        </>}
        <div css={[{
            display: "flex",
            flexFlow: "row wrap",
            height: "100%",
            overflow: "auto",
        }]}>
            {favoriteDropzones.map((dropzone, i) => <div key={i} css={[{
                position: "relative",
                height: "fit-content",
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
                        equipment,
                    })}
                    css={[{
                        position: "absolute",
                        bottom: "10%",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }]}
                >  <Hiking css={{ height: "1em", marginTop: "-0.2em" }} />
                    &nbsp;Go!</button>
            </div>)}
        </div>
    </div >;
}
