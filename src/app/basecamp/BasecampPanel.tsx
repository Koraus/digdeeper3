import type { jsx } from "@emotion/react";
import { FavoriteDropzones } from "./FavoriteDropzones";
import { HistoricalDrops } from "./HistoricalDrops";
import { NewDropzones } from "./NewDropzones";
import { CurrentDropInfo } from "./CurrentDropInfo";
import { DevChoiceWorlds } from "./DevChoiceWorlds";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Ribbon } from "@emotion-icons/ionicons-solid/Ribbon";
import { Dice } from "@emotion-icons/fa-solid/Dice";
import { Star } from "@emotion-icons/ionicons-solid/Star";
import { History } from "@emotion-icons/fa-solid/History";
import { PlayerPanel } from "./PlayerPanel";
import { useRecoilState, useSetRecoilState } from "recoil";
import { languageRecoil, useResolveByLanguage, useTranslate } from "../languageRecoil";
import { TopWorlds } from "./TopWorlds";
import { Twemoji } from "react-emoji-render";
import { VolumeMute } from "@emotion-icons/fa-solid/VolumeMute";
import { VolumeUp } from "@emotion-icons/fa-solid/VolumeUp";
import { muteSoundsRecoil } from "../muteSoundsRecoil";


export function BasecampPanel({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    const iconStyle = {
        height: "1.2em",
        marginTop: "-0.25em",
    };

    const resolveByLanguage = useResolveByLanguage();
    const languageToDisplayAsSelected = resolveByLanguage({
        "en": "en",
        "uk": "ua",
    }) ?? "en";
    const setLanguage = useSetRecoilState(languageRecoil);
    const translate = useTranslate();

    const [muteSounds, setMuteSounds] = useRecoilState(muteSoundsRecoil);

    return <div
        css={[{
            padding: "0.5vmin",
            display: "flex",
            flexDirection: "column",
        }, cssProp]}
        {...props}
    >
        <CurrentDropInfo css={{
            margin: "0.5vmin",
        }} />
        <div css={{
            display: "flex",
            flexDirection: "row",
            minHeight: "0",
        }}>
            <PlayerPanel css={{
                margin: "5vmin 3vmin 2.5vmin 4.5vmin",
            }} />
            <div css={{
                margin: "2.5vmin",
            }}>
                <Tabs css={{
                    height: "100%",
                }}>
                    <div css={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <TabList>
                            <Tab>
                                <Ribbon css={iconStyle} />&nbsp;
                                {translate("Dev Choice Worlds")}
                            </Tab>
                            <Tab>
                                <Dice css={iconStyle} />&nbsp;
                                {translate("Generate Worlds")}
                            </Tab>
                            <Tab>
                                <Star css={iconStyle} />&nbsp;
                                {translate("Bookmarked Drops")}
                            </Tab>
                            <Tab>
                                <History css={iconStyle} />&nbsp;
                                {translate("Drop History")}
                            </Tab>
                            <Tab>
                                <History css={iconStyle} />&nbsp;
                                TOP10
                            </Tab>
                        </TabList>
                        <div css={[{
                            flexShrink: 1,
                            overflow: "hidden",
                        }, "&>* { height: 100% }"]}>
                            <TabPanel>
                                <DevChoiceWorlds css={{ height: "100%" }} />
                            </TabPanel>
                            <TabPanel>
                                <NewDropzones css={{ height: "100%" }} />
                            </TabPanel>
                            <TabPanel>
                                <FavoriteDropzones css={{ height: "100%" }} />
                            </TabPanel>
                            <TabPanel>
                                <HistoricalDrops css={{ height: "100%" }} />
                            </TabPanel>
                            <TabPanel>
                                <TopWorlds css={{ height: "100%" }} />
                            </TabPanel>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
        <div css={{
            position: "absolute",
            right: "13vmin",
            top: "1vmin",
            textAlign: "right",
            fontSize: "1.3em",
        }}>
            {[
                ["en", "en:us:"],
                ["uk", "uk:ua:"],
            ].map(([lang, name]) => <span
                key={lang}
                onClick={() => setLanguage(lang)}
                css={{
                    margin: "0 0.2em",
                    cursor: "pointer",
                    ...(languageToDisplayAsSelected === lang && {
                        borderBottom: "1px solid",
                    }),
                }}
            >
                <Twemoji>{name}</Twemoji>
            </span>)}
        </div>
        <button
            css={{
                position: "absolute",
                right: "7vmin",
                top: "1vmin",
                fontSize: "1.5em",
            }}
            onClick={() => setMuteSounds(!muteSounds)}
        >
            {
                muteSounds
                    ? <VolumeMute css={{
                        height: "1em",
                        margin: "0.15em 0.12em 0.18em 0em",
                    }} />
                    : <VolumeUp css={{
                        height: "1em",
                        margin: "0.15em 0em 0.18em 0em",
                    }} />
            }
        </button>
    </div >;
}

