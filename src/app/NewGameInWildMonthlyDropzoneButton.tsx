import { Today } from "@emotion-icons/material-rounded/Today";
import { generateDropzone, generateWorld } from "../model/generate";
import { jsx, keyframes } from "@emotion/react";
import { useSetDropzone } from "./basecamp/useSetDropzone";
import { useTranslate } from "./languageRecoil";
import { LoaderCircle } from "@emotion-icons/boxicons-regular/LoaderCircle";
import { Error as ErrorIcon } from "@emotion-icons/boxicons-solid/Error";
import { HmacSHA256 } from "crypto-js";
import { generateRandomRule } from "../ca/generateRandomRule";
import { createCryptoRandom } from "../utils/createCryptoRandom";
import { caStateCount } from "../model/terms/World";
import { _never } from "../utils/_never";
import { useMonthlyDateseed } from "./fetchDateseed";



export function NewGameInWildMonthlyDropzoneButton({
    css: cssProp, ...props
}: jsx.JSX.IntrinsicElements["button"]) {
    const translate = useTranslate();
    const setDropzone = useSetDropzone();
    const [MonthlySeed, MonthlySeedError, MonthlySeedStatus] = useMonthlyDateseed();
    const newGameInCuratedMonthlyDropzone = () => {
        if (!MonthlySeed) { return _never(); }
        setDropzone(generateDropzone({
            world: generateWorld({
                ca: generateRandomRule(
                    caStateCount,
                    createCryptoRandom(
                        HmacSHA256(MonthlySeed, "wildMonthly.ruleSeed"))),
            }),

            // make it 31 bit to fit positive int32,
            // todo: fix/change prng to use full uint32 range
            seed:
                HmacSHA256(MonthlySeed, "wildMonthly.dropzoneSeed")
                    .words[0] >>> 1,
        }));
    };
    return <button
        css={[{
            display: "flex",
            alignItems: "center",
        }, cssProp]}
        onClick={newGameInCuratedMonthlyDropzone}
        disabled={MonthlySeedStatus !== "resolved"}
        {...props}
    >
        {MonthlySeedStatus === "pending" && <LoaderCircle
            css={[{
                animation: `${keyframes`
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
                `} 2s linear infinite`,
                width: "2vmin",
                marginRight: "0.4vmin",
            }]} />}

        {MonthlySeedStatus === "rejected" && <ErrorIcon
            title={MonthlySeedError?.message ?? "Error"}
            css={{ width: "2vmin", marginRight: "0.4vmin" }} />}

        <Today css={{ width: "2vmin", marginRight: "0.4vmin" }} />
        {translate("Wild Monthly Game")}
    </button>;
}
