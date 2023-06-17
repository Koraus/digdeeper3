import { Today } from "@emotion-icons/material-rounded/Today";
import { generateDropzone, generateWorld } from "../model/generate";
import { jsx, keyframes } from "@emotion/react";
import { useSetDropzone } from "./basecamp/useSetDropzone";
import { useTranslate } from "./languageRecoil";
import usePromise from "react-use-promise";
import { LoaderCircle } from "@emotion-icons/boxicons-regular/LoaderCircle";
import { Error as ErrorIcon } from "@emotion-icons/boxicons-solid/Error";
import { HmacSHA256 } from "crypto-js";
import { generateRandomRule } from "../ca/generateRandomRule";
import { createCryptoRandom } from "../utils/createCryptoRandom";
import { caStateCount } from "../model/terms/World";
import { _never } from "../utils/_never";



export function NewGameInWildDailyDropzoneButton({
    css: cssProp, ...props
}: jsx.JSX.IntrinsicElements["button"]) {
    const translate = useTranslate();
    const setDropzone = useSetDropzone();
    const dayDatetime =
        new Date().toISOString().split("T")[0] + "T00:00:00.000Z";
    const [dailySeed, dailySeedError, dailySeedStatus] = usePromise(
        async () => {
            const url = `https://dd3.x-pl.art/dateseed/${dayDatetime}`;
            const response = await fetch(url);
            const dailySeed = await response.text();
            // console.log({ dailySeed: dailySeed });
            return dailySeed;
        },
        [dayDatetime]);
    const newGameInCuratedDailyDropzone = () => {
        if (!dailySeed) { return _never(); }
        setDropzone(generateDropzone({
            world: generateWorld({
                ca: generateRandomRule(
                    caStateCount,
                    createCryptoRandom(
                        HmacSHA256(dailySeed, "wildDaily.ruleSeed"))),
            }),

            // make it 31 bit to fit positive int32,
            // todo: fix/change prng to use full uint32 range
            seed:
                HmacSHA256(dailySeed, "wildDaily.dropzoneSeed")
                    .words[0] >>> 1,
        }));
    };
    return <button
        css={[{
            display: "flex",
            alignItems: "center",
        }, cssProp]}
        onClick={newGameInCuratedDailyDropzone}
        disabled={dailySeedStatus !== "resolved"}
        {...props}
    >
        {dailySeedStatus === "pending" && <LoaderCircle
            css={[{
                animation: `${keyframes`
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
                `} 2s linear infinite`,
                width: "2vmin",
                marginRight: "0.4vmin",
            }]} />}

        {dailySeedStatus === "rejected" && <ErrorIcon
            title={dailySeedError?.message ?? "Error"}
            css={{ width: "2vmin", marginRight: "0.4vmin" }} />}

        <Today css={{ width: "2vmin", marginRight: "0.4vmin" }} />
        {translate("Wild Daily Game")}
    </button>;
}
